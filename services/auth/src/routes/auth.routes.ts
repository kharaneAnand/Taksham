import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import validate from "../middleware/validate.middleware.js";
import { registerSchema } from "../validators/auth.validator.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  AuthController.register
);

export default router;