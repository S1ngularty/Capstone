import { randomUUID } from "node:crypto";
import { r2Client } from "../../integrations/storage/r2.client.js";

import type { CreateVideoInput, Video } from "./video.types.js";

import { validateVideoUpload } from "./video.validation.js";

export class VideoService {
  async createUpload(userId: string, input: CreateVideoInput) {
    validateVideoUpload(input.contentType, input.fileSize);

    const videoId = randomUUID();

    const extension =
      input.contentType === "video/mp4"
        ? "mp4"
        : input.contentType === "video/webm"
          ? "webm"
          : "mov";

    const storageKey = `videos/${userId}/${videoId}/original.${extension}`;
    const uploadUrl = await r2Client.createUploadUrl(
      storageKey,
      input.contentType,
    );

    // Save metadata to DB here.
    //
    // await videoRepository.create({
    //   id: videoId,
    //   userId,
    //   storageKey,
    //   contentType: input.contentType,
    //   status: "pending_upload",
    // });

    return {
      videoId,
      storageKey,
      uploadUrl,
      expiresIn: 300,
    };
  }
}

export const videoService = new VideoService();
