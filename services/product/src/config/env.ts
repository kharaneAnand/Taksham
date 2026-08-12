import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
  "PORT",
  "MONGODB_URI",
  "AUTH_SERVICE_URL",
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

  AUTH_SERVICE_URL: string;
}

const env: Env = {
  NODE_ENV:
    process.env.NODE_ENV || "development",

  PORT: Number(process.env.PORT),

  MONGODB_URI:
    process.env.MONGODB_URI!,

  AUTH_SERVICE_URL:
    process.env.AUTH_SERVICE_URL!,
};

export default env;