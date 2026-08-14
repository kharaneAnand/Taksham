import type {
  NextFunction,
  Request,
  Response,
} from "express";

import type {
  ZodType,
} from "zod";

import ApiError from "../helpers/ApiError.js";

import { StatusCodes } from "../constants/http.js";

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
    const result = schema.safeParse(
      req[target],
    );

    if (!result.success) {
      const errors =
        result.error.issues.map(
          (issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          }),
        );

      next(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          "Validation failed",
          errors,
        ),
      );

      return;
    }

    /*
     * Zod's parsed result is the
     * validated/sanitized data.
     *
     * We don't overwrite req.query
     * because Express 5 exposes query
     * as a getter-only property.
     */

    if (target === "body") {
      req.body = result.data;
    }

    if (target === "params") {
      Object.assign(
        req.params,
        result.data,
      );
    }

    next();
  };
};

export default validate;