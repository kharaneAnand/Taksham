import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import validate from "../middleware/validate.middleware.js";
import { registerSchema , loginSchema , resendVerificationEmailSchema , forgotPasswordSchema , resetPasswordSchema} from "../validators/auth.validator.js";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";

import { UserRole } from "../constants/role.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  AuthController.register
);

router.post(
  "/login",
  validate(loginSchema),
  AuthController.login
);

router.post(
  "/refresh-token",
  AuthController.refreshToken
);

router.post(
  "/logout",
  AuthController.logout
);

router.get(
  "/me",
  authenticate,
  AuthController.me
);

router.get(
    "/admin",
    authenticate,
    authorize(UserRole.ADMIN),
    AuthController.admin
);

router.post(
  "/verify-email/:token",
  AuthController.verifyEmail
);

router.post(
  "/resend-verification-email",
  validate(resendVerificationEmailSchema),
  AuthController.resendVerificationEmail
);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  AuthController.forgotPassword
);

router.post(
  "/reset-password/:token",
  validate(resetPasswordSchema),
  AuthController.resetPassword
);

export default router;