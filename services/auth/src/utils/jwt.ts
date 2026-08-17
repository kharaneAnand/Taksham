import jwt from "jsonwebtoken";

import env from "../config/env.js";

/*
 * ========================================
 * Access Token Payload
 * ========================================
 */

export interface TokenPayload {
  userId: string;

  role: string;
}

/*
 * ========================================
 * Refresh Token Payload
 * ========================================
 */

export interface RefreshTokenPayload {
  userId: string;
}

/*
 * ========================================
 * Generate Access Token
 * ========================================
 */

export const generateAccessToken = (
  userId: string,
  role: string,
): string => {
  return jwt.sign(
    {
      userId,

      role,
    },

    env.JWT_ACCESS_SECRET,

    {
      expiresIn:
        env.JWT_ACCESS_EXPIRES_IN,
    },
  );
};

/*
 * ========================================
 * Generate Refresh Token
 * ========================================
 */

export const generateRefreshToken = (
  userId: string,
): string => {
  return jwt.sign(
    {
      userId,
    },

    env.JWT_REFRESH_SECRET,

    {
      expiresIn:
        env.JWT_REFRESH_EXPIRES_IN,
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
 */

export const verifyRefreshToken = (
  token: string,
): RefreshTokenPayload => {
  return jwt.verify(
    token,

    env.JWT_REFRESH_SECRET,
  ) as RefreshTokenPayload;
};