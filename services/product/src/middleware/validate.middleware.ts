import {
  NextFunction,
  Request,
  Response,
} from "express";

import { z } from "zod";

const validate = (
  schema: z.ZodType,
) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction,
  ) => {
    const result = schema.safeParse(
      req.body,
    );

    if (!result.success) {
      return next(result.error);
    }

    req.body = result.data;

    next();
  };
};

export default validate;