import { Request, Response } from "express";

import asyncHandler from "../helpers/asyncHandler.js";
import { successResponse } from "../helpers/response.js";
import { StatusCodes } from "../constants/http.js";

import authService from "../services/auth.service.js";

class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.register(req.body);

    return successResponse(
      res,
      StatusCodes.CREATED,
      "User registered successfully",
      user
    );
  });
}

export default new AuthController();