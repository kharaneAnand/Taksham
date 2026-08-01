import { Request, Response } from "express";
import { AUTH_MESSAGES } from "../constants/messages.js";
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
      AUTH_MESSAGES.REGISTER_SUCCESS,
      user
    );
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.login(req.body);
    return successResponse(
      res,
      StatusCodes.OK,
      AUTH_MESSAGES.LOGIN_SUCCESS,
      user
    );

  });

}

export default new AuthController();