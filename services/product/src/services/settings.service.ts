import Settings from "../models/settings.model.js";

import type {
  UpdateSettingsInput,
} from "../validators/settings.validator.js";

/*
 * ========================================
 * Settings Service
 * ========================================
 */

class SettingsService {
  /*
   * ========================================
   * Get Global Settings
   * ========================================
   */

  async getSettings() {
    let settings =
      await Settings.findOne();

    /*
     * ========================================
     * Create Default Settings
     * ========================================
     */

    if (!settings) {
      settings =
        await Settings.create({
          /*
           * Store Information
           */

          storeName: "Taksham",

          email:
            "support@taksham.com",

          phone: "",

          address: "",

          /*
           * Currency
           */

          currency: "INR",

          currencySymbol: "₹",

          /*
           * Tax
           */

          taxRate: 0,

          /*
           * Standard Delivery
           */

          standardDeliveryEnabled: true,

          standardDeliveryCharge: 0,

          standardDeliveryMinDays: 4,

          standardDeliveryMaxDays: 7,

          /*
           * Express Delivery
           */

          expressDeliveryEnabled: true,

          expressDeliveryCharge: 199,

          expressDeliveryMinDays: 1,

          expressDeliveryMaxDays: 3,

          /*
           * Payment Methods
           */

          codEnabled: true,

          onlinePaymentEnabled: true,

          /*
           * Notifications
           */

          lowStockNotifications: true,

          newOrderNotifications: true,
        });
    }

    return settings;
  }

  /*
   * ========================================
   * Update Global Settings
   * ========================================
   */

  async updateSettings(
    data: UpdateSettingsInput,
  ) {
    const settings =
      await this.getSettings();

    Object.assign(
      settings,
      data,
    );

    await settings.save();

    return settings;
  }
}

export default new SettingsService();