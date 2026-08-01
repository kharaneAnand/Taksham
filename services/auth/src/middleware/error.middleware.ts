import { NextFunction, Request, Response } from "express";
import ApiError from "../helpers/ApiError.js";
import { StatusCodes } from "../constants/http.js";
import { errorResponse } from "../helpers/response.js";

const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof ApiError) {
    errorResponse(
      res,
      error.statusCode,
      error.message,
      error.errors
    );

    return;
  }

  console.error(error);

  errorResponse(
    res,
    StatusCodes.INTERNAL_SERVER_ERROR,
    "Internal Server Error"
  );
};

export default errorHandler;