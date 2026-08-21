import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
  "PORT",
  "MONGODB_URI",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
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

  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

const env: Env = {
  NODE_ENV:
    process.env.NODE_ENV ||
    "development",

  PORT: Number(
    process.env.PORT,
  ),

  MONGODB_URI:
    process.env.MONGODB_URI!,

  CLOUDINARY_CLOUD_NAME:
    process.env.CLOUDINARY_CLOUD_NAME!,

  CLOUDINARY_API_KEY:
    process.env.CLOUDINARY_API_KEY!,

  CLOUDINARY_API_SECRET:
    process.env.CLOUDINARY_API_SECRET!,
};

export default env;