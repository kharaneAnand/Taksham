import asyncHandler from "../helpers/asyncHandler.js";

import {
  successResponse,
} from "../helpers/response.js";

import notificationService from "../services/notification.service.js";

import type {
  CreateNotificationInput,
} from "../validators/notification.validator.js";

/*
 * ========================================
 * Notification Controller
 * ========================================
 */

class NotificationController {
  /*
   * ========================================
   * Create Notification
   * ========================================
   */

  createNotification =
    asyncHandler<
      Record<string, string>,
      unknown,
      CreateNotificationInput
    >(
      async (
        req,
        res,
      ) => {
        const notification =
          await notificationService.createNotification(
            req.body,
          );

        return successResponse(
          res,
          201,
          "Notification created successfully",
          notification,
        );
      },
    );

  /*
   * ========================================
   * ADMIN - Get Notifications
   * ========================================
   */

  getNotifications =
    asyncHandler(
      async (
        _req,
        res,
      ) => {
        const notifications =
          await notificationService.getNotifications();

        return successResponse(
          res,
          200,
          "Notifications fetched successfully",
          notifications,
        );
      },
    );

  /*
   * ========================================
   * ADMIN - Get Unread Count
   * ========================================
   */

  getUnreadCount =
    asyncHandler(
      async (
        _req,
        res,
      ) => {
        const result =
          await notificationService.getUnreadCount();

        return successResponse(
          res,
          200,
          "Unread notification count fetched successfully",
          result,
        );
      },
    );

  /*
   * ========================================
   * ADMIN - Mark One As Read
   * ========================================
   */

  markAsRead =
    asyncHandler(
      async (
        req,
        res,
      ) => {
        const notification =
          await notificationService.markAsRead(
            req.params.notificationId,
          );

        return successResponse(
          res,
          200,
          "Notification marked as read",
          notification,
        );
      },
    );

  /*
   * ========================================
   * ADMIN - Mark All As Read
   * ========================================
   */

  markAllAsRead =
    asyncHandler(
      async (
        _req,
        res,
      ) => {
        const result =
          await notificationService.markAllAsRead();

        return successResponse(
          res,
          200,
          "All notifications marked as read",
          result,
        );
      },
    );

  /*
   * ========================================
   * ADMIN - Delete One
   * ========================================
   */

  deleteNotification =
    asyncHandler(
      async (
        req,
        res,
      ) => {
        await notificationService.deleteNotification(
          req.params.notificationId,
        );

        return successResponse(
          res,
          200,
          "Notification deleted successfully",
          null,
        );
      },
    );

  /*
   * ========================================
   * ADMIN - Delete All
   * ========================================
   */

  deleteAllNotifications =
    asyncHandler(
      async (
        _req,
        res,
      ) => {
        const result =
          await notificationService.deleteAllNotifications();

        return successResponse(
          res,
          200,
          "All notifications deleted successfully",
          result,
        );
      },
    );

  /*
   * ========================================
   * USER - Get Notifications
   *
   * userId comes from route params
   * for now.
   * ========================================
   */

  getUserNotifications =
    asyncHandler(
      async (
        req,
        res,
      ) => {
        const notifications =
          await notificationService.getUserNotifications(
            req.params.userId,
          );

        return successResponse(
          res,
          200,
          "User notifications fetched successfully",
          notifications,
        );
      },
    );

  /*
   * ========================================
   * USER - Get Unread Count
   * ========================================
   */

  getUserUnreadCount =
    asyncHandler(
      async (
        req,
        res,
      ) => {
        const result =
          await notificationService.getUserUnreadCount(
            req.params.userId,
          );

        return successResponse(
          res,
          200,
          "User unread notification count fetched successfully",
          result,
        );
      },
    );

  /*
   * ========================================
   * USER - Mark One As Read
   * ========================================
   */

  markUserNotificationAsRead =
    asyncHandler(
      async (
        req,
        res,
      ) => {
        const notification =
          await notificationService.markUserNotificationAsRead(
            req.params.userId,
            req.params.notificationId,
          );

        return successResponse(
          res,
          200,
          "Notification marked as read",
          notification,
        );
      },
    );

  /*
   * ========================================
   * USER - Mark All As Read
   * ========================================
   */

  markAllUserNotificationsAsRead =
    asyncHandler(
      async (
        req,
        res,
      ) => {
        const result =
          await notificationService.markAllUserNotificationsAsRead(
            req.params.userId,
          );

        return successResponse(
          res,
          200,
          "All notifications marked as read",
          result,
        );
      },
    );

  /*
   * ========================================
   * USER - Delete One
   * ========================================
   */

  deleteUserNotification =
    asyncHandler(
      async (
        req,
        res,
      ) => {
        await notificationService.deleteUserNotification(
          req.params.userId,
          req.params.notificationId,
        );

        return successResponse(
          res,
          200,
          "Notification deleted successfully",
          null,
        );
      },
    );

  /*
   * ========================================
   * USER - Delete All
   * ========================================
   */

  deleteAllUserNotifications =
    asyncHandler(
      async (
        req,
        res,
      ) => {
        const result =
          await notificationService.deleteAllUserNotifications(
            req.params.userId,
          );

        return successResponse(
          res,
          200,
          "All notifications deleted successfully",
          result,
        );
      },
    );
}

/*
 * ========================================
 * Export Controller
 * ========================================
 */

export default new NotificationController();