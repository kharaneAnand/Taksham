import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import validate from "../middleware/validate.middleware.js";
import { registerSchema , loginSchema , resendVerificationEmailSchema , forgotPasswordSchema , resetPasswordSchema , changePasswordSchema , updateProfileSchema , adminCustomerQuerySchema, customerIdParamSchema } from "../validators/auth.validator.js";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import upload from "../utils/multer.js";
import { UserRole } from "../constants/role.js";
import authenticateInternalService from "../middleware/internal-service.middleware.js";

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
  authenticate,
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

router.get(
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

router.patch(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  AuthController.changePassword
);

router.patch(
  "/profile",
  authenticate,
  validate(updateProfileSchema),
  AuthController.updateProfile
);

router.patch(
  "/profile/avatar",
  authenticate,
  upload.single("image"),
  AuthController.updateAvatar
);

router.delete(
  "/profile/avatar",
  authenticate,
  AuthController.deleteAvatar
);

/*
 * ========================================
 * ADMIN - Get All Customers
 *
 * GET /api/v1/auth/admin/customers
 * ========================================
 */

router.get(
  "/admin/customers",

  authenticate,

  authorize(
    UserRole.ADMIN,
  ),

  validate(
    adminCustomerQuerySchema,
    "query",
  ),

  AuthController.getAllCustomers,
);


/*
 * ========================================
 * ADMIN - Get Single Customer
 *
 * GET /api/v1/auth/admin/customers/:id
 * ========================================
 */

router.get(
  "/admin/customers/:id",

  authenticate,

  authorize(
    UserRole.ADMIN,
  ),

  validate(
    customerIdParamSchema,
    "params",
  ),

  AuthController.getCustomerById,
);

router.get(
  "/internal/users/:userId/email",
  authenticateInternalService,
  AuthController.getUserEmail,
);


export default router;