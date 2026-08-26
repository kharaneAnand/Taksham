import "dotenv/config";

const env = {
  PORT:
    Number(process.env.PORT) || 5004,

  /*
   * ========================================
   * Database
   * ========================================
   */

  MONGO_URI:
    process.env.MONGODB_URI || "",

  /*
   * ========================================
   * JWT
   * ========================================
   */

  JWT_ACCESS_SECRET:
    process.env.JWT_ACCESS_SECRET || "",

  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || "",

  JWT_ACCESS_EXPIRES_IN:
    (process.env.JWT_ACCESS_EXPIRES_IN ||
      "15m") as `${number}${"s" | "m" | "h" | "d" | "w" | "y"}`,

  JWT_REFRESH_EXPIRES_IN:
    (process.env.JWT_REFRESH_EXPIRES_IN ||
      "7d") as `${number}${"s" | "m" | "h" | "d" | "w" | "y"}`,

  /*
   * ========================================
   * Microservices
   * ========================================
   */

  CART_SERVICE_URL:
    process.env.CART_SERVICE_URL ||
    "http://localhost:5003/api/v1/cart",

  AUTH_SERVICE_URL:
  process.env.AUTH_SERVICE_URL ||
  "http://localhost:5001/api/v1",

  PRODUCT_SERVICE_URL:
    process.env.PRODUCT_SERVICE_URL ||
    "http://localhost:5002/api/v1/products",

  UTILS_SERVICE_URL:
    process.env.UTILS_SERVICE_URL ||
    "http://localhost:5005/api/v1",

  /*
   * ========================================
   * Email
   * ========================================
   */

  EMAIL_USER:
    process.env.EMAIL_USER || "",

  EMAIL_PASSWORD:
    process.env.EMAIL_PASSWORD || "",

  /*
   * ========================================
   * Internal Service Authentication
   * ========================================
   */

  INTERNAL_SERVICE_SECRET:
    process.env.INTERNAL_SERVICE_SECRET ||
    "",

  /*
   * ========================================
   * Razorpay
   * ========================================
   */

  RAZORPAY_KEY_ID:
    process.env.RAZORPAY_KEY_ID ||
    "",

  RAZORPAY_KEY_SECRET:
    process.env.RAZORPAY_KEY_SECRET ||
    "",
};

/*
 * ========================================
 * Required Environment Variables
 * ========================================
 */

if (!env.MONGO_URI) {
  throw new Error(
    "MONGO_URI is not configured",
  );
}

if (!env.JWT_ACCESS_SECRET) {
  throw new Error(
    "JWT_ACCESS_SECRET is not configured",
  );
}

if (!env.JWT_REFRESH_SECRET) {
  throw new Error(
    "JWT_REFRESH_SECRET is not configured",
  );
}

if (!env.EMAIL_USER) {
  throw new Error(
    "EMAIL_USER is not configured",
  );
}

if (!env.EMAIL_PASSWORD) {
  throw new Error(
    "EMAIL_PASSWORD is not configured",
  );
}

if (!env.INTERNAL_SERVICE_SECRET) {
  throw new Error(
    "INTERNAL_SERVICE_SECRET is not configured",
  );
}

if (!env.RAZORPAY_KEY_ID) {
  throw new Error(
    "RAZORPAY_KEY_ID is not configured",
  );
}

if (!env.RAZORPAY_KEY_SECRET) {
  throw new Error(
    "RAZORPAY_KEY_SECRET is not configured",
  );
}

export default env;