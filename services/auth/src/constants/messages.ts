export const AUTH_MESSAGES = {
  /*
   * ========================================
   * Authentication
   * ========================================
   */

  REGISTER_SUCCESS:
    "Your account has been created successfully. Please check your email to verify your account.",

  LOGIN_SUCCESS:
    "Login successful",

  LOGOUT_SUCCESS:
    "You have been logged out successfully",


  /*
   * ========================================
   * Email Verification
   * ========================================
   */

  EMAIL_EXISTS:
    "An account with this email already exists",

  EMAIL_VERIFIED:
    "Your email has been verified successfully. You can now log in.",

  EMAIL_ALREADY_VERIFIED:
    "Your email is already verified. You can log in.",

  VERIFICATION_EMAIL_SENT:
    "A verification email has been sent. Please check your inbox.",

  EMAIL_NOT_VERIFIED:
    "Please verify your email before logging in",

  ACCOUNT_NOT_VERIFIED:
    "Please verify your account first",


  /*
   * ========================================
   * User
   * ========================================
   */

  USER_NOT_FOUND:
    "We could not find an account with those details",

  USER_FETCHED:
    "User fetched successfully",

  PROFILE_UPDATED:
    "Profile updated successfully",


  /*
   * ========================================
   * Login / Password
   * ========================================
   */

  INVALID_CREDENTIALS:
    "The email or password you entered is incorrect",

  FORGOT_PASSWORD_EMAIL_SENT:
    "If an account exists with this email, a password reset link has been sent.",

  PASSWORD_RESET_SUCCESS:
    "Your password has been reset successfully. You can now log in.",

  PASSWORD_CHANGED:
    "Your password has been changed successfully",

  PASSWORD_MUST_BE_DIFFERENT:
    "Your new password must be different from your current password",


  /*
   * ========================================
   * Avatar
   * ========================================
   */

  IMAGE_REQUIRED:
    "Please select an image to upload.",

  AVATAR_UPDATED:
    "Profile picture updated successfully.",

  AVATAR_DELETED:
    "Profile picture removed successfully.",

  AVATAR_NOT_FOUND:
    "No profile picture was found.",


  /*
   * ========================================
   * Tokens
   * ========================================
   */

  TOKEN_EXPIRED:
    "This link has expired. Please request a new one.",

  INVALID_TOKEN:
    "This link is invalid or has expired. Please request a new one.",

  TOKEN_REFRESHED:
    "Session refreshed successfully",


  /*
   * ========================================
   * Authorization
   * ========================================
   */

  UNAUTHORIZED:
    "Please log in to continue",

  FORBIDDEN:
    "You do not have permission to perform this action",
};


export const VALIDATION_MESSAGES = {
  VALIDATION_FAILED:
    "Please check the information you entered.",
};


export const SERVER_MESSAGES = {
  INTERNAL_SERVER_ERROR:
    "Something went wrong on our side. Please try again later.",

  SOMETHING_WENT_WRONG:
    "Something went wrong. Please try again.",
};