import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import validate from "../middleware/validate.middleware.js";
import { registerSchema } from "../validators/auth.validator.js";
import { loginSchema } from "../validators/auth.validator.js";

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

export default router;