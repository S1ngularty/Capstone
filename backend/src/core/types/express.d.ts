import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: string;
      role: "user" | "admin" | "super_admin" | "checker" | "merchandiser";
      email: string;
    };
    // file?: Express.Multer.File;
  }
}
