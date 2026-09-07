import type { Request, Response, NextFunction } from "express";

import { videoService } from "./video.service.js";
import type { CreateVideoInput, Video } from "./video.types.js";
import type { ApiResponse } from "../../core/types/api.type.js";
import type { CreateUploadReturn } from "./video.dto.js";
import { wrapResponse } from "../../core/utils/response.util.js";

export async function createVideoUpload(
  req: Request<{}, {}, CreateVideoInput>,
  res: Response<ApiResponse<CreateUploadReturn>>,
  next: NextFunction,
) {
  try {
    const userId = req.user?.userId;

    if (!userId) throw new Error("missing userId");

    const { fileName, contentType, fileSize } = req.body;

    const result = await videoService.createUpload(userId, {
      fileName,
      contentType,
      fileSize,
    });

    wrapResponse("OK", 200, res, result);
  } catch (error) {}
}
