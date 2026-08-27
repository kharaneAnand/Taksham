import {
  rateLimit,
} from "express-rate-limit";




/*
 * ========================================
 * LOGIN LIMITER
 *
 * Protects against brute-force attempts.
 * ========================================
 */

export const loginRateLimiter = rateLimit({
  windowMs:
    15 * 60 * 1000,

  max: 10,

  standardHeaders:
    "draft-8",

  legacyHeaders:
    false,

  message: {
    success: false,
    message:
      "Too many login attempts. Please try again in 15 minutes.",
  },
});


/*
 * ========================================
 * REGISTRATION LIMITER
 *
 * Prevents automated account creation.
 * ========================================
 */

export const registerRateLimiter = rateLimit({
  windowMs:
    60 * 60 * 1000,

  max: 10,

  standardHeaders:
    "draft-8",

  legacyHeaders:
    false,

  message: {
    success: false,
    message:
      "Too many registration attempts. Please try again later.",
  },
});


/*
 * ========================================
 * SENSITIVE ACTION LIMITER
 *
 * Protects email/password-related endpoints.
 * ========================================
 */

export const sensitiveRateLimiter = rateLimit({
  windowMs:
    15 * 60 * 1000,

  max: 5,

  standardHeaders:
    "draft-8",

  legacyHeaders:
    false,

  message: {
    success: false,
    message:
      "Too many requests. Please try again later.",
  },
});