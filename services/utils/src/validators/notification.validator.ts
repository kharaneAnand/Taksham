import { z } from "zod";

/*
 * ========================================
 * Notification Types
 * ========================================
 */

const notificationTypes = [
  "order",
  "stock",
  "payment",
  "user",
  "system",
] as const;

/*
 * ========================================
 * Notification Recipient Roles
 * ========================================
 */

const notificationRecipientRoles = [
  "admin",
  "user",
] as const;

/*
 * ========================================
 * Notification Metadata Schema
 * ========================================
 */

const notificationMetadataSchema =
  z.record(
    z.string(),
    z.union([
      z.string(),
      z.number(),
      z.boolean(),
    ]),
  );

/*
 * ========================================
 * Create Notification Schema
 * ========================================
 */

export const createNotificationSchema =
  z
    .object({
      /*
       * ------------------------------------
       * Recipient
       * ------------------------------------
       */

      recipientId: z
        .string()
        .trim()
        .min(
          1,
          "Recipient ID cannot be empty",
        )
        .optional(),

      recipientRole: z.enum(
        notificationRecipientRoles,
        {
          message:
            "Recipient role must be either admin or user",
        },
      ),

      /*
       * ------------------------------------
       * Content
       * ------------------------------------
       */

      title: z
        .string()
        .trim()
        .min(
          1,
          "Notification title is required",
        )
        .max(
          150,
          "Notification title cannot exceed 150 characters",
        ),

      message: z
        .string()
        .trim()
        .min(
          1,
          "Notification message is required",
        )
        .max(
          500,
          "Notification message cannot exceed 500 characters",
        ),

      /*
       * ------------------------------------
       * Type
       * ------------------------------------
       */

      type: z
        .enum(notificationTypes)
        .optional(),

      /*
       * ------------------------------------
       * Metadata
       * ------------------------------------
       */

      metadata:
        notificationMetadataSchema.optional(),

      /*
       * ------------------------------------
       * Email
       * ------------------------------------
       *
       * Email is optional because
       * notifications can exist without
       * sending an email.
       */

      email: z
        .string()
        .trim()
        .email(
          "Enter a valid email address",
        )
        .optional(),

      /*
       * Controls whether an email should
       * be sent for this notification.
       */

      sendEmail: z
        .boolean()
        .optional()
        .default(false),
    })
    .superRefine(
      (data, context) => {
        /*
         * User notifications must
         * have a recipient ID.
         */

        if (
          data.recipientRole ===
            "user" &&
          !data.recipientId
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,

            path: [
              "recipientId",
            ],

            message:
              "Recipient ID is required for user notifications",
          });
        }

        /*
         * If email delivery is requested,
         * an email address is required.
         */

        if (
          data.sendEmail &&
          !data.email
        ) {
          context.addIssue({
            code:
              z.ZodIssueCode.custom,

            path: [
              "email",
            ],

            message:
              "Email is required when sendEmail is true",
          });
        }
      },
    );

/*
 * ========================================
 * Types
 * ========================================
 */

export type CreateNotificationInput =
  z.infer<
    typeof createNotificationSchema
  >;