export interface IUser extends Document {
  clerkId: string;
  email: string;
  name: string;
  role: "farmer" | "admin";
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
