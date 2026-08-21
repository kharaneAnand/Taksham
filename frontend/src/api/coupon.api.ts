import type {
  Coupon,
  CreateCouponPayload,
  UpdateCouponPayload,
} from "../types/coupon";

/* ========================================
 * API URL
 * ======================================== */

const UTILS_SERVICE_URL =
  import.meta.env.VITE_UTILS_SERVICE_URL ||
  "http://localhost:5005/api/v1";

const COUPON_API_URL =
  `${UTILS_SERVICE_URL}/coupons`;

/* ========================================
 * REQUEST HELPER
 * ======================================== */

const request = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const response = await fetch(
    url,
    {
      ...options,

      credentials: "include",

      headers: {
        Accept: "application/json",

        "Content-Type":
          "application/json",

        ...(options.headers || {}),
      },
    },
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message ||
        "Something went wrong",
    );
  }

  /*
   * Backend responses may use
   * different response structures.
   *
   * GET /coupons:
   * {
   *   success: true,
   *   coupons: [...]
   * }
   *
   * Other endpoints may use:
   * {
   *   success: true,
   *   data: {...}
   * }
   */
  return (
    result.data ??
    result.coupons ??
    result.coupon ??
    result
  ) as T;
};

/* ========================================
 * GET ALL COUPONS
 * ======================================== */

export const getAllCoupons =
  (): Promise<Coupon[]> => {
    return request<Coupon[]>(
      COUPON_API_URL,
      {
        method: "GET",
      },
    );
  };

/* ========================================
 * GET SINGLE COUPON
 * ======================================== */

export const getCouponById = (
  couponId: string,
): Promise<Coupon> => {
  return request<Coupon>(
    `${COUPON_API_URL}/${encodeURIComponent(
      couponId,
    )}`,
    {
      method: "GET",
    },
  );
};

/* ========================================
 * CREATE COUPON
 * ======================================== */

export const createCoupon = (
  data: CreateCouponPayload,
): Promise<Coupon> => {
  return request<Coupon>(
    COUPON_API_URL,
    {
      method: "POST",

      body: JSON.stringify(
        data,
      ),
    },
  );
};

/* ========================================
 * UPDATE COUPON
 * ======================================== */

export const updateCoupon = (
  couponId: string,
  data: UpdateCouponPayload,
): Promise<Coupon> => {
  return request<Coupon>(
    `${COUPON_API_URL}/${encodeURIComponent(
      couponId,
    )}`,
    {
      method: "PATCH",

      body: JSON.stringify(
        data,
      ),
    },
  );
};

/* ========================================
 * DELETE COUPON
 * ======================================== */

export const deleteCoupon = (
  couponId: string,
): Promise<void> => {
  return request<void>(
    `${COUPON_API_URL}/${encodeURIComponent(
      couponId,
    )}`,
    {
      method: "DELETE",
    },
  );
};