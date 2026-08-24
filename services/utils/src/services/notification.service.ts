import Notification, {
  type INotification,
} from "../models/notification.model.js";

import ApiError from "../helpers/ApiError.js";

import {
  StatusCodes,
} from "../constants/http.js";

import type {
  CreateNotificationInput,
} from "../validators/notification.validator.js";

/*
 * ========================================
 * Notification Service
 * ========================================
 */

class NotificationService {
  /*
   * ========================================
   * Create Notification
   * ========================================
   */

  async createNotification(
  data: CreateNotificationInput,
): Promise<INotification> {
  /*
   * User notifications must have
   * a recipient ID.
   */

  if (
    data.recipientRole === "user" &&
    !data.recipientId
  ) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "recipientId is required for user notifications",
    );
  }

  const notification =
    await Notification.create({
      ...(data.recipientId
        ? {
            recipientId:
              data.recipientId,
          }
        : {}),

      recipientRole:
        data.recipientRole,

      title:
        data.title,

      message:
        data.message,

      type:
        data.type ??
        "system",

      metadata:
        data.metadata ??
        {},

      isRead:
        false,
    });

  return notification;
}

  /*
   * ========================================
   * ADMIN NOTIFICATIONS
   * ========================================
   */

  /*
   * Get Admin Notifications
   */

  async getNotifications() {
    const notifications =
      await Notification.find({
        recipientRole:
          "admin",
      })
        .sort({
          createdAt: -1,
        })
        .limit(50)
        .lean();

    return notifications;
  }

  /*
   * Get Admin Unread Count
   */

  async getUnreadCount() {
    const count =
      await Notification.countDocuments({
        recipientRole:
          "admin",

        isRead:
          false,
      });

    return {
      count,
    };
  }

  /*
   * Mark One Admin Notification As Read
   */

  async markAsRead(
    notificationId: string,
  ) {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id:
            notificationId,

          recipientRole:
            "admin",
        },
        {
          $set: {
            isRead:
              true,
          },
        },
        {
          new: true,

          runValidators: true,
        },
      );

    if (!notification) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Notification not found",
      );
    }

    return notification;
  }

  /*
   * Mark All Admin Notifications As Read
   */

  async markAllAsRead() {
    await Notification.updateMany(
      {
        recipientRole:
          "admin",

        isRead:
          false,
      },
      {
        $set: {
          isRead:
            true,
        },
      },
    );

    return {
      success:
        true,
    };
  }

  /*
   * Delete One Admin Notification
   */

  async deleteNotification(
    notificationId: string,
  ) {
    const notification =
      await Notification.findOneAndDelete({
        _id:
          notificationId,

        recipientRole:
          "admin",
      });

    if (!notification) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Notification not found",
      );
    }

    return notification;
  }

  /*
   * Delete All Admin Notifications
   */

  async deleteAllNotifications() {
    await Notification.deleteMany({
      recipientRole:
        "admin",
    });

    return {
      success:
        true,
    };
  }

  /*
   * ========================================
   * USER NOTIFICATIONS
   * ========================================
   */

  /*
   * Get User Notifications
   */

  async getUserNotifications(
    userId: string,
  ) {
    const notifications =
      await Notification.find({
        recipientId:
          userId,

        recipientRole:
          "user",
      })
        .sort({
          createdAt: -1,
        })
        .limit(50)
        .lean();

    return notifications;
  }

  /*
   * Get User Unread Count
   */

  async getUserUnreadCount(
    userId: string,
  ) {
    const count =
      await Notification.countDocuments({
        recipientId:
          userId,

        recipientRole:
          "user",

        isRead:
          false,
      });

    return {
      count,
    };
  }

  /*
   * Mark One User Notification As Read
   *
   * IMPORTANT:
   * Notification must belong
   * to the current user.
   */

  async markUserNotificationAsRead(
    userId: string,
    notificationId: string,
  ) {
    const notification =
      await Notification.findOneAndUpdate(
        {
          _id:
            notificationId,

          recipientId:
            userId,

          recipientRole:
            "user",
        },
        {
          $set: {
            isRead:
              true,
          },
        },
        {
          new: true,

          runValidators: true,
        },
      );

    if (!notification) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Notification not found",
      );
    }

    return notification;
  }

  /*
   * Mark All User Notifications As Read
   */

  async markAllUserNotificationsAsRead(
    userId: string,
  ) {
    await Notification.updateMany(
      {
        recipientId:
          userId,

        recipientRole:
          "user",

        isRead:
          false,
      },
      {
        $set: {
          isRead:
            true,
        },
      },
    );

    return {
      success:
        true,
    };
  }

  /*
   * Delete One User Notification
   *
   * IMPORTANT:
   * Only delete if it belongs
   * to the current user.
   */

  async deleteUserNotification(
    userId: string,
    notificationId: string,
  ) {
    const notification =
      await Notification.findOneAndDelete({
        _id:
          notificationId,

        recipientId:
          userId,

        recipientRole:
          "user",
      });

    if (!notification) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Notification not found",
      );
    }

    return notification;
  }

  /*
   * Delete All User Notifications
   */

  async deleteAllUserNotifications(
    userId: string,
  ) {
    await Notification.deleteMany({
      recipientId:
        userId,

      recipientRole:
        "user",
    });

    return {
      success:
        true,
    };
  }
}

/*
 * ========================================
 * Export Service
 * ========================================
 */

export default new NotificationService();