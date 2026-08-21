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

export interface ICoupon extends Document {
  code: string;

  description?: string;

  discountType: CouponDiscountType;

  discountValue: number;

  /*
   * Minimum cart subtotal required
   * to apply this coupon.
   */
  minimumOrderAmount: number;

  /*
   * Maximum discount allowed.
   *
   * Useful for percentage coupons.
   * Example:
   * 20% OFF, maximum ₹2,000 discount.
   */
  maximumDiscountAmount?: number;

  startDate: Date;

  endDate: Date;

  /*
   * Total number of times this
   * coupon can be used.
   */
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
 * VALIDATION
 *
 * In newer Mongoose versions,
 * pre("validate") middleware can be
 * treated as a promise-based hook.
 *
 * So we do not use `next()`.
 * Throwing an Error is enough.
 * ========================================
 */

couponSchema.pre(
  "validate",
  function () {
    /*
     * Percentage discount cannot
     * be more than 100%.
     */
    if (
      this.discountType ===
        "percentage" &&
      this.discountValue > 100
    ) {
      throw new Error(
        "Percentage discount cannot exceed 100",
      );
    }

    /*
     * Discount value must be
     * greater than zero.
     */
    if (
      this.discountValue <= 0
    ) {
      throw new Error(
        "Discount value must be greater than 0",
      );
    }

    /*
     * End date must be after
     * the start date.
     */
    if (
      this.startDate &&
      this.endDate &&
      this.endDate <= this.startDate
    ) {
      throw new Error(
        "End date must be after start date",
      );
    }

    /*
     * A maximum discount only makes
     * sense for percentage coupons.
     */
    if (
      this.discountType ===
        "fixed" &&
      this.maximumDiscountAmount !==
        undefined
    ) {
      throw new Error(
        "Maximum discount amount is only valid for percentage coupons",
      );
    }

    /*
     * Used count cannot exceed
     * the usage limit.
     */
    if (
      this.usageLimit !== undefined &&
      this.usedCount >
        this.usageLimit
    ) {
      throw new Error(
        "Used count cannot exceed usage limit",
      );
    }
  },
);

/*
 * ========================================
 * MODEL
 *
 * Prevent model overwrite during
 * development / hot reload.
 * ========================================
 */

const Coupon =
  mongoose.models.Coupon ||
  mongoose.model<ICoupon>(
    "Coupon",
    couponSchema,
  );

export default Coupon;