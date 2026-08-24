import {
  Bell,
  Check,
  CheckCheck,
  Loader2,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type Notification,
  type NotificationType,
} from "../../api/notification.api";

/*
 * ========================================
 * Types
 * ========================================
 */

type NotificationFilter =
  | "all"
  | "unread"
  | NotificationType;

/*
 * ========================================
 * Notification Time Formatter
 * ========================================
 */

const formatNotificationTime = (
  createdAt: string,
): string => {
  const date =
    new Date(createdAt);

  const now =
    new Date();

  const difference =
    now.getTime() -
    date.getTime();

  const minutes =
    Math.floor(
      difference / 60000,
    );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} minute${
      minutes > 1 ? "s" : ""
    } ago`;
  }

  const hours =
    Math.floor(
      minutes / 60,
    );

  if (hours < 24) {
    return `${hours} hour${
      hours > 1 ? "s" : ""
    } ago`;
  }

  const days =
    Math.floor(
      hours / 24,
    );

  if (days < 7) {
    return `${days} day${
      days > 1 ? "s" : ""
    } ago`;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
};

/*
 * ========================================
 * Get Notification Type Label
 * ========================================
 */

const getNotificationTypeLabel = (
  type: NotificationType,
): string => {
  switch (type) {
    case "order":
      return "Order";

    case "stock":
      return "Stock";

    case "payment":
      return "Payment";

    case "user":
      return "User";

    case "system":
    default:
      return "System";
  }
};

/*
 * ========================================
 * Get Notification Type Styles
 * ========================================
 */

const getNotificationTypeStyles = (
  type: NotificationType,
): string => {
  switch (type) {
    case "order":
      return `
        bg-[#F1E8DC]
        text-[#8F6B3F]
      `;

    case "stock":
      return `
        bg-[#F8E6D8]
        text-[#A85B4B]
      `;

    case "payment":
      return `
        bg-[#E7EFE5]
        text-[#5F7B55]
      `;

    case "user":
      return `
        bg-[#E8E7F2]
        text-[#625B8A]
      `;

    case "system":
    default:
      return `
        bg-[#EEEAE4]
        text-[#71685E]
      `;
  }
};

/*
 * ========================================
 * Admin Notifications
 * ========================================
 */

const AdminNotifications = () => {
  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>(
    [],
  );

  const [
    filter,
    setFilter,
  ] =
    useState<NotificationFilter>(
      "all",
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(false);

  const [
    actionLoading,
    setActionLoading,
  ] =
    useState<string | null>(
      null,
    );

  /*
   * ========================================
   * Load Notifications
   * ========================================
   */

  const loadNotifications =
    useCallback(
      async (
        showRefresh = false,
      ) => {
        try {
          if (showRefresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          const data =
            await getNotifications();

          setNotifications(
            Array.isArray(data)
              ? data
              : [],
          );
        } catch (error) {
          console.error(
            "Failed to load notifications:",
            error,
          );

          setNotifications([]);
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [],
    );

  /*
   * ========================================
   * Initial Load
   * ========================================
   */

  useEffect(() => {
    void loadNotifications();
  }, [
    loadNotifications,
  ]);

  /*
   * ========================================
   * Counts
   * ========================================
   */

  const unreadCount =
    useMemo(
      () =>
        notifications.filter(
          (notification) =>
            !notification.isRead,
        ).length,
      [notifications],
    );

  /*
   * ========================================
   * Filtered Notifications
   * ========================================
   */

  const filteredNotifications =
    useMemo(() => {
      if (
        filter === "all"
      ) {
        return notifications;
      }

      if (
        filter === "unread"
      ) {
        return notifications.filter(
          (notification) =>
            !notification.isRead,
        );
      }

      return notifications.filter(
        (notification) =>
          notification.type === filter,
      );
    }, [
      filter,
      notifications,
    ]);

  /*
   * ========================================
   * Mark One As Read
   * ========================================
   */

  const handleMarkAsRead =
    async (
      notification: Notification,
    ) => {
      if (
        notification.isRead ||
        actionLoading
      ) {
        return;
      }

      try {
        setActionLoading(
          notification._id,
        );

        const updatedNotification =
          await markNotificationAsRead(
            notification._id,
          );

        setNotifications(
          (current) =>
            current.map(
              (item) =>
                item._id ===
                updatedNotification._id
                  ? {
                      ...item,
                      ...updatedNotification,
                    }
                  : item,
            ),
        );
      } catch (error) {
        console.error(
          "Failed to mark notification as read:",
          error,
        );
      } finally {
        setActionLoading(null);
      }
    };

  /*
   * ========================================
   * Mark All As Read
   * ========================================
   */

  const handleMarkAllAsRead =
    async () => {
      if (
        unreadCount === 0 ||
        actionLoading
      ) {
        return;
      }

      try {
        setActionLoading(
          "mark-all",
        );

        await markAllNotificationsAsRead();

        setNotifications(
          (current) =>
            current.map(
              (
                notification,
              ) => ({
                ...notification,
                isRead: true,
              }),
            ),
        );
      } catch (error) {
        console.error(
          "Failed to mark all notifications as read:",
          error,
        );
      } finally {
        setActionLoading(null);
      }
    };

  /*
   * ========================================
   * Delete One Notification
   * ========================================
   */

  const handleDeleteNotification =
    async (
      notification: Notification,
    ) => {
      if (actionLoading) {
        return;
      }

      try {
        setActionLoading(
          notification._id,
        );

        await deleteNotification(
          notification._id,
        );

        setNotifications(
          (current) =>
            current.filter(
              (item) =>
                item._id !==
                notification._id,
            ),
        );
      } catch (error) {
        console.error(
          "Failed to delete notification:",
          error,
        );
      } finally {
        setActionLoading(null);
      }
    };

  /*
   * ========================================
   * Delete All Notifications
   * ========================================
   */

  const handleDeleteAll =
    async () => {
      if (
        notifications.length === 0 ||
        actionLoading
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to delete all notifications?",
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoading(
          "clear-all",
        );

        await deleteAllNotifications();

        setNotifications([]);
      } catch (error) {
        console.error(
          "Failed to delete all notifications:",
          error,
        );
      } finally {
        setActionLoading(null);
      }
    };

  /*
   * ========================================
   * Filters
   * ========================================
   */

  const filters: Array<{
    label: string;
    value: NotificationFilter;
  }> = [
    {
      label: "All",
      value: "all",
    },
    {
      label: `Unread (${unreadCount})`,
      value: "unread",
    },
    {
      label: "Orders",
      value: "order",
    },
    {
      label: "Payments",
      value: "payment",
    },
    {
      label: "Stock",
      value: "stock",
    },
    {
      label: "Users",
      value: "user",
    },
    {
      label: "System",
      value: "system",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div
        className="
          flex
          flex-col
          gap-5
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
          <div
            className="
              flex
              items-center
              gap-2
              text-[#A4773E]
            "
          >
            <Bell
              size={16}
              strokeWidth={1.6}
            />

            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.2em]
              "
            >
              Admin Center
            </p>
          </div>

          <h1
            className="
              mt-2
              font-serif
              text-[28px]
              tracking-[-0.03em]
              text-[#302B25]
              sm:text-[34px]
            "
          >
            Notifications
          </h1>

          <p
            className="
              mt-2
              text-[11px]
              text-[#81776C]
            "
          >
            Stay updated with orders,
            payments, stock and system
            activity.
          </p>
        </div>

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-2
          "
        >
          <button
            type="button"
            onClick={() =>
              void loadNotifications(
                true,
              )
            }
            disabled={
              loading ||
              refreshing
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-[#E2DAD0]
              bg-white
              px-3.5
              py-2.5
              text-[9px]
              font-semibold
              uppercase
              tracking-widest
              text-[#62594F]
              transition
              hover:bg-[#F7F1E9]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <RefreshCw
              size={14}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={() =>
              void handleMarkAllAsRead()
            }
            disabled={
              unreadCount === 0 ||
              actionLoading !== null
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-[#8F6B3F]
              px-3.5
              py-2.5
              text-[9px]
              font-semibold
              uppercase
              tracking-widest
              text-white
              transition
              hover:bg-[#76562F]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {actionLoading ===
            "mark-all" ? (
              <Loader2
                size={14}
                className="animate-spin"
              />
            ) : (
              <CheckCheck
                size={14}
              />
            )}

            Mark all read
          </button>

          <button
            type="button"
            onClick={() =>
              void handleDeleteAll()
            }
            disabled={
              notifications.length === 0 ||
              actionLoading !== null
            }
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-[#E6CFC7]
              bg-white
              px-3.5
              py-2.5
              text-[9px]
              font-semibold
              uppercase
              tracking-widest
              text-[#A85B4B]
              transition
              hover:bg-[#F9ECE8]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {actionLoading ===
            "clear-all" ? (
              <Loader2
                size={14}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={14} />
            )}

            Clear all
          </button>
        </div>
      </div>

      {/* =====================================
          STATS
      ===================================== */}

      <div
        className="
          mt-8
          grid
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        <div
          className="
            rounded-2xl
            border
            border-[#E4DDD4]
            bg-[#FBF9F5]
            p-5
          "
        >
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-[#A0988E]
            "
          >
            Total notifications
          </p>

          <p
            className="
              mt-2
              font-serif
              text-[30px]
              text-[#302B25]
            "
          >
            {notifications.length}
          </p>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-[#E7D8C7]
            bg-[#F8F1E8]
            p-5
          "
        >
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-[#9A7138]
            "
          >
            Unread
          </p>

          <p
            className="
              mt-2
              font-serif
              text-[30px]
              text-[#76562F]
            "
          >
            {unreadCount}
          </p>
        </div>

        <div
          className="
            rounded-2xl
            border
            border-[#E4DDD4]
            bg-[#FBF9F5]
            p-5
          "
        >
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-[#A0988E]
            "
          >
            Read
          </p>

          <p
            className="
              mt-2
              font-serif
              text-[30px]
              text-[#302B25]
            "
          >
            {
              notifications.length -
              unreadCount
            }
          </p>
        </div>
      </div>

      {/* =====================================
          FILTERS
      ===================================== */}

      <div
        className="
          mt-8
          flex
          gap-2
          overflow-x-auto
          pb-1
        "
      >
        {filters.map(
          (item) => (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                setFilter(
                  item.value,
                )
              }
              className={`
                shrink-0
                rounded-xl
                border
                px-3.5
                py-2.5
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.08em]
                transition
                ${
                  filter === item.value
                    ? `
                      border-[#8F6B3F]
                      bg-[#8F6B3F]
                      text-white
                    `
                    : `
                      border-[#E2DAD0]
                      bg-white
                      text-[#71685E]
                      hover:bg-[#F7F1E9]
                    `
                }
              `}
            >
              {item.label}
            </button>
          ),
        )}
      </div>

      {/* =====================================
          NOTIFICATION LIST
      ===================================== */}

      <div
        className="
          mt-5
          overflow-hidden
          rounded-2xl
          border
          border-[#E4DDD4]
          bg-[#FBF9F5]
        "
      >
        {loading ? (
          <div
            className="
              flex
              min-h-100
              flex-col
              items-center
              justify-center
            "
          >
            <Loader2
              size={25}
              className="
                animate-spin
                text-[#A4773E]
              "
            />

            <p
              className="
                mt-4
                text-[10px]
                text-[#81776C]
              "
            >
              Loading notifications...
            </p>
          </div>
        ) : filteredNotifications.length ===
          0 ? (
          <div
            className="
              flex
              min-h-100
              flex-col
              items-center
              justify-center
              px-6
              text-center
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-[#F1E8DC]
                text-[#A4773E]
              "
            >
              <Bell
                size={24}
                strokeWidth={1.4}
              />
            </div>

            <h2
              className="
                mt-5
                font-serif
                text-[21px]
                text-[#302B25]
              "
            >
              No notifications found
            </h2>

            <p
              className="
                mt-2
                max-w-xs
                text-[10px]
                leading-relaxed
                text-[#81776C]
              "
            >
              Notifications matching this
              filter will appear here.
            </p>
          </div>
        ) : (
          <div>
            {filteredNotifications.map(
              (notification) => (
                <div
                  key={
                    notification._id
                  }
                  className={`
                    group
                    flex
                    gap-4
                    border-b
                    border-[#EAE3DA]
                    px-5
                    py-5
                    transition
                    hover:bg-[#F7F1E9]
                    sm:px-6
                    ${
                      notification.isRead
                        ? ""
                        : "bg-[#F5EDE3]/60"
                    }
                  `}
                >
                  {/* Status */}

                  <div className="pt-1">
                    <span
                      className={`
                        block
                        h-2.5
                        w-2.5
                        rounded-full
                        ${
                          notification.isRead
                            ? "bg-[#D2C9BE]"
                            : "bg-[#A4773E]"
                        }
                      `}
                    />
                  </div>

                  {/* Content */}

                  <button
                    type="button"
                    onClick={() =>
                      void handleMarkAsRead(
                        notification,
                      )
                    }
                    disabled={
                      notification.isRead ||
                      actionLoading !== null
                    }
                    className="
                      min-w-0
                      flex-1
                      text-left
                      disabled:cursor-default
                    "
                  >
                    <div
                      className="
                        flex
                        flex-col
                        gap-2
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                      "
                    >
                      <div
                        className="
                          flex
                          min-w-0
                          flex-wrap
                          items-center
                          gap-2
                        "
                      >
                        <h3
                          className="
                            text-[12px]
                            font-semibold
                            text-[#403932]
                          "
                        >
                          {
                            notification.title
                          }
                        </h3>

                        <span
                          className={`
                            rounded-md
                            px-2
                            py-1
                            text-[7px]
                            font-bold
                            uppercase
                            tracking-[0.08em]
                            ${getNotificationTypeStyles(
                              notification.type,
                            )}
                          `}
                        >
                          {getNotificationTypeLabel(
                            notification.type,
                          )}
                        </span>
                      </div>

                      <span
                        className="
                          shrink-0
                          text-[9px]
                          text-[#A0988E]
                        "
                      >
                        {formatNotificationTime(
                          notification.createdAt,
                        )}
                      </span>
                    </div>

                    <p
                      className="
                        mt-2
                        max-w-3xl
                        text-[10px]
                        leading-relaxed
                        text-[#81776C]
                      "
                    >
                      {
                        notification.message
                      }
                    </p>
                  </button>

                  {/* Actions */}

                  <div
                    className="
                      flex
                      shrink-0
                      items-start
                      gap-1
                    "
                  >
                    {!notification.isRead && (
                      <button
                        type="button"
                        onClick={() =>
                          void handleMarkAsRead(
                            notification,
                          )
                        }
                        disabled={
                          actionLoading !== null
                        }
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-lg
                          text-[#8F6B3F]
                          transition
                          hover:bg-[#EFE5D8]
                          disabled:opacity-50
                        "
                        title="Mark as read"
                      >
                        {actionLoading ===
                        notification._id ? (
                          <Loader2
                            size={15}
                            className="animate-spin"
                          />
                        ) : (
                          <Check
                            size={15}
                          />
                        )}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        void handleDeleteNotification(
                          notification,
                        )
                      }
                      disabled={
                        actionLoading !== null
                      }
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        text-[#A0988E]
                        transition
                        hover:bg-[#F4E2DC]
                        hover:text-[#A85B4B]
                        disabled:opacity-50
                      "
                      title="Delete notification"
                    >
                      {actionLoading ===
                      notification._id ? (
                        <Loader2
                          size={15}
                          className="animate-spin"
                        />
                      ) : (
                        <X size={16} />
                      )}
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* =====================================
          FOOTER INFO
      ===================================== */}

      {!loading &&
        filteredNotifications.length >
          0 && (
          <p
            className="
              mt-4
              text-center
              text-[9px]
              text-[#A0988E]
            "
          >
            Showing{" "}
            {
              filteredNotifications.length
            }{" "}
            notification
            {filteredNotifications.length !==
            1
              ? "s"
              : ""}
          </p>
        )}
    </div>
  );
};

export default AdminNotifications;