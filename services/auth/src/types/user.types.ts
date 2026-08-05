import { Document } from "mongoose";
import { UserRole } from "../constants/role.js";

export interface IUserAvatar {
  url: string;
  publicId: string;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;

  email: string;
  password: string;

  phone: string;

  avatar: IUserAvatar;

  role: UserRole;

  isVerified: boolean;

  refreshToken: string;

  createdAt: Date;
  updatedAt: Date;
}