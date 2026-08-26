import dotenv from "dotenv";

import type {
  Secret,
  SignOptions,
} from "jsonwebtoken";

dotenv.config();



const requiredEnvVariables = [
  "PORT",
  "MONGODB_URI",

  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",

  "JWT_ACCESS_EXPIRES_IN",
  "JWT_REFRESH_EXPIRES_IN",

  "CLIENT_URL",

  "MEDIA_SERVICE_URL",

  "EMAIL_USER",
  "EMAIL_PASSWORD",

  "INTERNAL_SERVICE_SECRET",
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


  JWT_ACCESS_SECRET: Secret;

  JWT_REFRESH_SECRET: Secret;

  JWT_ACCESS_EXPIRES_IN:
    SignOptions["expiresIn"];

  JWT_REFRESH_EXPIRES_IN:
    SignOptions["expiresIn"];



  CLIENT_URL: string;

 

  EMAIL_USER: string;

  EMAIL_PASSWORD: string;


  MEDIA_SERVICE_URL: string;



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



  JWT_ACCESS_SECRET:
    process.env.JWT_ACCESS_SECRET!,

  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET!,

  JWT_ACCESS_EXPIRES_IN:
    process.env.JWT_ACCESS_EXPIRES_IN as
      SignOptions["expiresIn"],

  JWT_REFRESH_EXPIRES_IN:
    process.env.JWT_REFRESH_EXPIRES_IN as
      SignOptions["expiresIn"],



  CLIENT_URL:
    process.env.CLIENT_URL!,



  EMAIL_USER:
    process.env.EMAIL_USER!,

  EMAIL_PASSWORD:
    process.env.EMAIL_PASSWORD!,



  MEDIA_SERVICE_URL:
    process.env.MEDIA_SERVICE_URL!,

 

  INTERNAL_SERVICE_SECRET:
    process.env.INTERNAL_SERVICE_SECRET!,
};

export default env;