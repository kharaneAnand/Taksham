import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import { StatusCodes } from "../constants/http.js";
import { errorResponse } from "../helpers/response.js";

const validate =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        errorResponse(
          res,
          StatusCodes.BAD_REQUEST,
          "Validation Failed",
          error.issues
        );

        return;
      }

      next(error);
    }
  };

export default validate;