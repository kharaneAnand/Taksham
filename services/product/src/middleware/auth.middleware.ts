import {
  NextFunction,
  Request,
  Response,
} from "express";

import axios from "axios";

import ApiError from "../helpers/ApiError.js";
import { StatusCodes } from "../constants/http.js";
import env from "../config/env.js";

const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    // First try cookie
    let accessToken =
      req.cookies?.accessToken;

    // If no cookie, try Authorization header
    if (!accessToken) {
      const authorization =
        req.headers.authorization;

      if (
        authorization &&
        authorization.startsWith("Bearer ")
      ) {
        accessToken =
          authorization.substring(7);
      }
    }

    if (!accessToken) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Authentication required",
      );
    }

    const response =
      await axios.get(
        `${env.AUTH_SERVICE_URL}/api/v1/auth/me`,
        {
          headers: {
            Cookie: `accessToken=${accessToken}`,
          },
        },
      );

    const user = response.data.data;

    if (!user) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Invalid authentication",
      );
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      console.error(
        "Auth Service error:",
        error.response?.status,
        error.response?.data,
      );

      if (
        error.response?.status ===
        StatusCodes.UNAUTHORIZED
      ) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          "Authentication required",
        );
      }
    }

    next(error);
  }
};

export default authenticate;