import {
  rateLimit,
} from "express-rate-limit";

/*
 * ========================================
 * ORDER CREATION LIMITER
 * ========================================
 *
 * Prevents excessive order creation.
 */

export const createOrderRateLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    max: 20,

    standardHeaders:
      "draft-8",

    legacyHeaders:
      false,

    message: {
      success: false,
      message:
        "Too many order requests. Please try again later.",
    },
  });

/*
 * ========================================
 * PAYMENT LIMITER
 * ========================================
 *
 * Protects payment creation and verification
 * endpoints from excessive requests.
 */

export const paymentRateLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    max: 20,

    standardHeaders:
      "draft-8",

    legacyHeaders:
      false,

    message: {
      success: false,
      message:
        "Too many payment requests. Please try again later.",
    },
  });