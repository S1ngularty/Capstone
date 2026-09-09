import { Router } from "express";

import { createVideoUpload } from "./video.controller.js";
import { requireSession } from "../../middleware/auth.middleware.js";

const router = Router();

router.route("/upload").post(requireSession, createVideoUpload);

export default router;
