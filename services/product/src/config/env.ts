import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
  "PORT",
  "MONGODB_URI",
   "CLIENT_URL",
  "AUTH_SERVICE_URL",
  "INTERNAL_SERVICE_SECRET",
] as const;

for (const key of requiredEnvVariables) {
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

  AUTH_SERVICE_URL: string;

  INTERNAL_SERVICE_SECRET: string;
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

  AUTH_SERVICE_URL:
    process.env.AUTH_SERVICE_URL!,

  INTERNAL_SERVICE_SECRET:
    process.env.INTERNAL_SERVICE_SECRET!,
};

export default env;