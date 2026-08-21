/* ========================================
 * COUPON DISCOUNT TYPE
 * ======================================== */

export type CouponDiscountType =
  | "percentage"
  | "fixed";

/* ========================================
 * COUPON
 * ======================================== */

export interface Coupon {
  _id: string;

  code: string;

  description?: string;

  discountType: CouponDiscountType;

  discountValue: number;

  minimumOrderAmount: number;

  maximumDiscountAmount?: number;

  startDate: string;

  endDate: string;

  usageLimit?: number;

  usedCount: number;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;
}

/* ========================================
 * CREATE COUPON PAYLOAD
 * ======================================== */

export interface CreateCouponPayload {
  code: string;

  description?: string;

  discountType: CouponDiscountType;

  discountValue: number;

  minimumOrderAmount?: number;

  maximumDiscountAmount?: number;

  startDate: string;

  endDate: string;

  usageLimit?: number;

  isActive?: boolean;
}

/* ========================================
 * UPDATE COUPON PAYLOAD
 * ======================================== */

export type UpdateCouponPayload =
  Partial<CreateCouponPayload>;