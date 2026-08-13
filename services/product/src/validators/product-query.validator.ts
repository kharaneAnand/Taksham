import { z } from "zod";

export const productQuerySchema = z
  .object({
    page: z.coerce
      .number()
      .int()
      .min(1)
      .default(1),

    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(50)
      .default(12),

    search: z
      .string()
      .trim()
      .optional(),

    category: z
      .string()
      .trim()
      .optional(),

    subcategory: z
      .string()
      .trim()
      .optional(),

    room: z
      .string()
      .trim()
      .optional(),

    material: z
      .string()
      .trim()
      .optional(),

    color: z
      .string()
      .trim()
      .optional(),

    minPrice: z.coerce
      .number()
      .min(0)
      .optional(),

    maxPrice: z.coerce
      .number()
      .min(0)
      .optional(),

    sort: z
      .enum([
        "price_asc",
        "price_desc",
        "rating",
        "newest",
        "oldest",
        "popular",
      ])
      .default("newest"),
  })
  .refine(
    (data) =>
      data.minPrice === undefined ||
      data.maxPrice === undefined ||
      data.minPrice <= data.maxPrice,
    {
      message:
        "minPrice cannot be greater than maxPrice",
      path: ["minPrice"],
    },
  );

export type ProductQueryInput = z.infer<
  typeof productQuerySchema
>;