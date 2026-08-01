import dotenv from "dotenv";
import type { Secret, SignOptions } from "jsonwebtoken";

dotenv.config();

const requiredEnvVariables = [
  "PORT",
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "JWT_ACCESS_EXPIRES_IN",
  "JWT_REFRESH_EXPIRES_IN",
  "CLIENT_URL",
] as const;

for (const key of requiredEnvVariables) {
  if (!process.env[key]) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
}

interface Env {
  NODE_ENV: string;

  PORT: number;

  MONGODB_URI: string;

  JWT_ACCESS_SECRET: Secret;
  JWT_REFRESH_SECRET: Secret;

  JWT_ACCESS_EXPIRES_IN: SignOptions["expiresIn"];
  JWT_REFRESH_EXPIRES_IN: SignOptions["expiresIn"];

  CLIENT_URL: string;

  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;

  EMAIL_USER: string;
  EMAIL_PASSWORD: string;
}

const env: Env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: Number(process.env.PORT),

  MONGODB_URI: process.env.MONGODB_URI!,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,

  JWT_ACCESS_EXPIRES_IN:
    process.env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],

  JWT_REFRESH_EXPIRES_IN:
    process.env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],

  CLIENT_URL: process.env.CLIENT_URL!,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",

  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",

  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",

  EMAIL_USER: process.env.EMAIL_USER || "",

  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
};

export default env;