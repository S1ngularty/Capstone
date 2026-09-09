import { Router } from "express";
import { UserController } from "./user.controller.js";
import { AuthMiddleware } from "../../middleware/auth.middleware.js";

const router = Router();

// All user routes require authentication
router.use(AuthMiddleware.requireSession);

// Current user routes (authenticated user's own profile)
router.get("/me", UserController.getCurrentUser);
router.patch("/me", UserController.updateCurrentUser);
router.put("/me/preferred-crops", UserController.updatePreferredCrops);

// Admin-only routes
// router.use(requireSession);

// User management routes (admin only)
router.get("/stats/overview", UserController.getUserStats);
router.get("/", UserController.getUsersList);
router.get("/:userId", UserController.getUserById);
router.patch("/:userId/role", UserController.updateUserRole);
router.patch("/:userId/deactivate", UserController.deactivateUser);
router.patch("/:userId/reactivate", UserController.reactivateUser);
router.delete("/:userId", UserController.deleteUser);

export default router;
