export const ROUTES = {
  HOME: "/",

  LOGIN: "/login",
  REGISTER: "/register",

  VERIFY_EMAIL: "/verify-email/:token",

  FORGOT_PASSWORD: "/forgot-password",

  RESET_PASSWORD: "/reset-password/:token",

  PROFILE: "/profile",

  ADMIN: "/admin",
} as const;