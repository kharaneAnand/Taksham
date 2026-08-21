import mongoose, {
  Schema,
  type Document,
  type Model,
} from "mongoose";

/*
 * ========================================
 * Order Item
 * ========================================
 */

export interface IOrderItem {
  productId: string;

  productName: string;

  productImage: string;

  variantId?: string;

  variant?: {
    color?: string;
    material?: string;
    image?: string;
  };

  quantity: number;

  /*
   * Original product/variant price
   * before applying an automatic offer.
   */
  originalPrice: number;

  /*
   * Discount received from the
   * automatic product offer.
   */
  offerDiscountAmount: number;

  /*
   * Final price after applying
   * the automatic offer.
   */
  price: number;

  /*
   * Final item price × quantity.
   */
  subtotal: number;
}

/*
 * ========================================
 * Shipping Address
 * ========================================
 */

export interface IShippingAddress {
  firstName: string;

  lastName: string;

  phone: string;

  address: string;

  city: string;

  state: string;

  pincode: string;

  landmark?: string;
}

/*
 * ========================================
 * Order Status
 * ========================================
 */

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

/*
 * ========================================
 * Payment Method
 * ========================================
 */

export type PaymentMethod =
  | "cod"
  | "online";

/*
 * ========================================
 * Payment Status
 * ========================================
 */

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

/*
 * ========================================
 * Shipping Method
 * ========================================
 */

export type ShippingMethod =
  | "standard"
  | "express";

/*
 * ========================================
 * Order Interface
 * ========================================
 */

export interface IOrder
  extends Document {
  userId: string;

  orderNumber: string;

  items: IOrderItem[];

  shippingAddress: IShippingAddress;

  shippingMethod: ShippingMethod;

  paymentMethod: PaymentMethod;

  paymentStatus: PaymentStatus;

  /*
   * ----------------------------------------
   * Razorpay Payment Details
   * ----------------------------------------
   */

  razorpayOrderId?: string;

  razorpayPaymentId?: string;

  razorpaySignature?: string;

  orderStatus: OrderStatus;

  /*
   * ----------------------------------------
   * Price Details
   * ----------------------------------------
   */

  /*
   * Sum of all item prices after
   * automatic product offers.
   */
  subtotal: number;

  shippingCost: number;

  /*
   * ----------------------------------------
   * Coupon Details
   * ----------------------------------------
   */

  couponCode?: string;

  /*
   * Discount received from coupon.
   */
  discountAmount: number;

  /*
   * Final amount payable.
   */
  total: number;

  createdAt: Date;

  updatedAt: Date;
}

/*
 * ========================================
 * Order Item Schema
 * ========================================
 */

const orderItemSchema =
  new Schema<IOrderItem>(
    {
      productId: {
        type: String,

        required: true,
      },

      productName: {
        type: String,

        required: true,

        trim: true,
      },

      productImage: {
        type: String,

        required: true,
      },

      variantId: {
        type: String,
      },

      variant: {
        color: {
          type: String,
        },

        material: {
          type: String,
        },

        image: {
          type: String,
        },
      },

      quantity: {
        type: Number,

        required: true,

        min: 1,
      },

      /*
       * Original product/variant price
       * before automatic offer.
       */

      originalPrice: {
        type: Number,

        required: true,

        min: 0,
      },

      /*
       * Automatic offer discount
       * per product item.
       */

      offerDiscountAmount: {
        type: Number,

        required: true,

        default: 0,

        min: 0,
      },

      /*
       * Final product/variant price
       * after automatic offer.
       */

      price: {
        type: Number,

        required: true,

        min: 0,
      },

      /*
       * Final price × quantity.
       */

      subtotal: {
        type: Number,

        required: true,

        min: 0,
      },
    },

    {
      _id: false,
    },
  );

/*
 * ========================================
 * Shipping Address Schema
 * ========================================
 */

const shippingAddressSchema =
  new Schema<IShippingAddress>(
    {
      firstName: {
        type: String,

        required: true,

        trim: true,
      },

      lastName: {
        type: String,

        required: true,

        trim: true,
      },

      phone: {
        type: String,

        required: true,

        trim: true,
      },

      address: {
        type: String,

        required: true,

        trim: true,
      },

      city: {
        type: String,

        required: true,

        trim: true,
      },

      state: {
        type: String,

        required: true,

        trim: true,
      },

      pincode: {
        type: String,

        required: true,

        trim: true,
      },

      landmark: {
        type: String,

        trim: true,
      },
    },

    {
      _id: false,
    },
  );

/*
 * ========================================
 * Order Schema
 * ========================================
 */

const orderSchema =
  new Schema<IOrder>(
    {
      userId: {
        type: String,

        required: true,

        index: true,
      },

      orderNumber: {
        type: String,

        required: true,

        unique: true,

        index: true,
      },

      items: {
        type: [orderItemSchema],

        required: true,

        validate: {
          validator: (
            items: IOrderItem[],
          ) =>
            items.length > 0,

          message:
            "Order must contain at least one item",
        },
      },

      shippingAddress: {
        type: shippingAddressSchema,

        required: true,
      },

      shippingMethod: {
        type: String,

        enum: [
          "standard",
          "express",
        ],

        required: true,
      },

      paymentMethod: {
        type: String,

        enum: [
          "cod",
          "online",
        ],

        required: true,
      },

      paymentStatus: {
        type: String,

        enum: [
          "pending",
          "paid",
          "failed",
          "refunded",
        ],

        default: "pending",
      },

      /*
       * ----------------------------------------
       * Razorpay Payment Details
       * ----------------------------------------
       */

      razorpayOrderId: {
        type: String,

        index: true,
      },

      razorpayPaymentId: {
        type: String,
      },

      razorpaySignature: {
        type: String,
      },

      /*
       * ----------------------------------------
       * Order Status
       * ----------------------------------------
       */

      orderStatus: {
        type: String,

        enum: [
          "pending",
          "confirmed",
          "processing",
          "shipped",
          "out_for_delivery",
          "delivered",
          "cancelled",
        ],

        default: "pending",
      },

      /*
       * ----------------------------------------
       * Price Details
       * ----------------------------------------
       */

      subtotal: {
        type: Number,

        required: true,

        min: 0,
      },

      shippingCost: {
        type: Number,

        required: true,

        min: 0,
      },

      /*
       * ----------------------------------------
       * Coupon Details
       * ----------------------------------------
       */

      couponCode: {
        type: String,

        trim: true,

        uppercase: true,
      },

      discountAmount: {
        type: Number,

        required: true,

        default: 0,

        min: 0,
      },

      /*
       * ----------------------------------------
       * Final Payable Amount
       * ----------------------------------------
       */

      total: {
        type: Number,

        required: true,

        min: 0,
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

orderSchema.index({
  userId: 1,

  createdAt: -1,
});

/*
 * ========================================
 * Order Model
 * ========================================
 */

const Order: Model<IOrder> =
  mongoose.models.Order ||
  mongoose.model<IOrder>(
    "Order",
    orderSchema,
  );

export default Order;