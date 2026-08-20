import { z } from "zod";

/*
 * ========================================
 * Product Image Schema
 * ========================================
 */

export const productImageSchema =
  z.object({
    url: z
      .string()
      .trim()
      .min(1, "Image URL is required"),

    publicId: z
      .string()
      .trim()
      .min(1, "Image public ID is required"),
  });

/*
 * ========================================
 * Product Variant Schema
 * ========================================
 */

export const productVariantSchema =
  z.object({
    color: z
      .string()
      .trim()
      .min(1, "Variant color is required")
      .optional(),

    images: z
      .array(productImageSchema)
      .min(
        1,
        "At least one variant image is required",
      ),

    price: z
      .number()
      .min(
        0,
        "Variant price cannot be negative",
      )
      .optional(),

    stock: z
      .number()
      .int(
        "Variant stock must be an integer",
      )
      .min(
        0,
        "Variant stock cannot be negative",
      )
      .optional(),

    material: z
      .string()
      .trim()
      .min(
        1,
        "Variant material cannot be empty",
      )
      .optional(),
  });

/*
 * ========================================
 * Create Product Schema
 * ========================================
 */

export const createProductSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Product name must contain at least 2 characters",
      )
      .max(
        150,
        "Product name cannot exceed 150 characters",
      ),

    slug: z
      .string()
      .trim()
      .min(
        2,
        "Product slug is required",
      )
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain only lowercase letters, numbers and hyphens",
      ),

    price: z
      .number()
      .min(
        0,
        "Price cannot be negative",
      ),

    /*
     * Main / Cover Image
     */
    image: productImageSchema,

    /*
     * Additional Common Product Images
     */
    images: z
      .array(productImageSchema)
      .optional(),

    category: z
      .string()
      .trim()
      .min(
        1,
        "Category is required",
      ),

    subcategory: z
      .string()
      .trim()
      .optional(),

    room: z
      .string()
      .trim()
      .min(
        1,
        "Room is required",
      ),

    material: z
      .string()
      .trim()
      .optional(),

    colors: z
      .array(
        z
          .string()
          .trim()
          .min(1),
      )
      .optional(),

    description: z
      .string()
      .trim()
      .max(
        2000,
        "Description cannot exceed 2000 characters",
      )
      .optional(),

    rating: z
      .number()
      .min(0)
      .max(5)
      .optional(),

    reviews: z
      .number()
      .int()
      .min(0)
      .optional(),

    isNewProduct: z
      .boolean()
      .optional(),

    stock: z
      .number()
      .int(
        "Stock must be an integer",
      )
      .min(
        0,
        "Stock cannot be negative",
      ),

    variants: z
      .array(productVariantSchema)
      .optional(),
  });

/*
 * ========================================
 * Update Product Schema
 * ========================================
 */

export const updateProductSchema =
  createProductSchema.partial();

/*
 * ========================================
 * Product ID Schema
 * ========================================
 */

export const productIdSchema =
  z.object({
    id: z
      .string()
      .trim()
      .min(
        1,
        "Product ID is required",
      ),
  });

/*
 * ========================================
 * Product Slug Schema
 * ========================================
 */

export const productSlugSchema =
  z.object({
    slug: z
      .string()
      .trim()
      .min(
        1,
        "Product slug is required",
      ),
  });

/*
 * ========================================
 * Types
 * ========================================
 */

export type CreateProductInput =
  z.infer<typeof createProductSchema>;

export type UpdateProductInput =
  z.infer<typeof updateProductSchema>;

export type ProductVariantInput =
  z.infer<typeof productVariantSchema>;

export type ProductImageInput =
  z.infer<typeof productImageSchema>;