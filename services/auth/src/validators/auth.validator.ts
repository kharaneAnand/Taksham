import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().trim().min(2).max(50),

  lastName: z.string().trim().min(2).max(50),

  email: z.email().trim().toLowerCase(),

  password: z
    .string()
    .trim()
    .min(8)
    .max(100),

  phone: z
    .string()
    .trim()
    .optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;