// ==========================================
// ENUMS / UNION TYPES
// ==========================================

export type VideoStatus =
  | "pending_upload"
  | "uploaded"
  | "processing"
  | "completed"
  | "failed";

// ==========================================
// DOMAIN MODEL (plain shape, not Mongoose)
// ==========================================

export interface Video {
  id: string;
  userId: string;
  storageKey: string;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  status: VideoStatus;
  idempotencyKey: string;
  processedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// CREATE / INPUT TYPES
// ==========================================

/**
 * Input from client to initiate an upload.
 * No storageKey yet — backend generates it.
 */
export interface CreateVideoInput {
  fileName: string;
  contentType: string;
  fileSize: number;
}

/**
 * Internal create payload used by service/repository.
 * Includes generated fields like storageKey and userId.
 */
export interface ICreateVideo {
  userId: string;
  storageKey: string;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  idempotencyKey: string;
  status?: VideoStatus;
  processedAt?: Date | null;
}

// ==========================================
// UPDATE TYPES
// ==========================================

export interface IUpdateVideo {
  status?: VideoStatus;
  processedAt?: Date | null;
  storageKey?: string;
  originalFileName?: string;
}

export interface UpdateVideoStatusInput {
  status: VideoStatus;
  processedAt?: Date | null;
}

// ==========================================
// FILTER / QUERY TYPES
// ==========================================

export interface IVideoFilter {
  userId?: string;
  status?: VideoStatus;
  createdAfter?: Date;
  createdBefore?: Date;
}

export interface IVideoProjection {
  includeStorageKey?: boolean;
  includeFileSize?: boolean;
  includeContentType?: boolean;
  includeTimestamps?: boolean;
}

export interface IVideoListOptions {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "processedAt" | "originalFileName";
  sortOrder?: "asc" | "desc";
  filter?: IVideoFilter;
  projection?: IVideoProjection;
}

// ==========================================
// OWNERSHIP / AUTHORIZATION
// ==========================================

export interface IVideoOwnershipCheck {
  videoId: string;
  userId: string;
}

