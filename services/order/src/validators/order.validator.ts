import { z } from "zod";

/*
 * ========================================
 * Shipping Address
 * ========================================
 */

const shippingAddressSchema =
  z.object({
    firstName: z
      .string()
      .trim()
      .min(
        1,
        "First name is required",
      )
      .max(
        50,
        "First name is too long",
      ),

    lastName: z
      .string()
      .trim()
      .min(
        1,
        "Last name is required",
      )
      .max(
        50,
        "Last name is too long",
      ),

    phone: z
      .string()
      .trim()
      .regex(
        /^[6-9]\d{9}$/,
        "Enter a valid 10-digit phone number",
      ),

    address: z
      .string()
      .trim()
      .min(
        5,
        "Address is too short",
      )
      .max(
        250,
        "Address is too long",
      ),

    city: z
      .string()
      .trim()
      .min(
        1,
        "City is required",
      )
      .max(
        100,
        "City is too long",
      ),

    state: z
      .string()
      .trim()
      .min(
        1,
        "State is required",
      )
      .max(
        100,
        "State is too long",
      ),

    pincode: z
      .string()
      .trim()
      .regex(
        /^\d{6}$/,
        "Enter a valid 6-digit pincode",
      ),

    landmark: z
      .string()
      .trim()
      .max(
        150,
        "Landmark is too long",
      )
      .optional(),
  });

/*
 * ========================================
 * Create Order
 * ========================================
 */

export const createOrderSchema =
  z.object({
    shippingAddress:
      shippingAddressSchema,

    shippingMethod: z.enum([
      "standard",
      "express",
    ]),

    paymentMethod: z.enum([
      "cod",
      "online",
    ]),
  });

/*
 * ========================================
 * Order ID Params
 * ========================================
 */

export const orderIdParamSchema =
  z.object({
    id: z
      .string()
      .trim()
      .min(
        1,
        "Order ID is required",
      ),
  });

/*
 * ========================================
 * Types
 * ========================================
 */

export type CreateOrderInput =
  z.infer<
    typeof createOrderSchema
  >;

export type OrderIdParam =
  z.infer<
    typeof orderIdParamSchema
  >;