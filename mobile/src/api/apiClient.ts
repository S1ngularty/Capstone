import { WrapServerResponse } from "../types/api";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("EXPO_PUBLIC_API_URL is not configured");
}

class API {
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(
    path: string,
    options: RequestInit = {},
    {
      token,
      idempotencyKey,
      contentType = "application/json",
    }: {
      token?: string | null;
      idempotencyKey?: string | null;
      contentType?: string;
    } = {},
  ): Promise<WrapServerResponse<T>> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": contentType,
        ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || `Request failed with status ${response.status}`,
      );
    }

    return response.json();
  }
}

export const client = new API(API_URL);
