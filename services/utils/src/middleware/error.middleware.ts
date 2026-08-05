import { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";

import ApiError from "../helpers/ApiError.js";
import { errorResponse } from "../helpers/response.js";
import { StatusCodes } from "../constants/http.js";

const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {

  console.error(error);

  // Custom API Error
  if (error instanceof ApiError) {
    errorResponse(
      res,
      error.statusCode,
      error.message,
      error.errors
    );
    return;
  }

  // Multer Error
  if (error instanceof MulterError) {
    errorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      error.message
    );
    return;
  }

  // Unknown Error
  errorResponse(
    res,
    StatusCodes.INTERNAL_SERVER_ERROR,
    "Internal Server Error"
  );
};

export default errorHandler;