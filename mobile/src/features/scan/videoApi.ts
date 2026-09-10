import { client } from "../../api/apiClient";

import type {
  CreateVideoUploadRequest,
  CreateVideoUploadResponse,
} from "./types/videoTypes";

class VideoAPI {
  async requestVideoUpload(
    input: CreateVideoUploadRequest,
    token: string,
  ): Promise<CreateVideoUploadResponse> {
    return client.request(
      "/api/v1/videos/upload",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
      token,
    );
  }

  async completeVideoUpload(videoId: string, token: string): Promise<void> {
    await client.request(
      `/api/videos/${videoId}/complete`,
      {
        method: "POST",
      },
      token,
    );
  }
}

export const videoApi = new VideoAPI()