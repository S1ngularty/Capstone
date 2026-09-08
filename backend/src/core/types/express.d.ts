import "express-serve-static-core";

// 1. We extract the standard AuthObject directly from Clerk
import type { AuthObject } from "@clerk/express";

// 2. We build a custom type where userId is guaranteed to be a string
type StrictlyAuthenticatedAuth = Omit<AuthObject, "userId"> & {
  userId: string;
};

declare module "express-serve-static-core" {
  interface Request {
    // Overriding auth to guarantee it represents an authenticated state
    auth: StrictlyAuthenticatedAuth;
    
    // Keeping your custom user object intact in case you use it elsewhere
    user?: {
      userId: string;
      role: "user" | "admin";
      email: string;
    };
  }
}
