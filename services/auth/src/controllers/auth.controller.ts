import { Request, Response } from "express";
import { AUTH_MESSAGES } from "../constants/messages.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { successResponse } from "../helpers/response.js";
import { StatusCodes } from "../constants/http.js";
import ApiError from "../helpers/ApiError.js";
import { COOKIE_NAMES } from "../constants/cookies.js";
import authService from "../services/auth.service.js";
import {accessTokenCookieOptions,refreshTokenCookieOptions,} from "../utils/cookie.js";

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

  const {
    user,
    accessToken,
    refreshToken,
  } = await authService.login(req.body);

  res.cookie(
  COOKIE_NAMES.ACCESS_TOKEN,
  accessToken,
  accessTokenCookieOptions
);

res.cookie(
  COOKIE_NAMES.REFRESH_TOKEN,
  refreshToken,
  refreshTokenCookieOptions
);

  return successResponse(
    res,
    StatusCodes.OK,
    AUTH_MESSAGES.LOGIN_SUCCESS,
    user
  );

});

 refreshToken = asyncHandler(async (req: Request, res: Response) => {

    const refreshToken =
      req.cookies[COOKIE_NAMES.REFRESH_TOKEN];

    if (!refreshToken) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        AUTH_MESSAGES.INVALID_TOKEN
      );
    }

    const {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    } = await authService.refreshToken(refreshToken);

    res.cookie(
      COOKIE_NAMES.ACCESS_TOKEN,
      accessToken,
      accessTokenCookieOptions
    );

    res.cookie(
      COOKIE_NAMES.REFRESH_TOKEN,
      newRefreshToken,
      refreshTokenCookieOptions
    );

    return successResponse(
      res,
      StatusCodes.OK,
      AUTH_MESSAGES.TOKEN_REFRESHED,
      user
    );
  }
);

  logout = asyncHandler(async (req: Request, res: Response) => {

    const refreshToken =
      req.cookies[COOKIE_NAMES.REFRESH_TOKEN];

    if (!refreshToken) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        AUTH_MESSAGES.INVALID_TOKEN
      );
    }

    await authService.logout(refreshToken);

    res.clearCookie(
      COOKIE_NAMES.ACCESS_TOKEN,
      accessTokenCookieOptions
    );

    res.clearCookie(
      COOKIE_NAMES.REFRESH_TOKEN,
      refreshTokenCookieOptions
    );

    return successResponse(
      res,
      StatusCodes.OK,
      AUTH_MESSAGES.LOGOUT_SUCCESS
    );
  }
);

}

export default new AuthController();