import { z } from "zod";

/*
 * ========================================
 * Create Category
 * ========================================
 */

export const createCategorySchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Category name must contain at least 2 characters",
      )
      .max(
        100,
        "Category name cannot exceed 100 characters",
      ),

    slug: z
      .string()
      .trim()
      .min(
        2,
        "Category slug is required",
      )
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain only lowercase letters, numbers and hyphens",
      ),
  });

/*
 * ========================================
 * Update Category
 * ========================================
 */

export const updateCategorySchema =
  createCategorySchema.partial();

/*
 * ========================================
 * Add Subcategory
 * ========================================
 */

export const createSubcategorySchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Subcategory name must contain at least 2 characters",
      )
      .max(
        100,
        "Subcategory name cannot exceed 100 characters",
      ),

    slug: z
      .string()
      .trim()
      .min(
        2,
        "Subcategory slug is required",
      )
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain only lowercase letters, numbers and hyphens",
      ),
  });

  /* 
 * ========================================
 * Update Subcategory
 * ========================================
 */

export const updateSubcategorySchema =
  createSubcategorySchema.partial();

/*
 * ========================================
 * Category ID Params
 * ========================================
 */

export const categoryIdSchema =
  z.object({
    id: z
      .string()
      .trim()
      .min(
        1,
        "Category ID is required",
      ),
  });

/*
 * ========================================
 * Category Slug Params
 * ========================================
 */

export const categorySlugSchema =
  z.object({
    slug: z
      .string()
      .trim()
      .min(
        1,
        "Category slug is required",
      ),
  });

/*
 * ========================================
 * Types
 * ========================================
 */

export type CreateCategoryInput =
  z.infer<typeof createCategorySchema>;

export type UpdateCategoryInput =
  z.infer<typeof updateCategorySchema>;

export type CreateSubcategoryInput =
  z.infer<typeof createSubcategorySchema>;

export type UpdateSubcategoryInput =
  z.infer<
    typeof updateSubcategorySchema
  >;