/*
 * ========================================
 * Settings API
 * ========================================
 */

const SETTINGS_API_URL =
  "http://localhost:5002/api/v1/settings";

/*
 * ========================================
 * Types
 * ========================================
 */

export interface Settings {
  _id: string;

  /*
   * ----------------------------------------
   * Store Information
   * ----------------------------------------
   */

  storeName: string;

  email: string;

  phone: string;

  address: string;

  /*
   * ----------------------------------------
   * Currency
   * ----------------------------------------
   */

  currency: string;

  currencySymbol: string;

  /*
   * ----------------------------------------
   * Tax
   * ----------------------------------------
   */

  taxRate: number;

  /*
   * ----------------------------------------
   * Standard Delivery
   * ----------------------------------------
   */

  standardDeliveryEnabled: boolean;

  standardDeliveryCharge: number;

  standardDeliveryMinDays: number;

  standardDeliveryMaxDays: number;

  /*
   * ----------------------------------------
   * Express Delivery
   * ----------------------------------------
   */

  expressDeliveryEnabled: boolean;

  expressDeliveryCharge: number;

  expressDeliveryMinDays: number;

  expressDeliveryMaxDays: number;

  /*
   * ----------------------------------------
   * Payment Methods
   * ----------------------------------------
   */

  codEnabled: boolean;

  onlinePaymentEnabled: boolean;

  /*
   * ----------------------------------------
   * Notifications
   * ----------------------------------------
   */

  lowStockNotifications: boolean;

  newOrderNotifications: boolean;

  /*
   * ----------------------------------------
   * Timestamps
   * ----------------------------------------
   */

  createdAt: string;

  updatedAt: string;
}

/*
 * ========================================
 * Update Settings Payload
 * ========================================
 */

export type UpdateSettingsPayload =
  Partial<
    Omit<
      Settings,
      | "_id"
      | "createdAt"
      | "updatedAt"
    >
  >;

/*
 * ========================================
 * API Response
 * ========================================
 */

interface ApiResponse<T> {
  success: boolean;

  message: string;

  data: T;
}

/*
 * ========================================
 * Request Helper
 * ========================================
 */

const request = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const response =
    await fetch(
      `${SETTINGS_API_URL}${endpoint}`,
      {
        credentials: "include",

        headers: {
          "Content-Type":
            "application/json",

          ...options.headers,
        },

        ...options,
      },
    );

  const contentType =
    response.headers.get(
      "content-type",
    );

  const responseData:
    | ApiResponse<T>
    | null =
    contentType?.includes(
      "application/json",
    )
      ? await response.json()
      : null;

  if (!response.ok) {
    console.error(
      "Settings API error:",
      responseData,
    );

    throw new Error(
      responseData?.message ||
        "Something went wrong",
    );
  }

  if (!responseData) {
    throw new Error(
      "Invalid server response",
    );
  }

  return responseData.data;
};

/*
 * ========================================
 * Get Settings
 * ========================================
 */

export const getSettings =
  async (): Promise<Settings> => {
    return request<Settings>(
      "",
    );
  };

/*
 * ========================================
 * Update Settings
 * ========================================
 */

export const updateSettings =
  async (
    data: UpdateSettingsPayload,
  ): Promise<Settings> => {
    return request<Settings>(
      "",
      {
        method: "PATCH",

        body:
          JSON.stringify(data),
      },
    );
  };