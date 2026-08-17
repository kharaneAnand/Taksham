import type {
  NextFunction,
  Request,
  Response,
} from "express";

import ApiError from "../helpers/ApiError.js";

import type {
  AuthenticatedRequest,
} from "./auth.middleware.js";



const authorize =
  (...roles: string[]) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
   

    const request =
      req as AuthenticatedRequest;


    if (!request.user) {
      throw new ApiError(
        401,
        "Authentication required",
      );
    }

   
    if (
      !request.user.role ||
      !roles.includes(
        request.user.role,
      )
    ) {
      throw new ApiError(
        403,
        "You do not have permission to perform this action",
      );
    }

  
    next();
  };

export default authorize;