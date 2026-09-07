import type { Response } from "express";

export interface ApiResponse<T> {
  message: string;
  success: boolean;
  result: T;
}

export type ResponseDefault<T> = Response<ApiResponse<T>>;