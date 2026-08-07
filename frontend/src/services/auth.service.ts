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

import type { ApiResponse } from "../types/api";

class AuthService {

  async register(
    data: RegisterInput
  ): Promise<User> {

    const response =
      await api.post<ApiResponse<User>>(
        "/auth/register",
        data
      );

    return response.data.data;
  }

  async login(
    data: LoginInput
  ): Promise<User> {

    const response =
      await api.post<ApiResponse<User>>(
        "/auth/login",
        data
      );

    return response.data.data;
  }

  async me(): Promise<User> {

    const response =
      await api.get<ApiResponse<User>>(
        "/auth/me"
      );

    return response.data.data;
  }

  async logout(): Promise<void> {

    await api.post("/auth/logout");
  }

  async refreshToken(): Promise<User> {

    const response =
      await api.post<ApiResponse<User>>(
        "/auth/refresh-token"
      );

    return response.data.data;
  }

  async resendVerificationEmail(
    data: ResendVerificationEmailInput
  ): Promise<void> {

    await api.post(
      "/auth/resend-verification-email",
      data
    );
  }

  async forgotPassword(
    data: ForgotPasswordInput
  ): Promise<void> {

    await api.post(
      "/auth/forgot-password",
      data
    );
  }

  async resetPassword(
    token: string,
    data: ResetPasswordInput
  ): Promise<void> {

    await api.post(
      `/auth/reset-password/${token}`,
      data
    );
  }

  async changePassword(
    data: ChangePasswordInput
  ): Promise<void> {

    await api.patch(
      "/auth/change-password",
      data
    );
  }

  async updateProfile(
    data: UpdateProfileInput
  ): Promise<User> {

    const response =
      await api.patch<ApiResponse<User>>(
        "/auth/profile",
        data
      );

    return response.data.data;
  }

  async updateAvatar(
    file: File
  ): Promise<User> {

    const formData = new FormData();

    formData.append(
      "image",
      file
    );

    const response =
      await api.patch<ApiResponse<User>>(
        "/auth/profile/avatar",
        formData
      );

    return response.data.data;
  }

  async deleteAvatar(): Promise<User> {

    const response =
      await api.delete<ApiResponse<User>>(
        "/auth/profile/avatar"
      );

    return response.data.data;
  }

}

export default new AuthService();