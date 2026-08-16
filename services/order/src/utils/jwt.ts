import jwt from "jsonwebtoken";

import env from "../config/env.js";

export interface TokenPayload {
  userId: string;
}

/*
 * ----------------------------------------
 * JWT expiration types
 * ----------------------------------------
 *
 * jsonwebtoken's SignOptions expiresIn
 * accepts a number or a time string such
 * as "15m", "7d", "1h".
 *
 * Our env.ts guarantees these values
 * are always strings.
 */

type JwtExpiresIn = NonNullable<
  Parameters<typeof jwt.sign>[2] extends infer Options
    ? Options extends { expiresIn?: infer Value }
      ? Value
      : never
    : never
>;

/*
 * ----------------------------------------
 * Generate Access Token
 * ----------------------------------------
 */

export const generateAccessToken = (
  userId: string,
): string => {
  const expiresIn =
    env.JWT_ACCESS_EXPIRES_IN as JwtExpiresIn;

  return jwt.sign(
    { userId },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn,
    },
  );
};

/*
 * ----------------------------------------
 * Generate Refresh Token
 * ----------------------------------------
 */

export const generateRefreshToken = (
  userId: string,
): string => {
  const expiresIn =
    env.JWT_REFRESH_EXPIRES_IN as JwtExpiresIn;

  return jwt.sign(
    { userId },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn,
    },
  );
};

/*
 * ----------------------------------------
 * Verify Access Token
 * ----------------------------------------
 */

export const verifyAccessToken = (
  token: string,
): TokenPayload => {
  return jwt.verify(
    token,
    env.JWT_ACCESS_SECRET,
  ) as TokenPayload;
};

/*
 * ----------------------------------------
 * Verify Refresh Token
 * ----------------------------------------
 */

export const verifyRefreshToken = (
  token: string,
): TokenPayload => {
  return jwt.verify(
    token,
    env.JWT_REFRESH_SECRET,
  ) as TokenPayload;
};