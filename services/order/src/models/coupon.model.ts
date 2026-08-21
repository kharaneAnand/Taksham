import mongoose, {
  Document,
  Schema,
} from "mongoose";

/*
 * ========================================
 * TYPES
 * ========================================
 */

export type CouponDiscountType =
  | "percentage"
  | "fixed";

export interface ICoupon
  extends Document {
  code: string;

  description?: string;

  discountType: CouponDiscountType;

  discountValue: number;

  minimumOrderAmount: number;

  maximumDiscountAmount?: number;

  startDate: Date;

  endDate: Date;

  usageLimit?: number;

  usedCount: number;

  isActive: boolean;

  createdAt: Date;

  updatedAt: Date;
}

/*
 * ========================================
 * SCHEMA
 * ========================================
 */

const couponSchema =
  new Schema<ICoupon>(
    {
      code: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        unique: true,
      },

      description: {
        type: String,
        trim: true,
        default: "",
      },

      discountType: {
        type: String,
        enum: [
          "percentage",
          "fixed",
        ],
        required: true,
      },

      discountValue: {
        type: Number,
        required: true,
        min: 0,
      },

      minimumOrderAmount: {
        type: Number,
        default: 0,
        min: 0,
      },

      maximumDiscountAmount: {
        type: Number,
        min: 0,
      },

      startDate: {
        type: Date,
        required: true,
      },

      endDate: {
        type: Date,
        required: true,
      },

      usageLimit: {
        type: Number,
        min: 1,
      },

      usedCount: {
        type: Number,
        default: 0,
        min: 0,
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    },
  );

/*
 * ========================================
 * SCHEMA VALIDATION
 * ========================================
 */

couponSchema.path(
  "discountValue",
).validate(
  function (
    this: ICoupon,
    value: number,
  ) {
    if (
      this.discountType ===
        "percentage"
    ) {
      return value > 0 && value <= 100;
    }

    return value > 0;
  },
  "Percentage discount must be between 1 and 100",
);

couponSchema.path(
  "endDate",
).validate(
  function (
    this: ICoupon,
    value: Date,
  ) {
    if (!this.startDate) {
      return true;
    }

    return (
      value.getTime() >
      this.startDate.getTime()
    );
  },
  "End date must be after start date",
);

couponSchema.path(
  "maximumDiscountAmount",
).validate(
  function (
    this: ICoupon,
    value?: number,
  ) {
    if (
      value === undefined ||
      value === null
    ) {
      return true;
    }

    return (
      this.discountType ===
      "percentage"
    );
  },
  "Maximum discount amount is only valid for percentage coupons",
);





/*
 * ========================================
 * MODEL
 * ========================================
 */

const Coupon =
  mongoose.models.Coupon ||
  mongoose.model<ICoupon>(
    "Coupon",
    couponSchema,
  );

export default Coupon;