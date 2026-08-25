import {
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

const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {

  /*
   * ========================================
   * Custom Application Errors
   * ========================================
   */

  if (error instanceof ApiError) {
    errorResponse(
      res,
      error.statusCode,
      error.message,
      error.errors
    );

    return;
  }


  /*
   * ========================================
   * MongoDB Duplicate Key Error
   * ========================================
   */

  if (
    error instanceof MongoServerError &&
    error.code === 11000
  ) {
    errorResponse(
      res,
      StatusCodes.CONFLICT,
      AUTH_MESSAGES.EMAIL_EXISTS
    );

    return;
  }


  /*
   * ========================================
   * Mongoose Validation Error
   * ========================================
   */

  if (
    error instanceof
    mongoose.Error.ValidationError
  ) {
    const errors = Object.values(
      error.errors
    ).map(
      (validationError) =>
        validationError.message
    );

    errorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Please check the information you entered.",
      errors
    );

    return;
  }


  /*
   * ========================================
   * JWT Token Expired
   * ========================================
   */

  if (
    error instanceof
    jwt.TokenExpiredError
  ) {
    errorResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      AUTH_MESSAGES.TOKEN_EXPIRED
    );

    return;
  }


  /*
   * ========================================
   * Invalid JWT Token
   * ========================================
   */

  if (
    error instanceof
    jwt.JsonWebTokenError
  ) {
    errorResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      AUTH_MESSAGES.INVALID_TOKEN
    );

    return;
  }


  /*
   * ========================================
   * Unexpected Server Error
   * ========================================
   */

  console.error(
    "Unexpected error:",
    error
  );

  errorResponse(
    res,
    StatusCodes.INTERNAL_SERVER_ERROR,
    SERVER_MESSAGES.INTERNAL_SERVER_ERROR
  );
};

export default errorHandler;