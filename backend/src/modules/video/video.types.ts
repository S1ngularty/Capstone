export type VideoStatus =
  | "pending_upload"
  | "uploaded"
  | "processing"
  | "completed"
  | "failed";

export interface CreateVideoInput {
  fileName: string;
  contentType: string;
  fileSize: number;
}

export interface Video {
  id: string;
  userId: string;
  storageKey: string;
  contentType: string;
  status: VideoStatus;
}