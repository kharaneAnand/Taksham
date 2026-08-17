import type {
  NextFunction,
  Request,
  Response,
} from "express";

import ApiError from "../helpers/ApiError.js";

import {
  verifyAccessToken,
} from "../utils/jwt.js";

import {
  AUTH_MESSAGES,
} from "../constants/messages.js";

import {
  StatusCodes,
} from "../constants/http.js";

import {
  COOKIE_NAMES,
} from "../constants/cookies.js";

/*
 * ========================================
 * Authenticated Request
 * ========================================
 */

export interface AuthenticatedRequest<
  P = Record<string, string>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = unknown,
> extends Request<
    P,
    ResBody,
    ReqBody,
    ReqQuery
  > {
  user: {
    id: string;

    role: string;
  };
}

/*
 * ========================================
 * Authenticate
 * ========================================
 */

const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    /*
     * ------------------------------------
     * Get Access Token
     * ------------------------------------
     */

    const accessToken =
      req.cookies?.[
        COOKIE_NAMES.ACCESS_TOKEN
      ];

    if (!accessToken) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        AUTH_MESSAGES.INVALID_TOKEN,
      );
    }

    /*
     * ------------------------------------
     * Verify Access Token
     * ------------------------------------
     */

    const payload =
      verifyAccessToken(
        accessToken,
      );

    /*
     * ------------------------------------
     * Validate Token Payload
     * ------------------------------------
     */

    if (
      !payload.userId ||
      !payload.role
    ) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        AUTH_MESSAGES.INVALID_TOKEN,
      );
    }

    /*
     * ------------------------------------
     * Attach User To Request
     * ------------------------------------
     */

    (
      req as AuthenticatedRequest
    ).user = {
      id:
        payload.userId,

      role:
        payload.role,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;