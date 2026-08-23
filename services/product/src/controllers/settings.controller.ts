import asyncHandler from "../helpers/asyncHandler.js";

import {
  successResponse,
} from "../helpers/response.js";

import settingsService from "../services/settings.service.js";

import type {
  UpdateSettingsInput,
} from "../validators/settings.validator.js";

/*
 * ========================================
 * Settings Controller
 * ========================================
 */

class SettingsController {
  /*
   * ----------------------------------------
   * Get Global Settings
   *
   * GET /api/v1/settings
   * ----------------------------------------
   */

  getSettings =
    asyncHandler(
      async (
        _req,
        res,
      ) => {
        const settings =
          await settingsService.getSettings();

        return successResponse(
          res,
          200,
          "Settings fetched successfully",
          settings,
        );
      },
    );

  /*
   * ----------------------------------------
   * Update Global Settings
   *
   * PATCH /api/v1/settings
   * ----------------------------------------
   *
   * Admin only.
   *
   * Validated settings can include:
   *
   * - Store information
   * - Currency settings
   * - Tax settings
   * - Shipping settings
   * - Delivery estimate
   * - Payment settings
   * - Notification settings
   * ----------------------------------------
   */

  updateSettings =
    asyncHandler<
      Record<string, string>,
      unknown,
      UpdateSettingsInput
    >(
      async (
        req,
        res,
      ) => {
        const settings =
          await settingsService.updateSettings(
            req.body,
          );

        return successResponse(
          res,
          200,
          "Settings updated successfully",
          settings,
        );
      },
    );
}

export default new SettingsController();