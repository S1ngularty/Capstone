import mongoose, { Schema, Document, Model, model } from "mongoose";
import type { HydratedDocument } from "mongoose";
import type { IUser } from "./user.types.js";

type UserModel = Model<IUser>;

const userSchema = new Schema<IUser, UserModel>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["farmer", "admin"],
      default: "farmer",
    },
    phoneNumber: {
      type: String,
      sparse: true,
    },
    farmLocation: {
      province: String,
      municipality: String,
      barangay: String,
    },
    preferredCrops: [
      {
        type: String,
        enum: ["tomato", "eggplant", "pepper", "potato"],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: Date,
  },
  {
    timestamps: true,
    collection: "users",
  },
);

export type UserDocument = HydratedDocument<IUser>;

// Indexes for common queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ "farmLocation.province": 1 });

export const UserModel = mongoose.model<IUser>("User", userSchema);
