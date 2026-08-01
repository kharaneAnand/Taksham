import User from "../models/user.model.js";
import ApiError from "../helpers/ApiError.js";

import { AUTH_MESSAGES } from "../constants/messages.js";
import { StatusCodes } from "../constants/http.js";

import { hashPassword } from "../utils/bcrypt.js";
import { RegisterInput } from "../validators/auth.validator.js";
import { LoginInput } from "../validators/auth.validator.js";
import { comparePassword } from "../utils/bcrypt.js";
import {generateAccessToken,generateRefreshToken,} from "../utils/jwt.js";
import { verifyRefreshToken } from "../utils/jwt.js";
import crypto from "crypto";



class AuthService {

  private generateTokens(userId: string) {
    return {
      accessToken: generateAccessToken(userId),
      refreshToken: generateRefreshToken(userId),
    };
  }

  async register(data: RegisterInput) {
    const existingUser = await User.findOne({
      email: data.email,
    });

    if (existingUser) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        AUTH_MESSAGES.EMAIL_EXISTS
      );
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await User.create({
      ...data,
      password: hashedPassword,
    });

    const userObject = user.toObject();
    const { password, refreshToken, ...userData } = userObject;
    return userData;
  }

  async login(data: LoginInput) {
  const user = await User.findOne({
    email: data.email,
  }).select("+password +refreshToken");

  if (!user) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      AUTH_MESSAGES.INVALID_CREDENTIALS
    );
  }

  const isPasswordValid = await comparePassword(
    data.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      AUTH_MESSAGES.INVALID_CREDENTIALS
    );
  }

  const {accessToken,refreshToken,} = this.generateTokens(user._id.toString());

 user.refreshToken = await hashPassword(
    refreshToken
  );

  await user.save();

  const userObject = user.toObject();

  const { password, refreshToken: _, ...userData } = userObject;

  return {
    user: userData,
    accessToken,
    refreshToken,
  };
}

  async refreshToken(refreshToken: string) {

  const payload = verifyRefreshToken(refreshToken);

  const user = await User.findById(payload.userId)
    .select("+refreshToken");

  if (!user) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      AUTH_MESSAGES.INVALID_TOKEN
    );
  }

  const isRefreshTokenValid = await comparePassword(
    refreshToken,
    user.refreshToken
  );

  if (!isRefreshTokenValid) {
    throw new ApiError(
      StatusCodes.UNAUTHORIZED,
      AUTH_MESSAGES.INVALID_TOKEN
    );
  }

  const {
    accessToken,
    refreshToken: newRefreshToken,
  } = this.generateTokens(user._id.toString());

  user.refreshToken = await hashPassword(
    newRefreshToken
  );

  await user.save();

  const userObject = user.toObject();

  const { password, refreshToken: _, ...userData } = userObject;

  return {
    user: userData,
    accessToken,
    refreshToken: newRefreshToken,
  };
}

  async logout(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    const user = await User.findById(payload.userId)
      .select("+refreshToken");

    if (!user) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        AUTH_MESSAGES.INVALID_TOKEN
      );
    }

    const isRefreshTokenValid = await comparePassword(
      refreshToken,
      user.refreshToken
    );

    if (!isRefreshTokenValid) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,
        AUTH_MESSAGES.INVALID_TOKEN
      );
    }

    user.refreshToken = await hashPassword(
      crypto.randomUUID()
    );

    await user.save();
  }
}

export default new AuthService();