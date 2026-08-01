import { Document } from "mongoose";
import { UserRole } from "../constants/role.js";

export interface IUser extends Document {
  firstName: string;
  lastName: string;

  email: string;
  password: string;

  phone: string;
  avatar: string;

  role: UserRole;

  isVerified: boolean;

  refreshToken: string;

  createdAt: Date;
  updatedAt: Date;
}