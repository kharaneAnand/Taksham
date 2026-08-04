import User from "../models/user.model.js";
import ApiError from "../helpers/ApiError.js";
import env from "../config/env.js";
import { AUTH_MESSAGES } from "../constants/messages.js";
import { StatusCodes } from "../constants/http.js";
import { hashPassword , comparePassword} from "../utils/bcrypt.js";
import { RegisterInput , LoginInput } from "../validators/auth.validator.js";
import {generateAccessToken,generateRefreshToken,verifyRefreshToken} from "../utils/jwt.js";
import UserToken, {TokenType,} from "../models/user-token.model.js";
import { generateRandomToken } from "../utils/token.js";
import { sendEmail } from "../utils/email.js";
import { verifyEmailTemplate , forgotPasswordTemplate } from "../templates/index.js";
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

  private async createUserToken(
  userId: string,
  type: TokenType
): Promise<string> {

  // Generate random token
  const plainToken = generateRandomToken();

  // Hash token
  const hashedToken = hashToken(plainToken);

  // Delete existing token of same type
  await UserToken.deleteOne({
    userId,
    type,
  });

  // Save new token
  await UserToken.create({
    userId,
    token: hashedToken,
    type,
    expiresAt: new Date(
      Date.now() + 15 * 60 * 1000
    ),
  });

  return plainToken;
}

  private async sendVerificationEmail(user: IUser) {
 
    const verificationToken =
    await this.createUserToken(
      user._id.toString(),
      TokenType.EMAIL_VERIFICATION
  );


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
  await UserToken.findOne({
    token: hashedToken,
    type: TokenType.EMAIL_VERIFICATION,
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

  await UserToken.deleteOne({
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


  async forgotPassword(email: string) {

  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      AUTH_MESSAGES.USER_NOT_FOUND
    );
  }

  const resetToken =
    await this.createUserToken(
      user._id.toString(),
      TokenType.PASSWORD_RESET
    );

  const resetLink =
    `${env.CLIENT_URL}/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset Your Password",
    html: forgotPasswordTemplate({
      firstName: user.firstName,
      resetLink,
    }),
  });
}

async resetPassword(token: string,password: string) {

  const hashedToken = hashToken(token);

  const resetToken =
    await UserToken.findOne({
      token: hashedToken,
      type: TokenType.PASSWORD_RESET,
    });

  if (!resetToken) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      AUTH_MESSAGES.INVALID_TOKEN
    );
  }

  const user = await User.findById(
    resetToken.userId
  ).select("+refreshToken");

  if (!user) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      AUTH_MESSAGES.USER_NOT_FOUND
    );
  }

  user.password = await hashPassword(
    password
  );

  // Invalidate every previous login
  user.refreshToken = await hashPassword(
    crypto.randomUUID()
  );

  await user.save();

  await UserToken.deleteOne({
    _id: resetToken._id,
  });

}

async changePassword( userId: string,currentPassword: string,newPassword: string) {

  const user = await User.findById(userId)
    .select("+password +refreshToken");

  if (!user) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      AUTH_MESSAGES.USER_NOT_FOUND
    );
  }

  const isPasswordValid =
    await comparePassword(
      currentPassword,
      user.password
    );

  if (!isPasswordValid) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      AUTH_MESSAGES.INVALID_CREDENTIALS
    );
  }

  // Optional but recommended
  if (currentPassword === newPassword) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "New password must be different from current password"
    );
  }

  user.password = await hashPassword(
    newPassword
  );

  // Logout from every device
  user.refreshToken = await hashPassword(
    crypto.randomUUID()
  );

  await user.save();
}

}

           

export default new AuthService();