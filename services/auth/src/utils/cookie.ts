import type {
  CookieOptions,
} from "express";

import env from "../config/env.js";


const isProduction =
  env.NODE_ENV === "production";


const isCrossSite =
  env.COOKIE_SAME_SITE === "none";


const commonCookieOptions: CookieOptions = {
  httpOnly: true,

  secure:
    isProduction,

  sameSite:
    isCrossSite
      ? "none"
      : "strict",
};


export const accessTokenCookieOptions: CookieOptions = {
  ...commonCookieOptions,

  maxAge:
    15 * 60 * 1000,
};


export const refreshTokenCookieOptions: CookieOptions = {
  ...commonCookieOptions,

  maxAge:
    7 * 24 * 60 * 60 * 1000,
};