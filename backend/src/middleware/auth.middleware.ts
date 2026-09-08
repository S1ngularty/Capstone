import { getAuth } from "@clerk/express";
import type { Request, Response, NextFunction } from "express";

export function requireSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const auth = getAuth(req);

  // Checks if a token was parsed and a session is validly active
  if (!auth || !auth.userId ) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "No active session or valid authentication token found.",
    });
  }

  // Continue to the route handler if authenticated
  next();
}
