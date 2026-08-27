import "dotenv/config";

const requiredEnvVariables = [
  "PORT",
  "MONGODB_URI",

  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",

  "CLIENT_URL",

  "CART_SERVICE_URL",
  "AUTH_SERVICE_URL",
  "PRODUCT_SERVICE_URL",
  "UTILS_SERVICE_URL",

  "EMAIL_USER",
  "EMAIL_PASSWORD",

  "INTERNAL_SERVICE_SECRET",

  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
] as const;

for (const key of requiredEnvVariables) {
  if (!process.env[key]) {
    throw new Error(
      `❌ Missing environment variable: ${key}`,
    );
  }
}

const env = {
  /*
   * ========================================
   * Application
   * ========================================
   */

  NODE_ENV:
    process.env.NODE_ENV ||
    "development",

  PORT:
    Number(process.env.PORT),

  CLIENT_URL:
    process.env.CLIENT_URL!,

  /*
   * ========================================
   * Database
   * ========================================
   */

  MONGO_URI:
    process.env.MONGODB_URI!,

  /*
   * ========================================
   * JWT
   * ========================================
   */

  JWT_ACCESS_SECRET:
    process.env.JWT_ACCESS_SECRET!,

  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET!,

  JWT_ACCESS_EXPIRES_IN:
    process.env.JWT_ACCESS_EXPIRES_IN ||
    "15m",

  JWT_REFRESH_EXPIRES_IN:
    process.env.JWT_REFRESH_EXPIRES_IN ||
    "7d",

  /*
   * ========================================
   * Microservices
   * ========================================
   */

  CART_SERVICE_URL:
    process.env.CART_SERVICE_URL!,

  AUTH_SERVICE_URL:
    process.env.AUTH_SERVICE_URL!,

  PRODUCT_SERVICE_URL:
    process.env.PRODUCT_SERVICE_URL!,

  UTILS_SERVICE_URL:
    process.env.UTILS_SERVICE_URL!,

  /*
   * ========================================
   * Email
   * ========================================
   */

  EMAIL_USER:
    process.env.EMAIL_USER!,

  EMAIL_PASSWORD:
    process.env.EMAIL_PASSWORD!,

  /*
   * ========================================
   * Internal Service Authentication
   * ========================================
   */

  INTERNAL_SERVICE_SECRET:
    process.env.INTERNAL_SERVICE_SECRET!,

  /*
   * ========================================
   * Razorpay
   * ========================================
   */

  RAZORPAY_KEY_ID:
    process.env.RAZORPAY_KEY_ID!,

  RAZORPAY_KEY_SECRET:
    process.env.RAZORPAY_KEY_SECRET!,
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