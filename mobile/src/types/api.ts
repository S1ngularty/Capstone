export interface WrapServerResponse <T>{
  message: string;
  success: boolean;
  result: T;
  error?: string;
  timestamp?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    [key: string]: any;
  };
}
