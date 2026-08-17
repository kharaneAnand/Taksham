import jwt from "jsonwebtoken";

import env from "../config/env.js";

/*
 * ========================================
 * Token Payload
 * ========================================
 */

export interface TokenPayload {
  userId: string;

  role: string;
}

/*
 * ----------------------------------------
 * JWT expiration types
 * ----------------------------------------
 */

type JwtExpiresIn = NonNullable<
  Parameters<typeof jwt.sign>[2] extends infer Options
    ? Options extends {
        expiresIn?: infer Value;
      }
      ? Value
      : never
    : never
>;

/*
 * ========================================
 * Generate Access Token
 * ========================================
 */

export const generateAccessToken = (
  userId: string,
  role: string,
): string => {
  const expiresIn =
    env.JWT_ACCESS_EXPIRES_IN as JwtExpiresIn;

  return jwt.sign(
    {
      userId,

      role,
    },

    env.JWT_ACCESS_SECRET,

    {
      expiresIn,
    },
  );
};

/*
 * ========================================
 * Generate Refresh Token
 * ========================================
 *
 * Refresh token only needs the user ID.
 * Role is not required for refreshing.
 * ========================================
 */

export const generateRefreshToken = (
  userId: string,
): string => {
  const expiresIn =
    env.JWT_REFRESH_EXPIRES_IN as JwtExpiresIn;

  return jwt.sign(
    {
      userId,
    },

    env.JWT_REFRESH_SECRET,

    {
      expiresIn,
    },
  );
};

/*
 * ========================================
 * Verify Access Token
 * ========================================
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
 * ========================================
 * Verify Refresh Token
 * ========================================
 *
 * Refresh tokens contain only userId,
 * so their payload is handled separately.
 * ========================================
 */

export const verifyRefreshToken = (
  token: string,
): {
  userId: string;
} => {
  return jwt.verify(
    token,

    env.JWT_REFRESH_SECRET,
  ) as {
    userId: string;
  };
};