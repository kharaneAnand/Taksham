import {
  NextFunction,
  Request,
  Response,
} from "express";

import { ZodError } from "zod";

import ApiError from "../helpers/ApiError.js";

const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(error);

  // Zod validation error
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues,
    });
  }

  // Application error
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
    });
  }

  // Unknown error
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    errors: [],
  });
};

export default errorHandler;