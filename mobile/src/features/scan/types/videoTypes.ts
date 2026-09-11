export interface CreateVideoUploadRequest {
  fileName: string;
  contentType: string;
  fileSize: number;
}

export interface CreateVideoUploadResponse {
  videoId: string;
  storageKey: string;
  uploadUrl: string;
  expiresIn: number;
}