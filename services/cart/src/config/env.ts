import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
  "PORT",
  "MONGODB_URI",

  "CLIENT_URL",

  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",

  "JWT_ACCESS_EXPIRES_IN",
  "JWT_REFRESH_EXPIRES_IN",

  "PRODUCT_SERVICE_URL",
] as const;

for (
  const key of requiredEnvVariables
) {
  if (!process.env[key]) {
    throw new Error(
      `❌ Missing environment variable: ${key}`,
    );
  }
}

interface Env {
  NODE_ENV: string;

  PORT: number;

  MONGODB_URI: string;

  CLIENT_URL: string;

  JWT_ACCESS_SECRET: string;

  JWT_REFRESH_SECRET: string;

  JWT_ACCESS_EXPIRES_IN: string;

  JWT_REFRESH_EXPIRES_IN: string;

  PRODUCT_SERVICE_URL: string;
}

const env: Env = {
  NODE_ENV:
    process.env.NODE_ENV ||
    "development",

  PORT:
    Number(process.env.PORT),

  MONGODB_URI:
    process.env.MONGODB_URI!,

  CLIENT_URL:
    process.env.CLIENT_URL!,

  JWT_ACCESS_SECRET:
    process.env.JWT_ACCESS_SECRET!,

  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET!,

  JWT_ACCESS_EXPIRES_IN:
    process.env.JWT_ACCESS_EXPIRES_IN!,

  JWT_REFRESH_EXPIRES_IN:
    process.env.JWT_REFRESH_EXPIRES_IN!,

  PRODUCT_SERVICE_URL:
    process.env.PRODUCT_SERVICE_URL!,
};

export default env;