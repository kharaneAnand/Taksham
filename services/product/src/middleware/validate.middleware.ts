import {
  NextFunction,
  Request,
  Response,
} from "express";

import { z } from "zod";

const validate =
  (
    schema: z.ZodType,
    source:
      | "body"
      | "query"
      | "params" = "body",
  ) =>
  (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const result = schema.safeParse(
      req[source],
    );

    if (!result.success) {
      return next(result.error);
    }

    // Store validated/transformed data here.
    // req.query is read-only in Express.
    res.locals.validated = result.data;

    // For body/params, keep the existing behavior.
    if (source !== "query") {
      (req as any)[source] = result.data;
    }

    next();
  };

export default validate;