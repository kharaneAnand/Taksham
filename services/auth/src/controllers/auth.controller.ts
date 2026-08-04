import { Request, Response } from "express";
import { AUTH_MESSAGES } from "../constants/messages.js";
import asyncHandler from "../helpers/asyncHandler.js";
import { successResponse } from "../helpers/response.js";
import { StatusCodes } from "../constants/http.js";
import ApiError from "../helpers/ApiError.js";
import { COOKIE_NAMES } from "../constants/cookies.js";
import authService from "../services/auth.service.js";
import {accessTokenCookieOptions,refreshTokenCookieOptions,} from "../utils/cookie.js";
import { ResendVerificationEmailInput, ForgotPasswordInput , ResetPasswordInput , ChangePasswordInput} from "../validators/auth.validator.js";


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

  me = asyncHandler(async (req: Request, res: Response) => {

    return successResponse(
      res,
      StatusCodes.OK,
      "User fetched successfully",
      req.user
    );
  }
);

admin = asyncHandler(async (req: Request, res: Response) => {

    return successResponse(
      res,
      StatusCodes.OK,
      "Welcome Admin"
    );

  }
);

verifyEmail = asyncHandler<{ token: string }>(
  async (req, res) => {

    await authService.verifyEmail(req.params.token);

    return successResponse(
      res,
      StatusCodes.OK,
      AUTH_MESSAGES.EMAIL_VERIFIED
    );

  }
);

resendVerificationEmail = asyncHandler<
  Record<string, string>,
  unknown,
  ResendVerificationEmailInput
>(
  async (req, res) => {

    await authService.resendVerificationEmail(
      req.body.email
    );

    return successResponse(
      res,
      StatusCodes.OK,
      AUTH_MESSAGES.VERIFICATION_EMAIL_SENT
    );
  }
);

forgotPassword = asyncHandler<
  Record<string, string>,
  unknown,
  ForgotPasswordInput
>(
  async (req, res) => {

    await authService.forgotPassword(
      req.body.email
    );

    return successResponse(
      res,
      StatusCodes.OK,
      AUTH_MESSAGES.FORGOT_PASSWORD_EMAIL_SENT
    );

  }
);

resetPassword = asyncHandler<
  { token: string },
  unknown,
  ResetPasswordInput
>(
  async (req, res) => {

    await authService.resetPassword(
      req.params.token,
      req.body.password
    );

    return successResponse(
      res,
      StatusCodes.OK,
      AUTH_MESSAGES.PASSWORD_RESET_SUCCESS
    );

  }
);


changePassword = asyncHandler<
  Record<string, string>,
  unknown,
  ChangePasswordInput
>(
  async (req, res) => {

    await authService.changePassword(
      req.user!.id,
      req.body.currentPassword,
      req.body.newPassword
    );

    return successResponse(
      res,
      StatusCodes.OK,
      AUTH_MESSAGES.PASSWORD_CHANGED
    );
  }
);


}

export default new AuthController();