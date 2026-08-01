import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
  "PORT",
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "CLIENT_URL",
] as const;

for (const key of requiredEnvVariables) {
  if (!process.env[key]) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
}

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: Number(process.env.PORT),

  MONGODB_URI: process.env.MONGODB_URI!,

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,

  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,

  CLIENT_URL: process.env.CLIENT_URL!,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",

  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",

  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",

  EMAIL_USER: process.env.EMAIL_USER || "",

  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
};

export default env;