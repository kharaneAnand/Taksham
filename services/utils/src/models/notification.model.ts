import mongoose, {
  Schema,
  type Document,
} from "mongoose";

/*
 * ========================================
 * Notification Types
 * ========================================
 */

export type NotificationType =
  | "order"
  | "stock"
  | "payment"
  | "user"
  | "system";

/*
 * ========================================
 * Notification Recipient Role
 * ========================================
 */

export type NotificationRecipientRole =
  | "admin"
  | "user";

/*
 * ========================================
 * Notification Metadata
 * ========================================
 */

export interface NotificationMetadata {
  orderId?: string;

  productId?: string;

  userId?: string;

  [key: string]:
    | string
    | number
    | boolean
    | undefined;
}

/*
 * ========================================
 * Notification Interface
 * ========================================
 */

export interface INotification
  extends Document {
  /*
   * ----------------------------------------
   * Recipient
   * ----------------------------------------
   */

  recipientId?: string;

  recipientRole:
    NotificationRecipientRole;

  /*
   * ----------------------------------------
   * Notification Content
   * ----------------------------------------
   */

  title: string;

  message: string;

  type: NotificationType;

  isRead: boolean;

  /*
   * ----------------------------------------
   * Additional Data
   * ----------------------------------------
   */

  metadata?: NotificationMetadata;

  /*
   * ----------------------------------------
   * Timestamps
   * ----------------------------------------
   */

  createdAt: Date;

  updatedAt: Date;
}

/*
 * ========================================
 * Notification Schema
 * ========================================
 */

const notificationSchema =
  new Schema<INotification>(
    {
      /*
       * --------------------------------------
       * Recipient ID
       * --------------------------------------
       *
       * Required for user notifications.
       *
       * Optional for admin notifications.
       */

      recipientId: {
        type: String,

        required: false,

        trim: true,
      },

      /*
       * --------------------------------------
       * Recipient Role
       * --------------------------------------
       */

      recipientRole: {
        type: String,

        enum: [
          "admin",
          "user",
        ],

        required: true,
      },

      /*
       * --------------------------------------
       * Title
       * --------------------------------------
       */

      title: {
        type: String,

        required: true,

        trim: true,

        maxlength: 150,
      },

      /*
       * --------------------------------------
       * Message
       * --------------------------------------
       */

      message: {
        type: String,

        required: true,

        trim: true,

        maxlength: 500,
      },

      /*
       * --------------------------------------
       * Notification Type
       * --------------------------------------
       */

      type: {
        type: String,

        enum: [
          "order",
          "stock",
          "payment",
          "user",
          "system",
        ],

        default:
          "system",
      },

      /*
       * --------------------------------------
       * Read Status
       * --------------------------------------
       */

      isRead: {
        type: Boolean,

        default: false,
      },

      /*
       * --------------------------------------
       * Metadata
       * --------------------------------------
       */

      metadata: {
        type:
          Schema.Types.Mixed,

        default: {},
      },
    },
    {
      timestamps: true,
    },
  );

/*
 * ========================================
 * Indexes
 * ========================================
 */

/*
 * Fetch notifications by recipient.
 */

notificationSchema.index({
  recipientId: 1,

  recipientRole: 1,

  createdAt: -1,
});

/*
 * Efficient unread queries.
 */

notificationSchema.index({
  recipientId: 1,

  recipientRole: 1,

  isRead: 1,

  createdAt: -1,
});

/*
 * Useful for admin notifications
 * filtered by type.
 */

notificationSchema.index({
  recipientRole: 1,

  type: 1,

  createdAt: -1,
});

/*
 * ========================================
 * Notification Model
 * ========================================
 */

const Notification =
  mongoose.model<INotification>(
    "Notification",

    notificationSchema,
  );

export default Notification;