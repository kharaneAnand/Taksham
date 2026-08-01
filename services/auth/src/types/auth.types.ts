import { UserRole } from "../constants/role.js";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}