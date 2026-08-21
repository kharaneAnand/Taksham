import { z } from "zod";

/*
 * ========================================
 * Collection Image Schema
 * ========================================
 */

const collectionImageSchema =
  z.object({
    url: z
      .string()
      .trim()
      .min(
        1,
        "Collection image URL is required",
      ),

    publicId: z
      .string()
      .trim()
      .min(
        1,
        "Collection image public ID is required",
      ),
  });

/*
 * ========================================
 * Create Collection Schema
 * ========================================
 */

export const createCollectionSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Collection name must contain at least 2 characters",
      )
      .max(
        150,
        "Collection name cannot exceed 150 characters",
      ),

    slug: z
      .string()
      .trim()
      .min(
        2,
        "Collection slug is required",
      )
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain only lowercase letters, numbers and hyphens",
      ),

    description: z
      .string()
      .trim()
      .max(
        2000,
        "Description cannot exceed 2000 characters",
      )
      .optional(),

    image: collectionImageSchema
      .optional(),

    products: z
      .array(
        z
          .string()
          .trim()
          .min(
            1,
            "Product ID is required",
          ),
      )
      .default([]),

    isActive: z
      .boolean()
      .optional(),
  });

/*
 * ========================================
 * Update Collection Schema
 * ========================================
 */

export const updateCollectionSchema =
  createCollectionSchema.partial();

/*
 * ========================================
 * Collection ID Schema
 * ========================================
 */

export const collectionIdSchema =
  z.object({
    id: z
      .string()
      .trim()
      .min(
        1,
        "Collection ID is required",
      ),
  });

/*
 * ========================================
 * Collection Slug Schema
 * ========================================
 */

export const collectionSlugSchema =
  z.object({
    slug: z
      .string()
      .trim()
      .min(
        1,
        "Collection slug is required",
      ),
  });

/*
 * ========================================
 * Types
 * ========================================
 */

export type CreateCollectionInput =
  z.infer<
    typeof createCollectionSchema
  >;

export type UpdateCollectionInput =
  z.infer<
    typeof updateCollectionSchema
  >;