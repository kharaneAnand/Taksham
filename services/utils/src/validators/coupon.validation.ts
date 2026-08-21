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
 * BASE COUPON SCHEMA
 *
 * Keep this schema free from refinements.
 * This allows us to safely use .partial()
 * for update validation.
 * ======================================== */

const couponBaseSchema = z.object({
  code: z
    .string()
    .trim()
    .min(
      3,
      "Coupon code must contain at least 3 characters",
    )
    .max(
      50,
      "Coupon code cannot exceed 50 characters",
    )
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "Coupon code can contain only letters, numbers, hyphens and underscores",
    )
    .transform((value) =>
      value.toUpperCase(),
    ),

  name: z
    .string()
    .trim()
    .min(
      2,
      "Coupon name must contain at least 2 characters",
    )
    .max(
      150,
      "Coupon name cannot exceed 150 characters",
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
    .array(z.string())
    .default([]),

  collectionIds: z
    .array(z.string())
    .default([]),

  minimumOrderAmount: z
    .number({
      error:
        "Minimum order amount must be a number",
    })
    .min(
      0,
      "Minimum order amount cannot be negative",
    )
    .default(0),

  maximumDiscountAmount: z
    .number({
      error:
        "Maximum discount amount must be a number",
    })
    .positive(
      "Maximum discount amount must be greater than 0",
    )
    .optional(),

  usageLimit: z
    .number({
      error:
        "Usage limit must be a number",
    })
    .int(
      "Usage limit must be a whole number",
    )
    .positive(
      "Usage limit must be greater than 0",
    )
    .optional(),

  startDate: z.coerce.date({
    error:
      "A valid start date is required",
  }),

  endDate: z.coerce.date({
    error:
      "A valid end date is required",
  }),

  isActive: z
    .boolean()
    .optional()
    .default(true),
});

/* ========================================
 * CREATE COUPON
 * ======================================== */

export const createCouponSchema =
  couponBaseSchema.superRefine(
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
       * MAXIMUM DISCOUNT
       *
       * Only meaningful for percentage
       * coupons.
       * ================================ */

      if (
        data.discountType === "fixed" &&
        data.maximumDiscountAmount !==
          undefined
      ) {
        ctx.addIssue({
          code:
            z.ZodIssueCode.custom,

          path: [
            "maximumDiscountAmount",
          ],

          message:
            "Maximum discount amount can only be used with percentage coupons",
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
        data.collectionIds.length === 0
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
       * ================================ */

      if (
        data.appliesTo === "all" &&
        (
          data.productIds.length > 0 ||
          data.collectionIds.length > 0
        )
      ) {
        ctx.addIssue({
          code:
            z.ZodIssueCode.custom,

          path: [
            "appliesTo",
          ],

          message:
            "All-products coupons cannot contain selected products or collections",
        });
      }
    },
  );

/* ========================================
 * UPDATE COUPON
 * ======================================== */

export const updateCouponSchema =
  couponBaseSchema
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
         * Validate only when both dates
         * are provided.
         * ================================ */

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
         * FIXED DISCOUNT
         * ================================ */

        if (
          data.discountType === "fixed" &&
          data.maximumDiscountAmount !==
            undefined
        ) {
          ctx.addIssue({
            code:
              z.ZodIssueCode.custom,

            path: [
              "maximumDiscountAmount",
            ],

            message:
              "Maximum discount amount can only be used with percentage coupons",
          });
        }

        /* ================================
         * PRODUCTS
         * ================================ */

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
         * ================================ */

        if (
          data.appliesTo ===
            "collections" &&
          data.collectionIds !==
            undefined &&
          data.collectionIds.length === 0
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
         * ================================ */

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
              data.collectionIds.length > 0
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
              "All-products coupons cannot contain selected products or collections",
          });
        }
      },
    );

/* ========================================
 * VALIDATE COUPON
 *
 * Used when the customer enters a coupon
 * during checkout.
 * ======================================== */

export const validateCouponSchema =
  z.object({
    code: z
      .string()
      .trim()
      .min(
        1,
        "Coupon code is required",
      )
      .transform((value) =>
        value.toUpperCase(),
      ),

    items: z
      .array(
        z.object({
          productId: z.string(),

          collectionId: z
            .string()
            .optional(),

          quantity: z
            .number()
            .int()
            .positive(),

          price: z
            .number()
            .nonnegative(),
        }),
      )
      .min(
        1,
        "At least one item is required",
      ),
  });

/* ========================================
 * TYPES
 * ======================================== */

export type CreateCouponInput =
  z.infer<
    typeof createCouponSchema
  >;

export type UpdateCouponInput =
  z.infer<
    typeof updateCouponSchema
  >;

export type ValidateCouponInput =
  z.infer<
    typeof validateCouponSchema
  >;