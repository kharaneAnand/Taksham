import type {
  NextFunction,
  Request,
  Response,
} from "express";

import jwt from "jsonwebtoken";

import env from "../config/env.js";
import ApiError from "../helpers/ApiError.js";

import { StatusCodes } from "../constants/http.js";
import { AUTH_MESSAGES } from "../constants/messages.js";
import { COOKIE_NAMES } from "../constants/cookies.js";

interface TokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    console.log(
      "\n========== CART AUTH ==========",
    );

    const accessToken =
      req.cookies?.[
        COOKIE_NAMES.ACCESS_TOKEN
      ];

    console.log(
      "Cookie received:",
      Boolean(accessToken),
    );

    if (!accessToken) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        AUTH_MESSAGES.INVALID_TOKEN,
      );
    }

    const decoded =
      jwt.decode(accessToken) as
        | TokenPayload
        | null;

    console.log(
      "Token issued at:",
      decoded?.iat
        ? new Date(
            decoded.iat * 1000,
          ).toLocaleString()
        : "unknown",
    );

    console.log(
      "Token expires at:",
      decoded?.exp
        ? new Date(
            decoded.exp * 1000,
          ).toLocaleString()
        : "unknown",
    );

    console.log(
      "Current time:",
      new Date().toLocaleString(),
    );

    console.log(
      "User ID inside token:",
      decoded?.userId,
    );

    const payload =
      jwt.verify(
        accessToken,
        env.JWT_ACCESS_SECRET,
      ) as TokenPayload;

    console.log(
      "JWT verified successfully",
    );

    if (!payload.userId) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        AUTH_MESSAGES.INVALID_TOKEN,
      );
    }

    req.user = {
      id: payload.userId,
    };

    console.log(
      "✅ Cart authentication successful",
    );

    console.log(
      "================================\n",
    );

    next();
  } catch (error) {
    console.log(
      "❌ CART AUTH ERROR:",
    );

    if (error instanceof Error) {
      console.log(
        "Error name:",
        error.name,
      );

      console.log(
        "Error message:",
        error.message,
      );
    }

    console.log(
      "================================\n",
    );

    next(error);
  }
};

export default authenticate;