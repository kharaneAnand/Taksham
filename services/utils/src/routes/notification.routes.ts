import { Router } from "express";

import notificationController from "../controllers/notification.controller.js";

/*
 * ========================================
 * Router
 * ========================================
 */

const router =
  Router();

/*
 * ========================================
 * INTERNAL - CREATE NOTIFICATION
 *
 * POST /notifications
 * ========================================
 */

router.post(
  "/",
  notificationController.createNotification,
);

/*
 * ========================================
 * ADMIN NOTIFICATIONS
 * ========================================
 */

/*
 * Get all admin notifications
 */

router.get(
  "/",
  notificationController.getNotifications,
);

/*
 * Get admin unread count
 */

router.get(
  "/unread-count",
  notificationController.getUnreadCount,
);

/*
 * Mark all admin notifications as read
 */

router.patch(
  "/read-all",
  notificationController.markAllAsRead,
);

/*
 * Mark one admin notification as read
 */

router.patch(
  "/:notificationId/read",
  notificationController.markAsRead,
);

/*
 * Delete all admin notifications
 */

router.delete(
  "/",
  notificationController.deleteAllNotifications,
);

/*
 * Delete one admin notification
 */

router.delete(
  "/:notificationId",
  notificationController.deleteNotification,
);

/*
 * ========================================
 * USER NOTIFICATIONS
 * ========================================
 */

/*
 * Get user notifications
 */

router.get(
  "/user/:userId",
  notificationController.getUserNotifications,
);

/*
 * Get user unread count
 */

router.get(
  "/user/:userId/unread-count",
  notificationController.getUserUnreadCount,
);

/*
 * Mark all user notifications as read
 */

router.patch(
  "/user/:userId/read-all",
  notificationController.markAllUserNotificationsAsRead,
);

/*
 * Mark one user notification as read
 */

router.patch(
  "/user/:userId/:notificationId/read",
  notificationController.markUserNotificationAsRead,
);

/*
 * Delete all user notifications
 */

router.delete(
  "/user/:userId",
  notificationController.deleteAllUserNotifications,
);

/*
 * Delete one user notification
 */

router.delete(
  "/user/:userId/:notificationId",
  notificationController.deleteUserNotification,
);

export default router;