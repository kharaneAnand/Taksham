import { Request, Response, NextFunction } from "express";
import ApiError from "../helpers/ApiError.js";

const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(
    new ApiError(
      404,
      `Route ${req.originalUrl} not found`
    )
  );
};

export default notFound;