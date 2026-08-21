import { z } from "zod";

/* ========================================
 * ENUMS
 * ======================================== */

const discountTypeSchema = z.enum([
  "percentage",
  "fixed",
]);

const appliesToSchema = z.enum([
  "all",
  "products",
  "collections",
]);

/* ========================================
 * BASE OFFER SCHEMA
 *
 * Keep this schema free from refinements.
 * This allows us to safely use .partial()
 * for update validation.
 * ======================================== */

const offerBaseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(
      2,
      "Offer name must contain at least 2 characters",
    )
    .max(
      150,
      "Offer name cannot exceed 150 characters",
    ),

  slug: z
    .string()
    .trim()
    .min(
      2,
      "Offer slug is required",
    )
    .max(
      180,
      "Offer slug cannot exceed 180 characters",
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

  discountType: discountTypeSchema,

  discountValue: z
    .number({
      error:
        "Discount value must be a number",
    })
    .positive(
      "Discount value must be greater than 0",
    ),

  appliesTo: appliesToSchema,

  productIds: z
    .array(
      z.string(),
    )
    .default([]),

  collectionIds: z
    .array(
      z.string(),
    )
    .default([]),

  startDate: z
    .coerce
    .date({
      error:
        "A valid start date is required",
    }),

  endDate: z
    .coerce
    .date({
      error:
        "A valid end date is required",
    }),

  isActive: z
    .boolean()
    .optional()
    .default(true),
});

/* ========================================
 * CREATE OFFER
 * ======================================== */

export const createOfferSchema =
  offerBaseSchema.superRefine(
    (data, ctx) => {
      /* ================================
       * PERCENTAGE LIMIT
       * ================================ */

      if (
        data.discountType ===
          "percentage" &&
        data.discountValue > 100
      ) {
        ctx.addIssue({
          code:
            z.ZodIssueCode.custom,

          path: [
            "discountValue",
          ],

          message:
            "Percentage discount cannot exceed 100%",
        });
      }

      /* ================================
       * DATE VALIDATION
       * ================================ */

      if (
        data.endDate <=
        data.startDate
      ) {
        ctx.addIssue({
          code:
            z.ZodIssueCode.custom,

          path: [
            "endDate",
          ],

          message:
            "End date must be after start date",
        });
      }

      /* ================================
       * PRODUCTS
       * ================================ */

      if (
        data.appliesTo ===
          "products" &&
        data.productIds.length === 0
      ) {
        ctx.addIssue({
          code:
            z.ZodIssueCode.custom,

          path: [
            "productIds",
          ],

          message:
            "Select at least one product",
        });
      }

      /* ================================
       * COLLECTIONS
       * ================================ */

      if (
        data.appliesTo ===
          "collections" &&
        data.collectionIds.length ===
          0
      ) {
        ctx.addIssue({
          code:
            z.ZodIssueCode.custom,

          path: [
            "collectionIds",
          ],

          message:
            "Select at least one collection",
        });
      }

      /* ================================
       * ALL PRODUCTS
       *
       * Prevent unnecessary targets.
       * ================================ */

      if (
        data.appliesTo === "all" &&
        (
          data.productIds.length > 0 ||
          data.collectionIds.length >
            0
        )
      ) {
        ctx.addIssue({
          code:
            z.ZodIssueCode.custom,

          path: [
            "appliesTo",
          ],

          message:
            "All-products offers cannot contain selected products or collections",
        });
      }
    },
  );

/* ========================================
 * UPDATE OFFER
 *
 * IMPORTANT:
 * We call .partial() on the BASE schema,
 * not on createOfferSchema.
 *
 * This avoids the Zod v4 refinement error.
 * ======================================== */

export const updateOfferSchema =
  offerBaseSchema
    .partial()
    .superRefine(
      (data, ctx) => {
        /* ================================
         * PERCENTAGE LIMIT
         * ================================ */

        if (
          data.discountType ===
            "percentage" &&
          data.discountValue !==
            undefined &&
          data.discountValue > 100
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode.custom,

            path: [
              "discountValue",
            ],

            message:
              "Percentage discount cannot exceed 100%",
          });
        }

        /* ================================
         * DATE VALIDATION
         *
         * Only validate when both dates
         * are provided in the update.
         * ================================= */

        if (
          data.startDate &&
          data.endDate &&
          data.endDate <=
            data.startDate
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode.custom,

            path: [
              "endDate",
            ],

            message:
              "End date must be after start date",
          });
        }

        /* ================================
         * PRODUCTS
         *
         * Validate only when appliesTo
         * is explicitly changed.
         * ================================= */

        if (
          data.appliesTo ===
            "products" &&
          data.productIds !==
            undefined &&
          data.productIds.length === 0
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode.custom,

            path: [
              "productIds",
            ],

            message:
              "Select at least one product",
          });
        }

        /* ================================
         * COLLECTIONS
         * ================================= */

        if (
          data.appliesTo ===
            "collections" &&
          data.collectionIds !==
            undefined &&
          data.collectionIds.length ===
            0
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode.custom,

            path: [
              "collectionIds",
            ],

            message:
              "Select at least one collection",
          });
        }

        /* ================================
         * ALL PRODUCTS
         * ================================= */

        if (
          data.appliesTo === "all" &&
          (
            (
              data.productIds !==
                undefined &&
              data.productIds.length > 0
            ) ||
            (
              data.collectionIds !==
                undefined &&
              data.collectionIds.length >
                0
            )
          )
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode.custom,

            path: [
              "appliesTo",
            ],

            message:
              "All-products offers cannot contain selected products or collections",
          });
        }
      },
    );

/* ========================================
 * TYPES
 * ======================================== */

export type CreateOfferInput =
  z.infer<
    typeof createOfferSchema
  >;

export type UpdateOfferInput =
  z.infer<
    typeof updateOfferSchema
  >;