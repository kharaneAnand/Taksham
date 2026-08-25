import User from "../models/user.model.js";

import ApiError from "../helpers/ApiError.js";

import env from "../config/env.js";

import {
  AUTH_MESSAGES,
} from "../constants/messages.js";

import {
  StatusCodes,
} from "../constants/http.js";

import {
  hashPassword,
  comparePassword,
} from "../utils/bcrypt.js";

import {
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
} from "../validators/auth.validator.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

import UserToken, {
  TokenType,
} from "../models/user-token.model.js";

import {
  generateRandomToken,
} from "../utils/token.js";

import {
  sendEmail,
} from "../utils/email.js";

import {
  verifyEmailTemplate,
  forgotPasswordTemplate,
} from "../templates/index.js";

import {
  hashToken,
} from "../utils/hash.js";

import type {
  IUser,
} from "../types/user.types.js";

import crypto from "crypto";

import MediaService from "./media.service.js";

import type {
  AdminCustomerQueryInput,
} from "../validators/auth.validator.js";

import {
  UserRole,
} from "../constants/role.js";


class AuthService {

  /*
   * ========================================
   * Generate Authentication Tokens
   * ========================================
   */

  private generateTokens(
    userId: string,
    role: string,
  ) {
    return {
      accessToken:
        generateAccessToken(
          userId,
          role,
        ),

      refreshToken:
        generateRefreshToken(
          userId,
        ),
    };
  }


  /*
   * ========================================
   * Create User Token
   * ========================================
   *
   * Used for password reset tokens.
   */

  private async createUserToken(
    userId: string,
    type: TokenType,
  ): Promise<string> {

    const plainToken =
      generateRandomToken();

    const hashedToken =
      hashToken(
        plainToken,
      );

    await UserToken.deleteOne({
      userId,
      type,
    });

    await UserToken.create({
      userId,

      token:
        hashedToken,

      type,

      expiresAt:
        new Date(
          Date.now() +
            60 * 60 * 1000,
        ),
    });

    return plainToken;
  }


  /*
   * ========================================
   * Send Welcome Email
   * ========================================
   *
   * User is already verified when the account
   * is created.
   *
   * No verification token is required.
   */

  private async sendVerificationEmail(
    user: IUser,
  ) {

    await sendEmail({
      to: user.email,

      subject:
        "Welcome to Taksham",

      html:
        verifyEmailTemplate({
          firstName:
            user.firstName,

          clientUrl:
            env.CLIENT_URL,
        }),
    });
  }


  /*
   * ========================================
   * Register
   * ========================================
   */

  async register(
    data: RegisterInput,
  ) {

    const existingUser =
      await User.findOne({
        email: data.email,
      });

    if (existingUser) {
      throw new ApiError(
        StatusCodes.CONFLICT,

        AUTH_MESSAGES.EMAIL_EXISTS,
      );
    }

    const hashedPassword =
      await hashPassword(
        data.password,
      );

    const user =
      await User.create({
        ...data,

        password:
          hashedPassword,

        /*
         * User is automatically verified.
         *
         * No email verification is required
         * for login, checkout, or orders.
         */
        isVerified:
          true,
      });


    /*
     * Send welcome email after successful
     * account creation.
     *
     * This does NOT contain a verification
     * token or verification link.
     */
    await this.sendVerificationEmail(
      user,
    );


    const userObject =
      user.toObject();

    const {
      password,
      refreshToken,
      ...userData
    } = userObject;

    return userData;
  }


  /*
   * ========================================
   * Login
   * ========================================
   */

  async login(
    data: LoginInput,
  ) {

    const user =
      await User.findOne({
        email: data.email,
      }).select(
        "+password +refreshToken",
      );

    if (!user) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,

        AUTH_MESSAGES.INVALID_CREDENTIALS,
      );
    }

    const isPasswordValid =
      await comparePassword(
        data.password,

        user.password,
      );

    if (!isPasswordValid) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,

        AUTH_MESSAGES.INVALID_CREDENTIALS,
      );
    }


    /*
     * This check is kept for compatibility
     * with existing users.
     *
     * All newly registered users are created
     * with isVerified: true.
     */

    if (!user.isVerified) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,

        AUTH_MESSAGES.EMAIL_NOT_VERIFIED,
      );
    }


    /*
     * ------------------------------------
     * Include user role in access token
     * ------------------------------------
     */

    const {
      accessToken,
      refreshToken,
    } =
      this.generateTokens(
        user._id.toString(),

        user.role,
      );


    user.refreshToken =
      await hashPassword(
        refreshToken,
      );

    await user.save();


    const userObject =
      user.toObject();

    const {
      password,
      refreshToken: _,
      ...userData
    } = userObject;


    return {
      user:
        userData,

      accessToken,

      refreshToken,
    };
  }


  /*
   * ========================================
   * Refresh Token
   * ========================================
   */

  async refreshToken(
    refreshToken: string,
  ) {

    const payload =
      verifyRefreshToken(
        refreshToken,
      );

    const user =
      await User.findById(
        payload.userId,
      ).select(
        "+refreshToken",
      );

    if (!user) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,

        AUTH_MESSAGES.INVALID_TOKEN,
      );
    }

    const isRefreshTokenValid =
      await comparePassword(
        refreshToken,

        user.refreshToken,
      );

    if (!isRefreshTokenValid) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,

        AUTH_MESSAGES.INVALID_TOKEN,
      );
    }


    /*
     * ------------------------------------
     * Generate access token with role
     * ------------------------------------
     */

    const {
      accessToken,
      refreshToken:
        newRefreshToken,
    } =
      this.generateTokens(
        user._id.toString(),

        user.role,
      );


    user.refreshToken =
      await hashPassword(
        newRefreshToken,
      );

    await user.save();


    const userObject =
      user.toObject();

    const {
      password,
      refreshToken: _,
      ...userData
    } = userObject;


    return {
      user:
        userData,

      accessToken,

      refreshToken:
        newRefreshToken,
    };
  }


  /*
   * ========================================
   * Logout
   * ========================================
   */

  async logout(
    refreshToken: string,
  ) {

    const payload =
      verifyRefreshToken(
        refreshToken,
      );

    const user =
      await User.findById(
        payload.userId,
      ).select(
        "+refreshToken",
      );

    if (!user) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,

        AUTH_MESSAGES.INVALID_TOKEN,
      );
    }

    const isRefreshTokenValid =
      await comparePassword(
        refreshToken,

        user.refreshToken,
      );

    if (!isRefreshTokenValid) {
      throw new ApiError(
        StatusCodes.UNAUTHORIZED,

        AUTH_MESSAGES.INVALID_TOKEN,
      );
    }

    user.refreshToken =
      await hashPassword(
        crypto.randomUUID(),
      );

    await user.save();
  }


  /*
   * ========================================
   * Verify Email
   * ========================================
   *
   * Legacy endpoint.
   *
   * New users are automatically verified
   * during registration.
   */

  async verifyEmail(
    token: string,
  ) {

    const hashedToken =
      hashToken(token);

    const verificationToken =
      await UserToken.findOne({
        token:
          hashedToken,

        type:
          TokenType.EMAIL_VERIFICATION,
      });

    if (!verificationToken) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,

        AUTH_MESSAGES.INVALID_TOKEN,
      );
    }

    const user =
      await User.findById(
        verificationToken.userId,
      );

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,

        AUTH_MESSAGES.USER_NOT_FOUND,
      );
    }

    if (user.isVerified) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,

        AUTH_MESSAGES.EMAIL_ALREADY_VERIFIED,
      );
    }

    user.isVerified =
      true;

    await user.save();

    await UserToken.deleteOne({
      _id:
        verificationToken._id,
    });
  }


  /*
   * ========================================
   * Resend Verification Email
   * ========================================
   *
   * New users are automatically verified,
   * so this endpoint only applies to any
   * old unverified users.
   */

  async resendVerificationEmail(
    email: string,
  ) {

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,

        AUTH_MESSAGES.USER_NOT_FOUND,
      );
    }

    if (user.isVerified) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,

        AUTH_MESSAGES.EMAIL_ALREADY_VERIFIED,
      );
    }


    const verificationToken =
      await this.createUserToken(
        user._id.toString(),

        TokenType.EMAIL_VERIFICATION,
      );


    const verificationLink =
      `${env.CLIENT_URL}/verify-email/${verificationToken}`;


    await sendEmail({
      to: user.email,

      subject:
        "Verify Your Email",

      html:
        verifyEmailTemplate({
          firstName:
            user.firstName,

          clientUrl:
            verificationLink,
        }),
    });
  }


  /*
   * ========================================
   * Forgot Password
   * ========================================
   */

  async forgotPassword(
    email: string,
  ) {

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,

        AUTH_MESSAGES.USER_NOT_FOUND,
      );
    }

    const resetToken =
      await this.createUserToken(
        user._id.toString(),

        TokenType.PASSWORD_RESET,
      );

    const resetLink =
      `${env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,

      subject:
        "Reset Your Password",

      html:
        forgotPasswordTemplate({
          firstName:
            user.firstName,

          resetLink,
        }),
    });
  }


  /*
   * ========================================
   * Reset Password
   * ========================================
   */

  async resetPassword(
    token: string,
    password: string,
  ) {

    const hashedToken =
      hashToken(token);

    const resetToken =
      await UserToken.findOne({
        token:
          hashedToken,

        type:
          TokenType.PASSWORD_RESET,
      });

    if (!resetToken) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,

        AUTH_MESSAGES.INVALID_TOKEN,
      );
    }

    const user =
      await User.findById(
        resetToken.userId,
      ).select(
        "+refreshToken",
      );

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,

        AUTH_MESSAGES.USER_NOT_FOUND,
      );
    }

    user.password =
      await hashPassword(
        password,
      );

    user.refreshToken =
      await hashPassword(
        crypto.randomUUID(),
      );

    await user.save();

    await UserToken.deleteOne({
      _id:
        resetToken._id,
    });
  }


  /*
   * ========================================
   * Change Password
   * ========================================
   */

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {

    const user =
      await User.findById(
        userId,
      ).select(
        "+password +refreshToken",
      );

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,

        AUTH_MESSAGES.USER_NOT_FOUND,
      );
    }

    const isPasswordValid =
      await comparePassword(
        currentPassword,

        user.password,
      );

    if (!isPasswordValid) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,

        AUTH_MESSAGES.INVALID_CREDENTIALS,
      );
    }

    if (
      currentPassword ===
      newPassword
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,

        AUTH_MESSAGES.PASSWORD_MUST_BE_DIFFERENT,
      );
    }

    user.password =
      await hashPassword(
        newPassword,
      );

    user.refreshToken =
      await hashPassword(
        crypto.randomUUID(),
      );

    await user.save();
  }


  /*
   * ========================================
   * Update Profile
   * ========================================
   */

  async updateProfile(
    userId: string,
    data: UpdateProfileInput,
  ) {

    const user =
      await User.findById(
        userId,
      );

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,

        AUTH_MESSAGES.USER_NOT_FOUND,
      );
    }

    if (
      data.firstName !==
      undefined
    ) {
      user.firstName =
        data.firstName;
    }

    if (
      data.lastName !==
      undefined
    ) {
      user.lastName =
        data.lastName;
    }

    if (
      data.phone !==
      undefined
    ) {
      user.phone =
        data.phone;
    }

    await user.save();

    const userObject =
      user.toObject();

    const {
      password,
      refreshToken,
      ...userData
    } = userObject;

    return userData;
  }


  /*
   * ========================================
   * Update Avatar
   * ========================================
   */

  async updateAvatar(
    userId: string,
    file: Express.Multer.File,
  ) {

    const user =
      await User.findById(
        userId,
      );

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,

        AUTH_MESSAGES.USER_NOT_FOUND,
      );
    }

    if (
      user.avatar.publicId
    ) {
      await MediaService.deleteImage(
        user.avatar.publicId,
      );
    }

    const avatar =
      await MediaService.uploadAvatar(
        file,
      );

    user.avatar = {
      url:
        avatar.url,

      publicId:
        avatar.publicId,
    };

    await user.save();

    const userObject =
      user.toObject();

    const {
      password,
      refreshToken,
      ...userData
    } = userObject;

    return userData;
  }


  /*
   * ========================================
   * Delete Avatar
   * ========================================
   */

  async deleteAvatar(
    userId: string,
  ) {

    const user =
      await User.findById(
        userId,
      );

    if (!user) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,

        AUTH_MESSAGES.USER_NOT_FOUND,
      );
    }

    if (
      !user.avatar.publicId
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,

        AUTH_MESSAGES.AVATAR_NOT_FOUND,
      );
    }

    await MediaService.deleteImage(
      user.avatar.publicId,
    );

    user.avatar = {
      url: "",

      publicId: "",
    };

    await user.save();

    const userObject =
      user.toObject();

    const {
      password,
      refreshToken,
      ...userData
    } = userObject;

    return userData;
  }


  /*
   * ========================================
   * Get All Customers
   * Admin Only
   * ========================================
   *
   * Supports:
   *
   * - Pagination
   * - Search
   * - Verification filter
   * - Sorting
   */

  async getAllCustomers(
    query: AdminCustomerQueryInput,
  ) {

    const {
      page,
      limit,
      search,
      isVerified,
      sort,
    } = query;


    /*
     * ========================================
     * Pagination
     * ========================================
     */

    const skip =
      (page - 1) *
      limit;


    /*
     * ========================================
     * Base Filter
     * ========================================
     */

    const filter: Record<
      string,
      unknown
    > = {
      role:
        UserRole.CUSTOMER,
    };


    /*
     * ========================================
     * Search
     * ========================================
     */

    if (
      search &&
      search.trim()
    ) {

      const searchRegex =
        new RegExp(
          search.trim(),
          "i",
        );

      filter.$or = [
        {
          firstName:
            searchRegex,
        },
        {
          lastName:
            searchRegex,
        },
        {
          email:
            searchRegex,
        },
        {
          phone:
            searchRegex,
        },
      ];
    }


    /*
     * ========================================
     * Verification Filter
     * ========================================
     */

    if (
      isVerified !==
      undefined
    ) {
      filter.isVerified =
        isVerified === "true";
    }


    /*
     * ========================================
     * Sorting
     * ========================================
     */

    let sortOption:
      Record<
        string,
        1 | -1
      >;

    switch (sort) {

      case "oldest":

        sortOption = {
          createdAt: 1,
        };

        break;


      case "name_asc":

        sortOption = {
          firstName: 1,
          lastName: 1,
        };

        break;


      case "name_desc":

        sortOption = {
          firstName: -1,
          lastName: -1,
        };

        break;


      case "newest":
      default:

        sortOption = {
          createdAt: -1,
        };

        break;
    }


    /*
     * ========================================
     * Fetch Customers + Count
     * ========================================
     */

    const [
      customers,
      totalCustomers,
    ] =
      await Promise.all([
        User.find(
          filter,
        )
          .select(
            "-password -refreshToken",
          )
          .sort(
            sortOption,
          )
          .skip(
            skip,
          )
          .limit(
            limit,
          )
          .lean(),

        User.countDocuments(
          filter,
        ),
      ]);


    /*
     * ========================================
     * Pagination Data
     * ========================================
     */

    const totalPages =
      Math.ceil(
        totalCustomers /
          limit,
      );


    /*
     * ========================================
     * Response
     * ========================================
     */

    return {
      customers,

      pagination: {
        page,
        limit,

        totalCustomers,
        totalPages,

        hasNextPage:
          page < totalPages,

        hasPreviousPage:
          page > 1,
      },
    };
  }


  /*
   * ========================================
   * ADMIN - Get Single Customer
   * ========================================
   */

  async getCustomerById(
    customerId: string,
  ) {

    const customer =
      await User.findOne({
        _id:
          customerId,

        role:
          UserRole.CUSTOMER,
      })
        .select(
          "-password -refreshToken",
        )
        .lean();

    if (!customer) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Customer not found",
      );
    }

    return customer;
  }
}


export default new AuthService();