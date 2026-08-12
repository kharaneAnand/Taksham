import {
  NextFunction,
  Request,
  Response,
} from "express";

import ApiError from "../helpers/ApiError.js";

const authorize =
  (...roles: string[]) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    if (!req.user) {
      throw new ApiError(
        401,
        "Authentication required",
      );
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action",
      );
    }

    next();
  };

export default authorize;