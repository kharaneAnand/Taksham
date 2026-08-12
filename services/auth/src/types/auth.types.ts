import { UserRole } from "../constants/role.js";

export interface AuthUser {
  id: string;

  firstName: string;
  lastName: string;

  email: string;
  phone: string;

  avatar: {
    url: string;
    publicId: string;
  };

  role: UserRole;

  isVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}