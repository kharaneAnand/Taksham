import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import { StatusCodes } from "../constants/http.js";
import { errorResponse } from "../helpers/response.js";
import { VALIDATION_MESSAGES } from "../constants/messages.js";

const validate =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
  if (error instanceof ZodError) {
    const formattedErrors: Record<string, string> = {};

    error.issues.forEach((issue) => {
      const field = issue.path.join(".");

      if (!formattedErrors[field]) {
        formattedErrors[field] = issue.message;
      }
    });

    errorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      VALIDATION_MESSAGES.VALIDATION_FAILED,
      formattedErrors
    );

    return;
  }

  next(error);
}
  };

export default validate;