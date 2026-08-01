import jwt from "jsonwebtoken";
import env from "../config/env.js";

export interface TokenPayload {
  userId: string;
}

export const generateAccessToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    }
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    }
  );
};

export const verifyAccessToken = (
  token: string
): TokenPayload => {
  return jwt.verify(
    token,
    env.JWT_ACCESS_SECRET
  ) as TokenPayload;
};

export const verifyRefreshToken = (
  token: string
): TokenPayload => {
  return jwt.verify(
    token,
    env.JWT_REFRESH_SECRET
  ) as TokenPayload;
};