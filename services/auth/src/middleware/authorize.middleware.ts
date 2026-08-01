import { NextFunction, Request, Response } from "express";
import ApiError from "../helpers/ApiError.js";
import { StatusCodes } from "../constants/http.js";
import { AUTH_MESSAGES } from "../constants/messages.js";
import { UserRole } from "../constants/role.js";

const authorize =
  (...roles: UserRole[]) =>
  (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    if (!req.user) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        AUTH_MESSAGES.UNAUTHORIZED
      );
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        StatusCodes.FORBIDDEN,
        AUTH_MESSAGES.FORBIDDEN
      );
    }

    next();
  };

export default authorize;