import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import ApiError from "../helpers/ApiError.js";
import { StatusCodes } from "../constants/http.js";

const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("❌ Error:", error);

  // ----------------------------------
  // Zod Validation Error
  // ----------------------------------

  if (error instanceof ZodError) {
    const errors = error.issues.map((issue) => ({
      field: issue.path.join(".") || "unknown",
      message: issue.message,
    }));

    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // ----------------------------------
  // Custom API Error
  // ----------------------------------

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors ?? [],
    });
  }

  // ----------------------------------
  // Unknown / Unexpected Error
  // ----------------------------------

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({
      success: false,
      message: "Internal server error",
      errors: [],
    });
};

export default errorHandler;