import "dotenv/config";

const env = {
  PORT:
    Number(process.env.PORT) || 5003,

  MONGODB_URI:
    process.env.MONGODB_URI || "",

  JWT_ACCESS_SECRET:
    process.env.JWT_ACCESS_SECRET || "",

  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || "",

  JWT_ACCESS_EXPIRES_IN:
    process.env.JWT_ACCESS_EXPIRES_IN ||
    "15m",

  JWT_REFRESH_EXPIRES_IN:
    process.env.JWT_REFRESH_EXPIRES_IN ||
    "7d",

  PRODUCT_SERVICE_URL:
    process.env.PRODUCT_SERVICE_URL ||
    "http://localhost:5002/api/v1/products",
};

if (!env.MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is not configured",
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

export default env;