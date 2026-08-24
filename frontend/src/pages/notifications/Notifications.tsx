import {
  Bell,
  Check,
  CheckCheck,
  ChevronLeft,
  Loader2,
  Package,
  RefreshCw,
  ShoppingBag,
  Trash2,
  CreditCard,
  User,
  Settings,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  deleteAllUserNotifications,
  deleteUserNotification,
  getUserNotifications,
  markAllUserNotificationsAsRead,
  markUserNotificationAsRead,
  type Notification,
} from "../../api/notification.api";

/*
 * ========================================
 * Auth User
 * ========================================
 */

interface AuthUser {
  id?: string | number;

  _id?: string | number;
}

/*
 * ========================================
 * Notification Icon
 * ========================================
 */

const NotificationIcon = ({
  type,
}: {
  type: Notification["type"];
}) => {
  const className =
    "h-4.5 w-4.5";

  switch (type) {
    case "order":
      return (
        <Package
          className={className}
        />
      );

    case "payment":
      return (
        <CreditCard
          className={className}
        />
      );

    case "stock":
      return (
        <ShoppingBag
          className={className}
        />
      );

    case "user":
      return (
        <User
          className={className}
        />
      );

    default:
      return (
        <Settings
          className={className}
        />
      );
  }
};

/*
 * ========================================
 * Format Date
 * ========================================
 */

const formatNotificationDate = (
  date: string,
) => {
  const notificationDate =
    new Date(date);

  const now =
    new Date();

  const difference =
    now.getTime() -
    notificationDate.getTime();

  const minutes =
    Math.floor(
      difference / 60000,
    );

  const hours =
    Math.floor(
      difference / 3600000,
    );

  const days =
    Math.floor(
      difference / 86400000,
    );

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return notificationDate.toLocaleDateString(
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
 * Get User ID
 * ========================================
 */

const getUserId = (
  user: AuthUser | null,
): string | null => {
  if (!user) {
    return null;
  }

  const id =
    user.id ??
    user._id;

  if (
    id === undefined ||
    id === null
  ) {
    return null;
  }

  return String(id);
};

/*
 * ========================================
 * Notifications Page
 * ========================================
 */

const Notifications = () => {
  const navigate =
    useNavigate();

  const [
    user,
    setUser,
  ] =
    useState<AuthUser | null>(
      null,
    );

  const [
    notifications,
    setNotifications,
  ] =
    useState<Notification[]>([]);

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
   * Get Current User
   * ========================================
   */

  const getCurrentUser =
    useCallback(
      async (): Promise<AuthUser | null> => {
        try {
          const response =
            await fetch(
              "http://localhost:5001/api/v1/auth/me",
              {
                method: "GET",

                credentials:
                  "include",

                headers: {
                  Accept:
                    "application/json",
                },
              },
            );

          if (!response.ok) {
            setUser(null);

            return null;
          }

          const data =
            await response.json();

          /*
           * Supports different backend
           * response structures.
           */

          const currentUser =
            data?.user ??
            data?.data?.user ??
            data?.data ??
            data;

          if (
            currentUser &&
            typeof currentUser ===
              "object"
          ) {
            const normalizedUser: AuthUser =
              {
                id:
                  currentUser.id ??
                  currentUser._id,

                _id:
                  currentUser._id ??
                  currentUser.id,
              };

            const userId =
              getUserId(
                normalizedUser,
              );

            if (userId) {
              setUser(
                normalizedUser,
              );

              return normalizedUser;
            }
          }

          setUser(null);

          return null;
        } catch (error) {
          console.error(
            "Failed to fetch current user:",
            error,
          );

          setUser(null);

          return null;
        }
      },
      [],
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
          }

          let currentUser =
            user;

          let userId =
            getUserId(
              currentUser,
            );

          /*
           * If user is not available
           * in state, fetch it first.
           */

          if (!userId) {
            currentUser =
              await getCurrentUser();

            userId =
              getUserId(
                currentUser,
              );
          }

          /*
           * No logged-in user.
           */

          if (!userId) {
            setNotifications([]);

            return;
          }

          const data =
            await getUserNotifications(
              userId,
            );

          setNotifications(
            Array.isArray(data)
              ? data
              : [],
          );
        } catch (error) {
          console.error(
            "Failed to fetch notifications:",
            error,
          );

          setNotifications([]);
        } finally {
          setLoading(false);

          setRefreshing(false);
        }
      },
      [
        getCurrentUser,
        user,
      ],
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
   * Mark One As Read
   * ========================================
   */

  const handleMarkAsRead =
    async (
      notificationId: string,
    ) => {
      const userId =
        getUserId(user);

      if (!userId) {
        return;
      }

      try {
        setActionLoading(
          notificationId,
        );

        await markUserNotificationAsRead(
          userId,
          notificationId,
        );

        setNotifications(
          (previous) =>
            previous.map(
              (
                notification,
              ) =>
                notification._id ===
                notificationId
                  ? {
                      ...notification,

                      isRead:
                        true,
                    }
                  : notification,
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
      const userId =
        getUserId(user);

      if (!userId) {
        return;
      }

      try {
        setActionLoading(
          "mark-all",
        );

        await markAllUserNotificationsAsRead(
          userId,
        );

        setNotifications(
          (previous) =>
            previous.map(
              (
                notification,
              ) => ({
                ...notification,

                isRead:
                  true,
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
   * Delete One
   * ========================================
   */

  const handleDelete =
    async (
      notificationId: string,
    ) => {
      const userId =
        getUserId(user);

      if (!userId) {
        return;
      }

      try {
        setActionLoading(
          notificationId,
        );

        await deleteUserNotification(
          userId,
          notificationId,
        );

        setNotifications(
          (previous) =>
            previous.filter(
              (
                notification,
              ) =>
                notification._id !==
                notificationId,
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
   * Clear All
   * ========================================
   */

  const handleClearAll =
    async () => {
      const userId =
        getUserId(user);

      if (
        !userId ||
        notifications.length === 0
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

        await deleteAllUserNotifications(
          userId,
        );

        setNotifications([]);
      } catch (error) {
        console.error(
          "Failed to clear notifications:",
          error,
        );
      } finally {
        setActionLoading(null);
      }
    };

  /*
   * ========================================
   * Notification Click
   * ========================================
   */

  const handleNotificationClick =
    async (
      notification: Notification,
    ) => {
      /*
       * Mark notification as read first.
       */

      if (
        !notification.isRead &&
        getUserId(user)
      ) {
        await handleMarkAsRead(
          notification._id,
        );
      }

      /*
       * Navigate to order.
       */

      const orderId =
        notification.metadata?.orderId;

      if (
        orderId &&
        typeof orderId ===
          "string"
      ) {
        navigate(
          `/orders/${orderId}`,
        );

        return;
      }

      /*
       * Navigate to product.
       */

      const productId =
        notification.metadata?.productId;

      if (
        productId &&
        typeof productId ===
          "string"
      ) {
        navigate(
          `/products/${productId}`,
        );
      }
    };

  /*
   * ========================================
   * Counts
   * ========================================
   */

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead,
    ).length;

  /*
   * ========================================
   * Render
   * ========================================
   */

  return (
    <main className="min-h-screen bg-[#FCFAF7]">
      <div className="mx-auto max-w-275 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

        {/* Header */}

        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() =>
                navigate(-1)
              }
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                border
                border-[#E7DED3]
                bg-white
                text-[#5D5349]
                transition-all
                hover:bg-[#F7F1E8]
                active:scale-95
              "
              aria-label="Go back"
            >
              <ChevronLeft
                size={20}
              />
            </button>

            <div>
              <div className="flex items-center gap-3">

                <div className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#F1E5D3]
                  text-[#8A6539]
                ">
                  <Bell
                    size={20}
                    strokeWidth={1.6}
                  />
                </div>

                <div>
                  <h1 className="
                    font-serif
                    text-[28px]
                    font-medium
                    tracking-[-0.03em]
                    text-[#302A24]
                    sm:text-[34px]
                  ">
                    Notifications
                  </h1>

                  <p className="
                    mt-0.5
                    text-[11px]
                    text-[#92877B]
                  ">
                    {unreadCount > 0
                      ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                      : "You're all caught up"}
                  </p>
                </div>

              </div>
            </div>

          </div>

          <div className="
            flex
            flex-wrap
            items-center
            gap-2
          ">

            <button
              type="button"
              onClick={() =>
                void loadNotifications(
                  true,
                )
              }
              disabled={
                refreshing
              }
              className="
                flex
                h-10
                items-center
                gap-2
                rounded-xl
                border
                border-[#E5DDD3]
                bg-white
                px-4
                text-[10px]
                font-semibold
                uppercase
                tracking-widest
                text-[#665B50]
                transition-all
                hover:bg-[#F8F4EE]
                disabled:opacity-60
              "
            >
              <RefreshCw
                size={15}
                className={
                  refreshing
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={
                  () =>
                    void handleMarkAllAsRead()
                }
                disabled={
                  actionLoading ===
                  "mark-all"
                }
                className="
                  flex
                  h-10
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-[#DCC8AC]
                  bg-[#F7EFE4]
                  px-4
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-widest
                  text-[#765936]
                  transition-all
                  hover:bg-[#F1E4D2]
                  disabled:opacity-60
                "
              >
                {actionLoading ===
                "mark-all" ? (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <CheckCheck
                    size={15}
                  />
                )}

                Mark all read
              </button>
            )}

            {notifications.length >
              0 && (
              <button
                type="button"
                onClick={
                  () =>
                    void handleClearAll()
                }
                disabled={
                  actionLoading ===
                  "clear-all"
                }
                className="
                  flex
                  h-10
                  items-center
                  gap-2
                  rounded-xl
                  border
                  border-[#E9D7D2]
                  bg-[#FCF6F4]
                  px-4
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-widest
                  text-[#965F54]
                  transition-all
                  hover:bg-[#F8EAE6]
                  disabled:opacity-60
                "
              >
                {actionLoading ===
                "clear-all" ? (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2
                    size={15}
                  />
                )}

                Clear all
              </button>
            )}

          </div>
        </div>

        {/* Loading */}

        {loading && (
          <div className="
            flex
            min-h-100
            items-center
            justify-center
          ">
            <Loader2
              size={28}
              className="
                animate-spin
                text-[#A4773E]
              "
            />
          </div>
        )}

        {/* Empty State */}

        {!loading &&
          notifications.length ===
            0 && (
            <div className="
              flex
              min-h-100
              flex-col
              items-center
              justify-center
              rounded-3xl
              border
              border-[#E9E1D7]
              bg-white
              px-6
              text-center
              shadow-[0_8px_30px_rgba(70,50,30,0.03)]
            ">

              <div className="
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                bg-[#F6EFE5]
                text-[#A4773E]
              ">
                <Bell
                  size={30}
                  strokeWidth={1.4}
                />
              </div>

              <h2 className="
                mt-5
                font-serif
                text-[24px]
                font-medium
                text-[#3A322A]
              ">
                No notifications yet
              </h2>

              <p className="
                mt-2
                max-w-95
                text-[12px]
                leading-relaxed
                text-[#968B80]
              ">
                We'll let you know about your
                orders, payments and other
                important updates here.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/products",
                  )
                }
                className="
                  mt-6
                  rounded-xl
                  bg-[#8F6B3F]
                  px-5
                  py-3
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.13em]
                  text-white
                  transition-all
                  hover:bg-[#795832]
                  active:scale-[0.98]
                "
              >
                Continue Shopping
              </button>

            </div>
          )}

        {/* Notification List */}

        {!loading &&
          notifications.length >
            0 && (
            <div className="
              overflow-hidden
              rounded-[22px]
              border
              border-[#E9E1D7]
              bg-white
              shadow-[0_8px_30px_rgba(70,50,30,0.03)]
            ">
              {notifications.map(
                (
                  notification,
                ) => (
                  <div
                    key={
                      notification._id
                    }
                    className={`
                      group
                      relative
                      flex
                      gap-4
                      border-b
                      border-[#EEE8E0]
                      p-5
                      transition-all
                      last:border-b-0
                      ${
                        notification.isRead
                          ? "bg-white"
                          : "bg-[#FCF8F2]"
                      }
                    `}
                  >

                    {!notification.isRead && (
                      <span className="
                        absolute
                        left-0
                        top-0
                        h-full
                        w-0.75
                        bg-[#B7894A]
                      " />
                    )}

                    {/* Icon */}

                    <button
                      type="button"
                      onClick={() =>
                        void handleNotificationClick(
                          notification,
                        )
                      }
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#F3E8D9]
                        text-[#926C3E]
                      "
                    >
                      <NotificationIcon
                        type={
                          notification.type
                        }
                      />
                    </button>

                    {/* Content */}

                    <button
                      type="button"
                      onClick={() =>
                        void handleNotificationClick(
                          notification,
                        )
                      }
                      className="
                        min-w-0
                        flex-1
                        text-left
                      "
                    >
                      <div className="
                        flex
                        flex-col
                        gap-1
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                      ">
                        <h3 className={`
                          text-[13px]
                          ${
                            notification.isRead
                              ? "font-medium"
                              : "font-semibold"
                          }
                          text-[#39332C]
                        `}>
                          {notification.title}
                        </h3>

                        <span className="
                          shrink-0
                          text-[9px]
                          text-[#A0968B]
                        ">
                          {formatNotificationDate(
                            notification.createdAt,
                          )}
                        </span>
                      </div>

                      <p className="
                        mt-1
                        max-w-175
                        text-[11px]
                        leading-relaxed
                        text-[#83786E]
                      ">
                        {
                          notification.message
                        }
                      </p>
                    </button>

                    {/* Actions */}

                    <div className="
                      flex
                      shrink-0
                      items-start
                      gap-1
                    ">

                      {!notification.isRead && (
                        <button
                          type="button"
                          onClick={() =>
                            void handleMarkAsRead(
                              notification._id,
                            )
                          }
                          disabled={
                            actionLoading ===
                            notification._id
                          }
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            text-[#8C806F]
                            transition-all
                            hover:bg-[#F3EADD]
                            hover:text-[#9A7138]
                            disabled:opacity-50
                          "
                          aria-label="Mark as read"
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
                              size={16}
                            />
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          void handleDelete(
                            notification._id,
                          )
                        }
                        disabled={
                          actionLoading ===
                          notification._id
                        }
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          text-[#A18D82]
                          transition-all
                          hover:bg-[#F8EDEA]
                          hover:text-[#A26357]
                          disabled:opacity-50
                        "
                        aria-label="Delete notification"
                        title="Delete notification"
                      >
                        <X
                          size={16}
                        />
                      </button>

                    </div>

                  </div>
                ),
              )}
            </div>
          )}

      </div>
    </main>
  );
};

export default Notifications;