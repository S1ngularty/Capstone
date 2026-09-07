export interface CreateUploadReturn {
  videoId: `${string}-${string}-${string}-${string}-${string}`;
  storageKey: string;
  uploadUrl: string;
  expiresIn: number;
}
