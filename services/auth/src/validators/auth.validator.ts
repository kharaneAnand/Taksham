import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters"),

  email: z
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password cannot exceed 100 characters"),

  phone: z
    .string()
    .trim()
    .optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const resendVerificationEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email"),
});

export type ResendVerificationEmailInput = z.infer<typeof resendVerificationEmailSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email"),
});

export type ForgotPasswordInput =
  z.infer<typeof forgotPasswordSchema>;

  export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type ResetPasswordInput =
  z.infer<typeof resetPasswordSchema>;