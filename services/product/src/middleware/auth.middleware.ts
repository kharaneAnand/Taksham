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
    const accessToken =
      req.cookies?.accessToken;

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

    req.user = user;

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401
    ) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        "Authentication required",
      );
    }

    next(error);
  }
};

export default authenticate;