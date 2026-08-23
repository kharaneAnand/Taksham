import {
  Schema,
  model,
} from "mongoose";

const settingsSchema =
  new Schema(
    {
      storeName: {
        type: String,
        default: "Taksham",
      },

      email: {
        type: String,
        default:
          "support@taksham.com",
      },

      phone: {
        type: String,
        default: "",
      },

      address: {
        type: String,
        default: "",
      },

      currency: {
        type: String,
        default: "INR",
      },

      currencySymbol: {
        type: String,
        default: "₹",
      },

      taxRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },

      /*
       * Standard Delivery
       */

      standardDeliveryEnabled: {
        type: Boolean,
        default: true,
      },

      standardDeliveryCharge: {
        type: Number,
        default: 0,
        min: 0,
      },

      standardDeliveryMinDays: {
        type: Number,
        default: 4,
        min: 0,
      },

      standardDeliveryMaxDays: {
        type: Number,
        default: 7,
        min: 0,
      },

      /*
       * Express Delivery
       */

      expressDeliveryEnabled: {
        type: Boolean,
        default: true,
      },

      expressDeliveryCharge: {
        type: Number,
        default: 199,
        min: 0,
      },

      expressDeliveryMinDays: {
        type: Number,
        default: 1,
        min: 0,
      },

      expressDeliveryMaxDays: {
        type: Number,
        default: 3,
        min: 0,
      },

      /*
       * Payment
       */

      codEnabled: {
        type: Boolean,
        default: true,
      },

      onlinePaymentEnabled: {
        type: Boolean,
        default: true,
      },

      /*
       * Notifications
       */

      lowStockNotifications: {
        type: Boolean,
        default: true,
      },

      newOrderNotifications: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    },
  );

const Settings =
  model(
    "Settings",
    settingsSchema,
  );

export default Settings;