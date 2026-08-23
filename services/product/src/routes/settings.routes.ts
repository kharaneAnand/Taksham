import {
  Router,
} from "express";

import SettingsController from "../controllers/settings.controller.js";

import authenticate from "../middleware/auth.middleware.js";

import authorize from "../middleware/authorize.middleware.js";

import validate from "../middleware/validate.middleware.js";

import {
  updateSettingsSchema,
} from "../validators/settings.validator.js";

/*
 * ========================================
 * Settings Routes
 * ========================================
 */

const router =
  Router();

/*
 * ========================================
 * Get Settings
 *
 * GET /api/v1/settings
 *
 * Public
 *
 * Checkout needs access to delivery and
 * store settings, so customers must be
 * able to fetch these settings.
 * ========================================
 */

router.get(
  "/",
  SettingsController.getSettings,
);

/*
 * ========================================
 * Update Settings
 *
 * PATCH /api/v1/settings
 *
 * Admin Only
 * ========================================
 */

router.patch(
  "/",
  authenticate,
  authorize("admin"),
  validate(
    updateSettingsSchema,
  ),
  SettingsController.updateSettings,
);

export default router;