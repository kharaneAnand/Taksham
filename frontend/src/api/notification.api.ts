/*
 * ========================================
 * Notification API
 * ========================================
 */

const NOTIFICATION_API_URL =
  `${import.meta.env.VITE_UTILS_SERVICE_URL}/notifications`;

/*
 * ========================================
 * Types
 * ========================================
 */

export type NotificationType =
  | "order"
  | "stock"
  | "payment"
  | "user"
  | "system";

export interface NotificationMetadata {
  orderId?: string;
  productId?: string;
  userId?: string;

  [key: string]:
    | string
    | number
    | boolean
    | undefined;
}

export interface Notification {
  _id: string;

  recipientId?: string;

  recipientRole:
    | "admin"
    | "user";

  title: string;

  message: string;

  type: NotificationType;

  isRead: boolean;

  metadata?: NotificationMetadata;

  createdAt: string;

  updatedAt: string;
}

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
      `${NOTIFICATION_API_URL}${endpoint}`,
      {
        ...options,

        credentials:
          "include",

        headers: {
          "Content-Type":
            "application/json",

          Accept:
            "application/json",

          ...options.headers,
        },
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
    throw new Error(
      responseData?.message ||
        "Unable to complete notification request",
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
 * ADMIN NOTIFICATIONS
 * ========================================
 */

/*
 * Get All Admin Notifications
 */

export const getNotifications =
  async (): Promise<
    Notification[]
  > => {
    return request<
      Notification[]
    >("");
  };

/*
 * Get Admin Unread Count
 */

export const getUnreadNotificationCount =
  async (): Promise<number> => {
    const data =
      await request<{
        count: number;
      }>("/unread-count");

    return data.count;
  };

/*
 * Mark One Admin Notification As Read
 */

export const markNotificationAsRead =
  async (
    notificationId: string,
  ): Promise<Notification> => {
    return request<Notification>(
      `/${encodeURIComponent(
        notificationId,
      )}/read`,
      {
        method:
          "PATCH",
      },
    );
  };

/*
 * Mark All Admin Notifications As Read
 */

export const markAllNotificationsAsRead =
  async (): Promise<{
    success: boolean;
  }> => {
    return request<{
      success: boolean;
    }>("/read-all", {
      method:
        "PATCH",
    });
  };

/*
 * Delete One Admin Notification
 */

export const deleteNotification =
  async (
    notificationId: string,
  ): Promise<void> => {
    await request<null>(
      `/${encodeURIComponent(
        notificationId,
      )}`,
      {
        method:
          "DELETE",
      },
    );
  };

/*
 * Delete All Admin Notifications
 */

export const deleteAllNotifications =
  async (): Promise<{
    success: boolean;
  }> => {
    return request<{
      success: boolean;
    }>("", {
      method:
        "DELETE",
    });
  };

/*
 * ========================================
 * USER NOTIFICATIONS
 * ========================================
 */

/*
 * Get User Notifications
 */

export const getUserNotifications =
  async (
    userId: string,
  ): Promise<
    Notification[]
  > => {
    return request<
      Notification[]
    >(
      `/user/${encodeURIComponent(
        userId,
      )}`,
    );
  };

/*
 * Get User Unread Count
 */

export const getUserUnreadNotificationCount =
  async (
    userId: string,
  ): Promise<number> => {
    const data =
      await request<{
        count: number;
      }>(
        `/user/${encodeURIComponent(
          userId,
        )}/unread-count`,
      );

    return data.count;
  };

/*
 * Mark One User Notification As Read
 */

export const markUserNotificationAsRead =
  async (
    userId: string,
    notificationId: string,
  ): Promise<Notification> => {
    return request<Notification>(
      `/user/${encodeURIComponent(
        userId,
      )}/${encodeURIComponent(
        notificationId,
      )}/read`,
      {
        method:
          "PATCH",
      },
    );
  };

/*
 * Mark All User Notifications As Read
 */

export const markAllUserNotificationsAsRead =
  async (
    userId: string,
  ): Promise<{
    success: boolean;
  }> => {
    return request<{
      success: boolean;
    }>(
      `/user/${encodeURIComponent(
        userId,
      )}/read-all`,
      {
        method:
          "PATCH",
        },
    );
  };

/*
 * Delete One User Notification
 */

export const deleteUserNotification =
  async (
    userId: string,
    notificationId: string,
  ): Promise<void> => {
    await request<null>(
      `/user/${encodeURIComponent(
        userId,
      )}/${encodeURIComponent(
        notificationId,
      )}`,
      {
        method:
          "DELETE",
      },
    );
  };

/*
 * Delete All User Notifications
 */

export const deleteAllUserNotifications =
  async (
    userId: string,
  ): Promise<{
    success: boolean;
  }> => {
    return request<{
      success: boolean;
    }>(
      `/user/${encodeURIComponent(
        userId,
      )}`,
      {
        method:
          "DELETE",
      },
    );
  };