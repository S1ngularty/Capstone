import { UserModel } from "./user.model.js";
import type {
  IUser,
  ICreateUser,
  IUpdateUser,
  IUserFilter,
  IUserProjection,
  IUserListOptions,
  IUserListResult,
  UserRole,
} from "./user.types.js";
import type { UpdateQuery, ProjectionType, SortOrder } from "mongoose";

export class UserRepository {
  /**
   * Build projection object based on what fields to include
   */
  private static buildProjection(projection?: IUserProjection): string {
    if (!projection) return "";

    const fields: string[] = [];
    
    if (projection.includePhoneNumber === false) fields.push("-phoneNumber");
    if (projection.includeFarmLocation === false) fields.push("-farmLocation");
    if (projection.includePreferredCrops === false) fields.push("-preferredCrops");
    if (projection.includeTimestamps === false) fields.push("-createdAt -updatedAt");
    
    return fields.join(" ");
  }

  /**
   * Find a user by their Clerk ID
   */
  static async findByClerkId(
    clerkId: string,
    projection?: IUserProjection,
  ): Promise<IUser | null> {
    const query = UserModel.findOne({ clerkId });
    
    const projectionString = this.buildProjection(projection);
    if (projectionString) query.select(projectionString);
    
    return query.exec();
  }

  /**
   * Find a user by email
   */
  static async findByEmail(
    email: string,
    projection?: IUserProjection,
  ): Promise<IUser | null> {
    const query = UserModel.findOne({ 
      email: email.toLowerCase() 
    });
    
    const projectionString = this.buildProjection(projection);
    if (projectionString) query.select(projectionString);
    
    return query.exec();
  }

  /**
   * Find user by MongoDB ObjectId
   */
  static async findById(
    id: string,
    projection?: IUserProjection,
  ): Promise<IUser | null> {
    const query = UserModel.findById(id);
    
    const projectionString = this.buildProjection(projection);
    if (projectionString) query.select(projectionString);
    
    return query.exec();
  }

  /**
   * Create a new user
   */
  static async create(data: ICreateUser): Promise<IUser> {
    return UserModel.create({
      ...data,
      role: data.role || "user",
      isActive: data.isActive ?? true,
    });
  }

  /**
   * Find or create user by Clerk ID
   */
  static async findOrCreateByClerkId(
    clerkId: string,
    data: ICreateUser,
  ): Promise<{ user: IUser; created: boolean }> {
    const existingUser = await this.findByClerkId(clerkId);
    
    if (existingUser) {
      return { user: existingUser, created: false };
    }

    const newUser = await this.create({
      ...data,
      clerkId,
    });

    return { user: newUser, created: true };
  }

  /**
   * Update user by Clerk ID
   */
  static async updateByClerkId(
    clerkId: string,
    updates: UpdateQuery<IUser>,
    options: { new?: boolean; runValidators?: boolean } = { new: true, runValidators: true },
  ): Promise<IUser | null> {
    return UserModel.findOneAndUpdate(
      { clerkId },
      { $set: updates },
      options,
    ).exec();
  }

  /**
   * Update user by MongoDB ObjectId
   */
  static async updateById(
    id: string,
    updates: UpdateQuery<IUser>,
    options: { new?: boolean; runValidators?: boolean } = { new: true, runValidators: true },
  ): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(
      id,
      { $set: updates },
      options,
    ).exec();
  }

  /**
   * Update preferred crops for a user
   */
  static async updatePreferredCrops(
    clerkId: string,
    crops: string[],
  ): Promise<IUser | null> {
    return UserModel.findOneAndUpdate(
      { clerkId },
      { $set: { preferredCrops: crops } },
      { new: true, runValidators: true },
    ).exec();
  }

  /**
   * Update last login timestamp
   */
  static async updateLastLogin(clerkId: string): Promise<IUser | null> {
    return UserModel.findOneAndUpdate(
      { clerkId },
      { $set: { lastLoginAt: new Date() } },
      { new: true },
    ).exec();
  }

  /**
   * Soft delete (deactivate) user
   */
  static async deactivateUser(clerkId: string): Promise<IUser | null> {
    return UserModel.findOneAndUpdate(
      { clerkId },
      { $set: { isActive: false } },
      { new: true },
    ).exec();
  }

  /**
   * Reactivate user
   */
  static async reactivateUser(clerkId: string): Promise<IUser | null> {
    return UserModel.findOneAndUpdate(
      { clerkId },
      { $set: { isActive: true } },
      { new: true },
    ).exec();
  }

  /**
   * Hard delete user from database
   */
  static async deleteUser(clerkId: string): Promise<boolean> {
    const result = await UserModel.findOneAndDelete({ clerkId }).exec();
    return result !== null;
  }

  /**
   * Get users list with pagination and filters
   */
  static async getUsersList(
    options: IUserListOptions = {},
  ): Promise<IUserListResult> {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      filter = {},
      projection,
    } = options;

    const skip = (page - 1) * limit;
    
    // Build filter query
    const filterQuery: any = {};
    
    if (filter.clerkId) filterQuery.clerkId = filter.clerkId;
    if (filter.email) filterQuery.email = filter.email.toLowerCase();
    if (filter.role) filterQuery.role = filter.role;
    if (filter.isActive !== undefined) filterQuery.isActive = filter.isActive;
    if (filter.province) filterQuery["farmLocation.province"] = filter.province;
    if (filter.municipality) filterQuery["farmLocation.municipality"] = filter.municipality;
    if (filter.preferredCrops && filter.preferredCrops.length > 0) {
      filterQuery.preferredCrops = { $in: filter.preferredCrops };
    }

    // Build sort object
    const sortOptions: { [key: string]: SortOrder } = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    // Build projection string
    const projectionString = this.buildProjection(projection);

    // Execute queries
    const query = UserModel.find(filterQuery);
    
    if (projectionString) query.select(projectionString);
    
    const [users, total] = await Promise.all([
      query
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec(),
      UserModel.countDocuments(filterQuery).exec(),
    ]);

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get all users by role
   */
  static async getUsersByRole(
    role: UserRole,
    projection?: IUserProjection,
  ): Promise<IUser[]> {
    const query = UserModel.find({ role, isActive: true });
    
    const projectionString = this.buildProjection(projection);
    if (projectionString) query.select(projectionString);
    
    return query.exec();
  }

  /**
   * Check if user exists by Clerk ID
   */
  static async existsByClerkId(clerkId: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ clerkId }).exec();
    return count > 0;
  }

  /**
   * Check if email already exists
   */
  static async existsByEmail(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ 
      email: email.toLowerCase() 
    }).exec();
    return count > 0;
  }

  /**
   * Get count of users by role
   */
  static async countByRole(role: UserRole): Promise<number> {
    return UserModel.countDocuments({ role, isActive: true }).exec();
  }
}