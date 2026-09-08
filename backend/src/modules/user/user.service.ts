import { UserRepository } from "./user.repository.js";
import type {
  IUser,
  ICreateUser,
  IUpdateUser,
  IUserListOptions,
  IUserListResult,
  UserRole,
} from "./user.types.js";

export class UserService {
  /**
   * Find or create user by Clerk ID
   * This is called after Clerk authentication to sync user data
   */
  static async findOrCreateByClerkId(
    clerkId: string,
    payload: ICreateUser,
  ): Promise<{ user: IUser; created: boolean }> {
    // Normalize email
    const normalizedPayload = {
      ...payload,
      email: payload.email.toLowerCase(),
    };

    const result = await UserRepository.findOrCreateByClerkId(clerkId, normalizedPayload);

    // If user exists, update last login
    if (!result.created) {
      await UserRepository.updateLastLogin(clerkId);
    }

    return result;
  }

  /**
   * Get user by Clerk ID
   */
  static async getUserByClerkId(clerkId: string): Promise<IUser | null> {
    return UserRepository.findByClerkId(clerkId);
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<IUser | null> {
    return UserRepository.findByEmail(email);
  }

  /**
   * Get user by MongoDB ID
   */
  static async getUserById(id: string): Promise<IUser | null> {
    return UserRepository.findById(id);
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(
    clerkId: string,
    updates: IUpdateUser,
  ): Promise<IUser | null> {
    // Prevent updating clerkId and email through this method
    const { name, role, phoneNumber, farmLocation, preferredCrops } = updates;
    
    const safeUpdates: Partial<IUpdateUser> = {};
    
    if (name !== undefined) safeUpdates.name = name;
    if (role !== undefined) safeUpdates.role = role;
    if (phoneNumber !== undefined) safeUpdates.phoneNumber = phoneNumber;
    if (farmLocation !== undefined) safeUpdates.farmLocation = farmLocation;
    if (preferredCrops !== undefined) safeUpdates.preferredCrops = preferredCrops;

    return UserRepository.updateByClerkId(clerkId, safeUpdates);
  }

  /**
   * Update user role (admin only)
   */
  static async updateUserRole(
    clerkId: string,
    role: UserRole,
  ): Promise<IUser | null> {
    // Validate role
    if (!["user", "admin"].includes(role)) {
      throw new Error("Invalid role");
    }

    return UserRepository.updateByClerkId(clerkId, { role });
  }

  /**
   * Update preferred crops for a user
   */
  static async updatePreferredCrops(
    clerkId: string,
    crops: string[],
  ): Promise<IUser | null> {
    // Validate crops
    const validCrops = ["tomato", "eggplant", "pepper", "crop_4", "crop_5", "crop_6"];
    const invalidCrops = crops.filter(crop => !validCrops.includes(crop));
    
    if (invalidCrops.length > 0) {
      throw new Error(`Invalid crops: ${invalidCrops.join(", ")}`);
    }

    // Remove duplicates
    const uniqueCrops = [...new Set(crops)];

    return UserRepository.updatePreferredCrops(clerkId, uniqueCrops);
  }

  /**
   * Deactivate user (soft delete)
   */
  static async deactivateUser(clerkId: string): Promise<IUser | null> {
    const user = await UserRepository.findByClerkId(clerkId);
    
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.isActive) {
      throw new Error("User is already deactivated");
    }

    return UserRepository.deactivateUser(clerkId);
  }

  /**
   * Reactivate user
   */
  static async reactivateUser(clerkId: string): Promise<IUser | null> {
    const user = await UserRepository.findByClerkId(clerkId);
    
    if (!user) {
      throw new Error("User not found");
    }

    if (user.isActive) {
      throw new Error("User is already active");
    }

    return UserRepository.reactivateUser(clerkId);
  }

  /**
   * Delete user permanently (admin only)
   */
  static async deleteUser(clerkId: string): Promise<boolean> {
    const user = await UserRepository.findByClerkId(clerkId);
    
    if (!user) {
      throw new Error("User not found");
    }

    return UserRepository.deleteUser(clerkId);
  }

  /**
   * Get paginated list of users
   */
  static async getUsersList(
    options: IUserListOptions = {},
  ): Promise<IUserListResult> {
    // Set default options
    const listOptions: IUserListOptions = {
      page: options.page || 1,
      limit: Math.min(options.limit || 10, 50), // Max 50 per page
      sortBy: options.sortBy || "createdAt",
      sortOrder: options.sortOrder || "desc",
      filter: options.filter || {},
    };

    return UserRepository.getUsersList(listOptions);
  }

  /**
   * Get all active users by role
   */
  static async getUsersByRole(role: UserRole): Promise<IUser[]> {
    if (!["user", "admin"].includes(role)) {
      throw new Error("Invalid role");
    }

    return UserRepository.getUsersByRole(role);
  }

  /**
   * Check if user has admin role
   */
  static async isAdmin(clerkId: string): Promise<boolean> {
    const user = await UserRepository.findByClerkId(clerkId, {
      includePhoneNumber: false,
      includeFarmLocation: false,
      includePreferredCrops: false,
      includeTimestamps: false,
    });

    return user?.role === "admin";
  }

  /**
   * Check if user exists
   */
  static async userExists(clerkId: string): Promise<boolean> {
    return UserRepository.existsByClerkId(clerkId);
  }

  /**
   * Check if email is already taken
   */
  static async emailExists(email: string): Promise<boolean> {
    return UserRepository.existsByEmail(email);
  }

  /**
   * Get user statistics (admin dashboard)
   */
  static async getUserStats(): Promise<{
    totalUsers: number;
    totalAdmins: number;
    activeUsers: number;
  }> {
    const [allUsers, admins, activeUsers] = await Promise.all([
      UserRepository.getUsersList({ limit: 1, filter: { isActive: true } }),
      UserRepository.countByRole("admin"),
      UserRepository.getUsersList({ limit: 1, filter: { isActive: true } }),
    ]);

    return {
      totalUsers: allUsers.total,
      totalAdmins: admins,
      activeUsers: activeUsers.total,
    };
  }
}