
export interface IPresignedUploadResponse {
  videoId: string | null;
  storageKey: string;
  uploadUrl: string;
  expiresIn: number;
}
