import type { Document, Types } from "mongoose";

export type UserRole = "user" | "admin";

export interface IUser extends Document {
  _id: Types.ObjectId;
  clerkId: string;
  email: string;
  name: string;
  role: UserRole;
  phoneNumber?: string;
  farmLocation?: {
    province?: string;
    municipality?: string;
    barangay?: string;
  };
  preferredCrops?: string[];
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUser {
  clerkId: string;
  email: string;
  name: string;
  role?: UserRole;
  phoneNumber?: string;
  farmLocation?: {
    province?: string;
    municipality?: string;
    barangay?: string;
  };
  preferredCrops?: string[];
  isActive?: boolean;
  lastLoginAt?: Date;
}

export interface IUpdateUser {
  name?: string;
  role?: UserRole;
  phoneNumber?: string;
  farmLocation?: {
    province?: string;
    municipality?: string;
    barangay?: string;
  };
  preferredCrops?: string[];
  isActive?: boolean;
  lastLoginAt?: Date;
}

export interface IUserFilter {
  clerkId?: string;
  email?: string;
  role?: UserRole;
  isActive?: boolean;
  province?: string;
  municipality?: string;
  preferredCrops?: string[];
}

export interface IUserProjection {
  includePhoneNumber?: boolean;
  includeFarmLocation?: boolean;
  includePreferredCrops?: boolean;
  includeTimestamps?: boolean;
}

export interface IUserListOptions {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "updatedAt" | "name" | "email";
  sortOrder?: "asc" | "desc";
  filter?: IUserFilter;
  projection?: IUserProjection;
}

export interface IUserListResult {
  users: IUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}