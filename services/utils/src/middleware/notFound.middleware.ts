import { Request, Response } from "express";
import { StatusCodes } from "../constants/http.js";
import { errorResponse } from "../helpers/response.js";

const notFound = (
  req: Request,
  res: Response
): void => {

  errorResponse(
    res,
    StatusCodes.NOT_FOUND,
    `Route ${req.originalUrl} not found`
  );

};

export default notFound;