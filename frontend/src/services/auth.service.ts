import api from "./api";

import type {
  User,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ResendVerificationEmailInput,
} from "../types/auth";

import type {
  ApiResponse,
} from "../types/api";


class AuthService {

  /*
   * ========================================
   * REGISTER
   * ========================================
   */

  async register(
    data: RegisterInput,
  ): Promise<User> {
    const response =
      await api.post<ApiResponse<User>>(
        "/auth/register",
        data,
      );

    return response.data.data;
  }


  /*
   * ========================================
   * LOGIN
   * ========================================
   *
   * Backend stores accessToken and refreshToken
   * in HTTP-only cookies.
   *
   * Therefore the response data contains only
   * the logged-in user.
   */

  async login(
    data: LoginInput,
  ): Promise<User> {
    const response =
      await api.post<ApiResponse<User>>(
        "/auth/login",
        data,
      );

    const user =
      response.data.data;

    if (!user) {
      console.error(
        "Login response has no user data:",
        response.data,
      );

      throw new Error(
        "Login failed. User data was not returned.",
      );
    }

    return user;
  }


  /*
   * ========================================
   * GET CURRENT USER
   * ========================================
   */

  async me(): Promise<User> {
    const response =
      await api.get<ApiResponse<User>>(
        "/auth/me",
      );

    return response.data.data;
  }


  /*
   * ========================================
   * LOGOUT
   * ========================================
   */

  async logout(): Promise<void> {
    await api.post(
      "/auth/logout",
    );
  }


  /*
   * ========================================
   * REFRESH TOKEN
   * ========================================
   *
   * Backend refreshes the cookies and returns
   * the current user.
   */

  async refreshToken(): Promise<User> {
    const response =
      await api.post<ApiResponse<User>>(
        "/auth/refresh-token",
      );

    return response.data.data;
  }


  /*
   * ========================================
   * RESEND VERIFICATION EMAIL
   * ========================================
   */

  async resendVerificationEmail(
    data: ResendVerificationEmailInput,
  ): Promise<void> {
    await api.post(
      "/auth/resend-verification-email",
      data,
    );
  }


  /*
   * ========================================
   * FORGOT PASSWORD
   * ========================================
   */

  async forgotPassword(
    data: ForgotPasswordInput,
  ): Promise<void> {
    await api.post(
      "/auth/forgot-password",
      data,
    );
  }


  /*
   * ========================================
   * RESET PASSWORD
   * ========================================
   */

  async resetPassword(
    token: string,
    data: ResetPasswordInput,
  ): Promise<void> {
    await api.post(
      `/auth/reset-password/${encodeURIComponent(
        token,
      )}`,
      data,
    );
  }


  /*
   * ========================================
   * CHANGE PASSWORD
   * ========================================
   */

  async changePassword(
    data: ChangePasswordInput,
  ): Promise<void> {
    await api.patch(
      "/auth/change-password",
      data,
    );
  }


  /*
   * ========================================
   * UPDATE PROFILE
   * ========================================
   */

  async updateProfile(
    data: UpdateProfileInput,
  ): Promise<User> {
    const response =
      await api.patch<ApiResponse<User>>(
        "/auth/profile",
        data,
      );

    return response.data.data;
  }


  /*
   * ========================================
   * UPDATE AVATAR
   * ========================================
   */

  async updateAvatar(
    file: File,
  ): Promise<User> {
    const formData =
      new FormData();

    formData.append(
      "image",
      file,
    );

    const response =
      await api.patch<ApiResponse<User>>(
        "/auth/profile/avatar",
        formData,
      );

    return response.data.data;
  }


  /*
   * ========================================
   * DELETE AVATAR
   * ========================================
   */

  async deleteAvatar(): Promise<User> {
    const response =
      await api.delete<ApiResponse<User>>(
        "/auth/profile/avatar",
      );

    return response.data.data;
  }
}


export default new AuthService();