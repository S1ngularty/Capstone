import type { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service.js";
import { wrapResponse } from "../../core/utils/response.util.js";
import {
  updateProfileSchema,
  updatePreferredCropsSchema,
  updateRoleSchema,
  getUsersQuerySchema,
} from "./user.validation.js";
import type { IUserListOptions } from "./user.types.js";

export class UserController {
  /**
   * Get current user profile
   * GET /api/v1/users/me
   */
  static async getCurrentUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.auth) {
        wrapResponse("User not authenticated", 401, res, null);
        return;
      }

      const user = await UserService.getUserByClerkId(req.auth.userId);

      if (!user) {
        wrapResponse("User profile not found", 404, res, null);
        return;
      }

      wrapResponse("User profile retrieved successfully", 200, res, {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        role: user.role,
        phoneNumber: user.phoneNumber,
        farmLocation: user.farmLocation,
        preferredCrops: user.preferredCrops,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update current user profile
   * PATCH /api/v1/users/me
   */
  static async updateCurrentUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.auth) {
        wrapResponse("User not authenticated", 401, res, null);
        return;
      }

      // Validate request body
      const validationResult = updateProfileSchema.safeParse(req.body);

      if (!validationResult.success) {
        wrapResponse(
          validationResult.error.issues.map((e) => e.message).join(", "),
          400,
          res,
          null,
        );
        return;
      }

      const user = await UserService.updateUserProfile(
        req.auth.userId,
        validationResult.data,
      );

      if (!user) {
        wrapResponse("User not found", 404, res, null);
        return;
      }

      wrapResponse("Profile updated successfully", 200, res, {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        phoneNumber: user.phoneNumber,
        farmLocation: user.farmLocation,
        preferredCrops: user.preferredCrops,
        updatedAt: user.updatedAt,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update preferred crops for current user
   * PUT /api/v1/users/me/preferred-crops
   */
  static async updatePreferredCrops(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      if (!req.auth) {
        wrapResponse("User not authenticated", 401, res, null);
        return;
      }

      // Validate request body
      const validationResult = updatePreferredCropsSchema.safeParse(req.body);

      if (!validationResult.success) {
        wrapResponse(
          validationResult.error.issues.map((e) => e.message).join(", "),
          400,
          res,
          null,
        );
        return;
      }

      const user = await UserService.updatePreferredCrops(
        req.auth.userId,
        validationResult.data.preferredCrops,
      );

      if (!user) {
        wrapResponse("User not found", 404, res, null);
        return;
      }

      wrapResponse("Preferred crops updated successfully", 200, res, {
        preferredCrops: user.preferredCrops,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user by ID (admin only)
   * GET /api/v1/users/:userId
   */
  static async getUserById(
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params;

      const user = await UserService.getUserById(userId);

      if (!user) {
        wrapResponse("User not found", 404, res, null);
        return;
      }

      wrapResponse("User retrieved successfully", 200, res, {
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        role: user.role,
        phoneNumber: user.phoneNumber,
        farmLocation: user.farmLocation,
        preferredCrops: user.preferredCrops,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get paginated list of users (admin only)
   * GET /api/v1/users
   */
  static async getUsersList(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Validate query parameters
      const validationResult = getUsersQuerySchema.safeParse(req.query);

      if (!validationResult.success) {
        wrapResponse(
          validationResult.error.issues.map((e) => e.message).join(", "),
          400,
          res,
          null,
        );
        return;
      }

      const {
        page,
        limit,
        sortBy,
        sortOrder,
        role,
        isActive,
        province,
        municipality,
      } = validationResult.data;

      // Build filter options
      const listOptions: IUserListOptions = {
        page,
        limit,
        sortBy,
        sortOrder,
        filter: {
          role,
          isActive,
          province,
          municipality,
        },
      };

      const result = await UserService.getUsersList(listOptions);

      // Transform users for response
      const users = result.users.map((user) => ({
        id: user._id,
        clerkId: user.clerkId,
        email: user.email,
        name: user.name,
        role: user.role,
        phoneNumber: user.phoneNumber,
        farmLocation: user.farmLocation,
        preferredCrops: user.preferredCrops,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
      }));

      wrapResponse("Users retrieved successfully", 200, res, {
        users,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user role (admin only)
   * PATCH /api/v1/users/:userId/role
   */
  static async updateUserRole(
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params;

      // Validate request body
      const validationResult = updateRoleSchema.safeParse(req.body);

      if (!validationResult.success) {
        wrapResponse(
          validationResult.error.issues.map((e) => e.message).join(", "),
          400,
          res,
          null,
        );
        return;
      }

      // Get user by MongoDB ID
      const user = await UserService.getUserById(userId);

      if (!user) {
        wrapResponse("User not found", 404, res, null);
        return;
      }

      // Update role using clerkId
      const updatedUser = await UserService.updateUserRole(
        user.clerkId,
        validationResult.data.role,
      );

      if (!updatedUser) {
        wrapResponse("Failed to update user role", 500, res, null);
        return;
      }

      wrapResponse("User role updated successfully", 200, res, {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deactivate user (admin only)
   * PATCH /api/v1/users/:userId/deactivate
   */
  static async deactivateUser(
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params;

      const user = await UserService.getUserById(userId);

      if (!user) {
        wrapResponse("User not found", 404, res, null);
        return;
      }

      // Prevent self-deactivation
      if (req.auth && user.clerkId === req.auth.userId) {
        wrapResponse("You cannot deactivate your own account", 400, res, null);
        return;
      }

      const deactivatedUser = await UserService.deactivateUser(user.clerkId);

      if (!deactivatedUser) {
        wrapResponse("Failed to deactivate user", 500, res, null);
        return;
      }

      wrapResponse("User deactivated successfully", 200, res, {
        id: deactivatedUser._id,
        email: deactivatedUser.email,
        isActive: deactivatedUser.isActive,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reactivate user (admin only)
   * PATCH /api/v1/users/:userId/reactivate
   */
  static async reactivateUser(
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params;

      const user = await UserService.getUserById(userId);

      if (!user) {
        wrapResponse("User not found", 404, res, null);
        return;
      }

      const reactivatedUser = await UserService.reactivateUser(user.clerkId);

      if (!reactivatedUser) {
        wrapResponse("Failed to reactivate user", 500, res, null);
        return;
      }

      wrapResponse("User reactivated successfully", 200, res, {
        id: reactivatedUser._id,
        email: reactivatedUser.email,
        isActive: reactivatedUser.isActive,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete user permanently (admin only)
   * DELETE /api/v1/users/:userId
   */
  static async deleteUser(
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params;

      const user = await UserService.getUserById(userId);

      if (!user) {
        wrapResponse("User not found", 404, res, null);
        return;
      }

      // Prevent self-deletion
      if (req.auth && user.clerkId === req.auth.userId) {
        wrapResponse("You cannot delete your own account", 400, res, null);
        return;
      }

      await UserService.deleteUser(user.clerkId);

      wrapResponse("User deleted successfully", 200, res, null);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user statistics (admin only)
   * GET /api/v1/users/stats/overview
   */
  static async getUserStats(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const stats = await UserService.getUserStats();

      wrapResponse("User statistics retrieved successfully", 200, res, stats);
    } catch (error) {
      next(error);
    }
  }
}
