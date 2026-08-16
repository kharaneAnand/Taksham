import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type {
  ZodType,
} from "zod";

import ApiError from "../helpers/ApiError.js";

import {
  StatusCodes,
} from "../constants/http.js";

type ValidationTarget =
  | "body"
  | "query"
  | "params";

const validate = (
  schema: ZodType,
  target: ValidationTarget = "body",
) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {
    const result =
      schema.safeParse(
        req[target],
      );

    if (!result.success) {
      next(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          "Validation failed",
          result.error.issues,
        ),
      );

      return;
    }

    if (target === "body") {
      req.body = result.data;
    }

    next();
  };
};

export default validate;