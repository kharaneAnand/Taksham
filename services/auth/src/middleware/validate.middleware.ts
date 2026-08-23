import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type {
  ZodType,
} from "zod";

import {
  ZodError,
} from "zod";

import {
  StatusCodes,
} from "../constants/http.js";

import {
  errorResponse,
} from "../helpers/response.js";

import {
  VALIDATION_MESSAGES,
} from "../constants/messages.js";

/*
 * ========================================
 * Validation Target
 * ========================================
 */

type ValidationTarget =
  | "body"
  | "query"
  | "params";

/*
 * ========================================
 * Validate Middleware
 * ========================================
 */

const validate = (
  schema: ZodType,
  target: ValidationTarget = "body",
) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      const parsedData =
        schema.parse(
          req[target],
        );

      /*
       * Body can be directly replaced.
       *
       * Query and params are stored inside
       * res.locals because Express typings
       * can cause assignment issues.
       */

      if (target === "body") {
        req.body =
          parsedData;
      } else {
        res.locals[
          target
        ] = parsedData;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors:
          Record<string, string> =
            {};

        error.issues.forEach(
          (issue) => {
            const field =
              issue.path.join(
                ".",
              );

            if (
              !formattedErrors[
                field
              ]
            ) {
              formattedErrors[
                field
              ] =
                issue.message;
            }
          },
        );

        errorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          VALIDATION_MESSAGES.VALIDATION_FAILED,
          formattedErrors,
        );

        return;
      }

      next(error);
    }
  };
};

export default validate;