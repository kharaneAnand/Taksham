import { Request, Response, NextFunction } from "express";
import { ZodTypeAny, ZodError } from "zod";

const validate =
  (schema: ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation Failed",
          errors: error.issues,
        });

        return;
      }

      next(error);
    }
  };

export default validate;