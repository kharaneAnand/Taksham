import { Request, Response } from "express";
import asyncHandler from "../helpers/asyncHandler.js";
import { successResponse } from "../helpers/response.js";
import { StatusCodes } from "../constants/http.js";

class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    return successResponse(
      res,
      StatusCodes.CREATED,
      "Register endpoint working"
    );
  });
}

export default new AuthController();