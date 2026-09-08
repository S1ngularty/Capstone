import type { ApiResponse } from "../types/api.type.js";
import type { Response } from "express";

export const wrapResponse = <T>(
  message: string,
  status: number,
  res: Response<ApiResponse<T>>,
  data: T,
) => {
  res.status(status).json({
    message: message,
    success: status < 400,
    result: data,
  });
};
