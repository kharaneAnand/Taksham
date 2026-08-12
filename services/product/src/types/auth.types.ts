export interface AuthUser {
  id: string;
  email: string;
  role: "customer" | "admin";
}