import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";
import {
  SYSTEM_ROLES,
  type ROLE_TYPES,
} from "../core/constants/roles.constant.js";
import { UserService } from "../modules/user/user.service.js";

export class AuthMiddleware {
  static requireSession(req: Request, res: Response, next: NextFunction) {
    const auth = getAuth(req);

    // Checks if a token was parsed and a session is validly active
    if (!auth || !auth.userId) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No active session or valid authentication token found.",
      });
    }

    // Continue to the route handler if authenticated
    next();
  }

  static requireRole(allowedRole: ROLE_TYPES) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const auth = getAuth(req);

      if (!auth || !auth.userId) {
        return res.status(401).json({
          error: "Unauthorized",
          message: "No active session or valid authentication token found.",
        });
      }

      try {
        const user = await UserService.getUserByClerkId(auth.userId);
        if (user?.role !== allowedRole) {
          return res.status(403).json({
            error: "Forbidden",
            message:
              "You do not have the required permissions to access this resource.",
          });
        }

        next();
      } catch (error) {
        console.error("Role Checking Error:", error);
        return next(error);
      }
    };
  }
}
