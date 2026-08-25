import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import type {
  ApiError,
} from "../types/api";

/*
 * ========================================
 * API CONFIGURATION
 * ========================================
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },

  timeout: 10000,
});

/*
 * ========================================
 * USER-FRIENDLY ERROR MESSAGE
 * ========================================
 */

const getFriendlyErrorMessage = (
  error: AxiosError<ApiError>,
): string => {
  /*
   * ----------------------------------------
   * No response from server
   * ----------------------------------------
   */

  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      return "The request took too long. Please try again.";
    }

    return "Unable to connect to the server. Please check your internet connection and try again.";
  }

  const status =
    error.response.status;

  const message =
    error.response.data?.message;

  const normalizedMessage =
    message?.toLowerCase() || "";

  /*
   * ----------------------------------------
   * Authentication errors
   * ----------------------------------------
   */

  if (status === 401) {
    if (
      normalizedMessage.includes(
        "verify",
      )
    ) {
      return "Please verify your email before signing in.";
    }

    if (
      normalizedMessage.includes(
        "credential",
      ) ||
      normalizedMessage.includes(
        "incorrect email",
      ) ||
      normalizedMessage.includes(
        "incorrect password",
      )
    ) {
      return "Incorrect email or password.";
    }

    /*
     * Token errors from protected routes
     */

    if (
      normalizedMessage.includes(
        "invalid token",
      ) ||
      normalizedMessage.includes(
        "token expired",
      ) ||
      normalizedMessage.includes(
        "jwt",
      )
    ) {
      return "Your session has expired. Please sign in again.";
    }

    return (
      message ||
      "You need to sign in to continue."
    );
  }

  /*
   * ----------------------------------------
   * Invalid or expired verification /
   * password reset links
   * ----------------------------------------
   */

  if (
    status === 400 &&
    (
      normalizedMessage.includes(
        "token",
      ) ||
      normalizedMessage.includes(
        "link",
      )
    )
  ) {
    return "This link is invalid or has expired. Please request a new one.";
  }

  /*
   * ----------------------------------------
   * Validation errors
   * ----------------------------------------
   */

  if (status === 400) {
    return (
      message ||
      "Please check the information and try again."
    );
  }

  /*
   * ----------------------------------------
   * Conflict
   * ----------------------------------------
   */

  if (status === 409) {
    return (
      message ||
      "This information is already in use."
    );
  }

  /*
   * ----------------------------------------
   * Rate limit
   * ----------------------------------------
   */

  if (status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }

  /*
   * ----------------------------------------
   * Server errors
   * ----------------------------------------
   */

  if (status >= 500) {
    return "Something went wrong on our end. Please try again later.";
  }

  /*
   * ----------------------------------------
   * Default backend message
   * ----------------------------------------
   */

  return (
    message ||
    "Something went wrong. Please try again."
  );
};

/*
 * ========================================
 * RESPONSE INTERCEPTOR
 * ========================================
 */

api.interceptors.response.use(
  (response) => response,

  (
    error: AxiosError<ApiError>,
  ) => {
    const friendlyMessage =
      getFriendlyErrorMessage(
        error,
      );

    error.message =
      friendlyMessage;

    return Promise.reject(
      error,
    );
  },
);

/*
 * ========================================
 * REQUEST INTERCEPTOR
 * ========================================
 */

api.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig,
  ) => {
    return config;
  },

  (error) =>
    Promise.reject(error),
);

export default api;