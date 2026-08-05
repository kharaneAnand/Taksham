import mongoose from "mongoose";

import { IUser } from "../types/user.types.js";
import { UserRole } from "../constants/role.js";

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    avatar: {
      url: {
        type: String,
        default: "",
      },

      publicId: {
        type: String,
        default: "",
      },
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
      default: "",
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;