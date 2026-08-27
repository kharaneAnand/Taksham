import dotenv from "dotenv";

import type {
  SignOptions,
} from "jsonwebtoken";

dotenv.config();


/* =====================================================
   ENVIRONMENT
===================================================== */

const NODE_ENV =
  process.env.NODE_ENV ||
  "development";


const allowedNodeEnvironments = [
  "development",
  "production",
  "test",
] as const;


if (
  !allowedNodeEnvironments.includes(
    NODE_ENV as
      (typeof allowedNodeEnvironments)[number],
  )
) {
  throw new Error(
    `❌ Invalid NODE_ENV: ${NODE_ENV}`,
  );
}


/* =====================================================
   REQUIRED VARIABLES
===================================================== */

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
  "COOKIE_SAME_SITE",
] as const;


for (
  const key of requiredEnvVariables
) {
  const value =
    process.env[key];

  if (
    !value ||
    !value.trim()
  ) {
    throw new Error(
      `❌ Missing environment variable: ${key}`,
    );
  }
}


/* =====================================================
   PORT VALIDATION
===================================================== */

const PORT =
  Number(process.env.PORT);


if (
  !Number.isInteger(PORT) ||
  PORT <= 0 ||
  PORT > 65535
) {
  throw new Error(
    "❌ PORT must be a valid port number",
  );
}


/* =====================================================
   URL VALIDATION
===================================================== */

try {
  new URL(
    process.env.CLIENT_URL!,
  );
} catch {
  throw new Error(
    "❌ CLIENT_URL must be a valid URL",
  );
}


try {
  new URL(
    process.env.MEDIA_SERVICE_URL!,
  );
} catch {
  throw new Error(
    "❌ MEDIA_SERVICE_URL must be a valid URL",
  );
}


/* =====================================================
   ENV TYPE
===================================================== */

interface Env {
  NODE_ENV:
    | "development"
    | "production"
    | "test";

  PORT: number;

  MONGODB_URI: string;


  JWT_ACCESS_SECRET: string;

  JWT_REFRESH_SECRET: string;

  JWT_ACCESS_EXPIRES_IN:
    SignOptions["expiresIn"];

  JWT_REFRESH_EXPIRES_IN:
    SignOptions["expiresIn"];


  CLIENT_URL: string;


  MEDIA_SERVICE_URL: string;


  EMAIL_USER: string;

  EMAIL_PASSWORD: string;

  COOKIE_SAME_SITE: string;
  INTERNAL_SERVICE_SECRET: string;
}


/* =====================================================
   ENV OBJECT
===================================================== */

const env: Env = {
  NODE_ENV:
    NODE_ENV as Env["NODE_ENV"],


  PORT,


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


  MEDIA_SERVICE_URL:
    process.env.MEDIA_SERVICE_URL!,


  EMAIL_USER:
    process.env.EMAIL_USER!,

  EMAIL_PASSWORD:
    process.env.EMAIL_PASSWORD!,

  COOKIE_SAME_SITE:
  process.env.COOKIE_SAME_SITE ||
  "strict",

  INTERNAL_SERVICE_SECRET:
    process.env.INTERNAL_SERVICE_SECRET!,
};


export default env;