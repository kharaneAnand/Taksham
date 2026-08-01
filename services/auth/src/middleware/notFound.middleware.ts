import { NextFunction, Request, Response } from "express";
import ApiError from "../helpers/ApiError.js";
import { StatusCodes } from "../constants/http.js";

const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next(
    new ApiError(
      StatusCodes.NOT_FOUND,
      `Route ${req.originalUrl} not found`
    )
  );
};

export default notFound;