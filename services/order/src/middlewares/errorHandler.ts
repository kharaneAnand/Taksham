import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { MongoServerError } from "mongodb";

import mongoose from "mongoose";

import jwt from "jsonwebtoken";

import ApiError from "../helpers/ApiError.js";

import { errorResponse } from "../helpers/response.js";

import {
  StatusCodes,
} from "../constants/http.js";

import {
  AUTH_MESSAGES,
  SERVER_MESSAGES,
} from "../constants/messages.js";

const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  /*
   * ApiError
   */

  if (error instanceof ApiError) {
    errorResponse(
      res,
      error.statusCode,
      error.message,
      error.errors,
    );

    return;
  }

  /*
   * MongoDB duplicate key
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
   * Mongoose validation
   */

  if (
    error instanceof
    mongoose.Error.ValidationError
  ) {
    errorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      error.message,
    );

    return;
  }

  /*
   * JWT expired
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
   * JWT invalid
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
   * Unknown error
   */

  console.error(
    "ORDER SERVICE ERROR:",
    error,
  );

  errorResponse(
    res,
    StatusCodes.INTERNAL_SERVER_ERROR,
    SERVER_MESSAGES.INTERNAL_SERVER_ERROR,
  );
};

export default errorHandler;