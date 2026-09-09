import videoRoutes from "../modules/video/video.route.js";
import userRoutes from "../modules/user/user.route.js";
import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

router.use("/users", userRoutes);
router.use("/videos", videoRoutes);

export default router;
