import User from "../models/user.model.js";
import ApiError from "../helpers/ApiError.js";

import { AUTH_MESSAGES } from "../constants/messages.js";
import { StatusCodes } from "../constants/http.js";

import { hashPassword } from "../utils/bcrypt.js";
import { RegisterInput } from "../validators/auth.validator.js";
import { LoginInput } from "../validators/auth.validator.js";
import { comparePassword } from "../utils/bcrypt.js";


class AuthService {
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
    const userObject = user.toObject();
      const { password, refreshToken, ...userData } = userObject;
      return userData;
  }
}

export default new AuthService();