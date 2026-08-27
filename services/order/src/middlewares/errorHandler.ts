import type {
  NextFunction,
  Request,
  Response,
} from "express";

import {
  MongoServerError,
} from "mongodb";

import mongoose from "mongoose";

import jwt from "jsonwebtoken";

import ApiError from "../helpers/ApiError.js";

import {
  errorResponse,
} from "../helpers/response.js";

import {
  StatusCodes,
} from "../constants/http.js";

import {
  AUTH_MESSAGES,
  SERVER_MESSAGES,
} from "../constants/messages.js";

import env from "../config/env.js";

const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  /*
   * ========================================
   * ApiError
   * ========================================
   */

  if (
    error instanceof ApiError
  ) {
    errorResponse(
      res,
      error.statusCode,
      error.message,
      error.errors,
    );

    return;
  }

  /*
   * ========================================
   * MongoDB Duplicate Key
   * ========================================
   */

  if (
    error instanceof MongoServerError &&
    error.code === 11000
  ) {
    errorResponse(
      res,
      StatusCodes.CONFLICT,
      "Duplicate value already exists",
    );

    return;
  }

  /*
   * ========================================
   * Mongoose Validation
   * ========================================
   */

  if (
    error instanceof
    mongoose.Error.ValidationError
  ) {
    errorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Invalid data provided",
    );

    return;
  }

  /*
   * ========================================
   * JWT Expired
   * ========================================
   */

  if (
    error instanceof
    jwt.TokenExpiredError
  ) {
    errorResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      AUTH_MESSAGES.TOKEN_EXPIRED,
    );

    return;
  }

  /*
   * ========================================
   * JWT Invalid
   * ========================================
   */

  if (
    error instanceof
    jwt.JsonWebTokenError
  ) {
    errorResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      AUTH_MESSAGES.INVALID_TOKEN,
    );

    return;
  }

  /*
   * ========================================
   * Unknown Error
   * ========================================
   */

  console.error(
    "ORDER SERVICE ERROR:",
    error,
  );

  /*
   * Never expose internal errors
   * in production.
   */

  errorResponse(
    res,
    StatusCodes.INTERNAL_SERVER_ERROR,
    SERVER_MESSAGES.INTERNAL_SERVER_ERROR,
    env.NODE_ENV !== "production"
      ? error.message
      : undefined,
  );
};

export default errorHandler;