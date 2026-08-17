import type {
  Request,
  Response,
  NextFunction,
} from "express";

import env from "../config/env.js";

const internalAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const providedSecret =
    req.headers[
      "x-internal-service-secret"
    ];

  /*
   * Express headers can technically
   * contain string | string[] | undefined.
   *
   * We only accept a single string.
   */

  if (
    typeof providedSecret !==
    "string"
  ) {
    return res.status(401).json({
      success: false,

      message:
        "Unauthorized internal service request",

      errors: null,
    });
  }

  /*
   * Compare the provided secret with
   * the secret configured on the
   * Product Service.
   */

  if (
    providedSecret !==
    env.INTERNAL_SERVICE_SECRET
  ) {
    return res.status(401).json({
      success: false,

      message:
        "Unauthorized internal service request",

      errors: null,
    });
  }

  /*
   * Secret is valid.
   */

  next();
};

export default internalAuth;