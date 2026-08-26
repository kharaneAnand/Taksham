import { Request, Response, NextFunction } from "express";

import env from "../config/env.js";

import ApiError from "../helpers/ApiError.js";

import {
  StatusCodes,
} from "../constants/http.js";


const authenticateInternalService = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const serviceSecret =
    req.headers[
      "x-internal-service-secret"
    ];

  if (
    typeof serviceSecret !== "string" ||
    serviceSecret !==
      env.INTERNAL_SERVICE_SECRET
  ) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      "Unauthorized internal service request",
    );
  }

  next();
};


export default authenticateInternalService;