import { UserModel } from "./user.model.js";
import type { ICreateUser, IUser } from "./user.types.js";

export class UserService {
  static async findOrCreateByClerkId(
    clerkId: string,
    payload: ICreateUser,
  ): Promise<IUser> {
    let user = await UserModel.findOne({ clerkId: clerkId });

    if (!user) {
      user = await UserModel.create(payload);
    } else {
      // Update last login time
      user.lastLoginAt = new Date();
      await user.save();
    }

    return user;
  }

  static async getUserByClerkId(clerkId: string): Promise<IUser | null> {
    return UserModel.findOne({ clerkId, isActive: true });
  }

  static async updateUserProfile(
    clerkId: string,
    updates: Partial<IUser>,
  ): Promise<IUser | null> {
    return UserModel.findOneAndUpdate(
      { clerkId },
      { $set: updates },
      { new: true, runValidators: true },
    );
  }

  static async updatePreferredCrops(
    clerkId: string,
    crops: string[],
  ): Promise<IUser | null> {
    return UserModel.findOneAndUpdate(
      { clerkId },
      { $set: { preferredCrops: crops } },
      { new: true },
    );
  }

  static async deactivateUser(clerkId: string): Promise<void> {
    await UserModel.findOneAndUpdate(
      { clerkId },
      { $set: { isActive: false } },
    );
  }
}
