import User from "../models/user.model.js";
import ApiError from "../helpers/ApiError.js";
import env from "../config/env.js";
import { AUTH_MESSAGES } from "../constants/messages.js";
import { StatusCodes } from "../constants/http.js";
import { hashPassword , comparePassword} from "../utils/bcrypt.js";
import { RegisterInput , LoginInput } from "../validators/auth.validator.js";
import {generateAccessToken,generateRefreshToken,verifyRefreshToken} from "../utils/jwt.js";
import VerificationToken from "../models/verification-token.model.js";
import { generateRandomToken } from "../utils/token.js";
import { sendEmail } from "../utils/email.js";
import { verifyEmailTemplate } from "../templates/index.js";
import { hashToken } from "../utils/hash.js";
import type { IUser } from "../types/user.types.js";
import crypto from "crypto";



class AuthService {

  private generateTokens(userId: string) {
    return {
      accessToken: generateAccessToken(userId),
      refreshToken: generateRefreshToken(userId),
    };
  }

  private async sendVerificationEmail(user: IUser) {
  // Generate verification token
  const verificationToken = generateRandomToken();

  // Hash verification token
  const hashedVerificationToken = hashToken(
    verificationToken
  );

  // Delete old verification token (if any)
  await VerificationToken.deleteMany({
    userId: user._id,
  });

  // Save new verification token
  await VerificationToken.create({
    userId: user._id,
    token: hashedVerificationToken,
    expiresAt: new Date(
      Date.now() + 15 * 60 * 1000
    ),
  });

  // Verification link
  const verificationLink =
    `${env.CLIENT_URL}/verify-email/${verificationToken}`;

  // Send email
  await sendEmail({
    to: user.email,
    subject: "Verify Your Email",
    html: verifyEmailTemplate({
      firstName: user.firstName,
      verificationLink,
    }),
  });
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

  await this.sendVerificationEmail(user);

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

  if (!user.isVerified) {
  throw new ApiError(
    StatusCodes.UNAUTHORIZED,
    AUTH_MESSAGES.EMAIL_NOT_VERIFIED
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

async verifyEmail(token: string) {

  const hashedToken = hashToken(token);

  const verificationToken =
    await VerificationToken.findOne({
      token: hashedToken,
    });

  if (!verificationToken) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      AUTH_MESSAGES.INVALID_TOKEN
    );
  }

  const user = await User.findById(
    verificationToken.userId
  );

  if (!user) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      AUTH_MESSAGES.USER_NOT_FOUND
    );
  }

  if (user.isVerified) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      AUTH_MESSAGES.EMAIL_ALREADY_VERIFIED
    );
  }

  user.isVerified = true;

  await user.save();

  await VerificationToken.deleteOne({
    _id: verificationToken._id,
  });
}


async resendVerificationEmail(email: string) {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      AUTH_MESSAGES.USER_NOT_FOUND
    );
  }

  if (user.isVerified) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      AUTH_MESSAGES.EMAIL_ALREADY_VERIFIED
    );
  }

  await this.sendVerificationEmail(user);
}

}

export default new AuthService();