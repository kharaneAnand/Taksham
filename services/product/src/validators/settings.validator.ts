import { z } from "zod";

export const updateSettingsSchema =
  z.object({
    storeName:
      z.string()
        .trim()
        .min(1)
        .optional(),

    email:
      z.string()
        .email()
        .optional(),

    phone:
      z.string()
        .optional(),

    address:
      z.string()
        .optional(),

    currency:
      z.string()
        .min(1)
        .optional(),

    currencySymbol:
      z.string()
        .min(1)
        .optional(),

    taxRate:
      z.number()
        .min(0)
        .max(100)
        .optional(),

    /*
     * Standard Delivery
     */

    standardDeliveryEnabled:
      z.boolean()
        .optional(),

    standardDeliveryCharge:
      z.number()
        .min(0)
        .optional(),

    standardDeliveryMinDays:
      z.number()
        .min(0)
        .optional(),

    standardDeliveryMaxDays:
      z.number()
        .min(0)
        .optional(),

    /*
     * Express Delivery
     */

    expressDeliveryEnabled:
      z.boolean()
        .optional(),

    expressDeliveryCharge:
      z.number()
        .min(0)
        .optional(),

    expressDeliveryMinDays:
      z.number()
        .min(0)
        .optional(),

    expressDeliveryMaxDays:
      z.number()
        .min(0)
        .optional(),

    /*
     * Payment
     */

    codEnabled:
      z.boolean()
        .optional(),

    onlinePaymentEnabled:
      z.boolean()
        .optional(),

    /*
     * Notifications
     */

    lowStockNotifications:
      z.boolean()
        .optional(),

    newOrderNotifications:
      z.boolean()
        .optional(),
  });

export type UpdateSettingsInput =
  z.infer<
    typeof updateSettingsSchema
  >;