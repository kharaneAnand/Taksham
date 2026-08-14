import { z } from "zod";

export const addCartItemSchema =
  z.object({
    productId: z
      .string()
      .trim()
      .min(
        1,
        "Product ID is required",
      ),

    variantId: z
      .string()
      .trim()
      .min(
        1,
        "Variant ID cannot be empty",
      )
      .optional(),

    quantity: z
      .number()
      .int(
        "Quantity must be an integer",
      )
      .min(
        1,
        "Quantity must be at least 1",
      ),
  });

export const updateCartItemSchema =
  z.object({
    quantity: z
      .number()
      .int(
        "Quantity must be an integer",
      )
      .min(
        1,
        "Quantity must be at least 1",
      ),
  });

export const cartItemIdSchema =
  z.object({
    itemId: z
      .string()
      .trim()
      .min(
        1,
        "Cart item ID is required",
      ),
  });

export type AddCartItemInput =
  z.infer<
    typeof addCartItemSchema
  >;

export type UpdateCartItemInput =
  z.infer<
    typeof updateCartItemSchema
  >;