import dotenv from "dotenv";

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: Number(process.env.PORT) || 5001,

  MONGODB_URI: process.env.MONGODB_URI || "",

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "",

  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",

  CLIENT_URL: process.env.CLIENT_URL || "",

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",

  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",

  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",

  EMAIL_USER: process.env.EMAIL_USER || "",

  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
};

export default env;