import {
  BarChart3,
  Bell,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Tag,
  Trash2,
  Users,
  X,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  deleteNotification,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type Notification,
} from "../api/notification.api";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    path: "/admin/products",
    icon: Package,
  },
  {
    label: "Categories",
    path: "/admin/categories",
    icon: FolderOpen,
  },
  {
    label: "Collections",
    path: "/admin/collections",
    icon: Tag,
  },
  {
    label: "Offers",
    path: "/admin/offers",
    icon: Tag,
  },
  {
    label: "Orders",
    path: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Customers",
    path: "/admin/customers",
    icon: Users,
  },
];

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
    return `${minutes}m ago`;
  }

  const hours =
    Math.floor(
      minutes / 60,
    );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days =
    Math.floor(
      hours / 24,
    );

  if (days < 7) {
    return `${days}d ago`;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
    },
  );
};

/*
 * ========================================
 * Admin Layout
 * ========================================
 */

const AdminLayout = () => {
  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const [
    collapsed,
    setCollapsed,
  ] = useState(false);

  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>(
    [],
  );

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  const [
    notificationOpen,
    setNotificationOpen,
  ] = useState(false);

  const [
    loadingNotifications,
    setLoadingNotifications,
  ] = useState(false);

  const notificationRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const isDashboard =
    location.pathname === "/admin";

  /*
   * ========================================
   * Load Notifications
   * ========================================
   */

  const loadNotifications =
    async () => {
      try {
        setLoadingNotifications(true);

        const [
          notificationData,
          unreadData,
        ] =
          await Promise.all([
            getNotifications(),
            getUnreadNotificationCount(),
          ]);

        setNotifications(
          notificationData,
        );

        setUnreadCount(
          unreadData,
        );
      } catch (error) {
        console.error(
          "Failed to load notifications:",
          error,
        );
      } finally {
        setLoadingNotifications(
          false,
        );
      }
    };

  /*
   * ========================================
   * Initial Notification Load
   * ========================================
   */

  useEffect(() => {
    void loadNotifications();
  }, []);

  /*
   * ========================================
   * Close Notification Dropdown
   * When Clicking Outside
   * ========================================
   */

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target as Node,
        )
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  /*
   * ========================================
   * Mark One Notification As Read
   * ========================================
   */

  const handleMarkAsRead =
    async (
      notification: Notification,
    ) => {
      if (
        notification.isRead
      ) {
        return;
      }

      try {
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
                  ? updatedNotification
                  : item,
            ),
        );

        setUnreadCount(
          (current) =>
            Math.max(
              current - 1,
              0,
            ),
        );
      } catch (error) {
        console.error(
          "Failed to mark notification as read:",
          error,
        );
      }
    };

  /*
   * ========================================
   * Mark All Notifications As Read
   * ========================================
   */

  const handleMarkAllAsRead =
    async () => {
      try {
        await markAllNotificationsAsRead();

        setNotifications(
          (current) =>
            current.map(
              (notification) => ({
                ...notification,
                isRead: true,
              }),
            ),
        );

        setUnreadCount(0);
      } catch (error) {
        console.error(
          "Failed to mark all notifications as read:",
          error,
        );
      }
    };

  /*
   * ========================================
   * Delete Notification
   * ========================================
   */

  const handleDeleteNotification =
    async (
      event: React.MouseEvent,
      notification: Notification,
    ) => {
      event.stopPropagation();

      try {
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

        if (
          !notification.isRead
        ) {
          setUnreadCount(
            (current) =>
              Math.max(
                current - 1,
                0,
              ),
          );
        }
      } catch (error) {
        console.error(
          "Failed to delete notification:",
          error,
        );
      }
    };

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#302B25]">

      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() =>
            setSidebarOpen(false)
          }
          className="
            fixed
            inset-0
            z-40
            bg-black/20
            backdrop-blur-[2px]
            lg:hidden
          "
        />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50
          flex
          flex-col
          border-r
          border-[#E4DDD4]
          bg-[#FBF9F5]
          transition-all
          duration-300
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
          ${
            collapsed
              ? "lg:w-20"
              : "lg:w-63"
          }
          w-63
        `}
      >
        {/* Logo */}

        <div
          className={`
            flex
            h-19
            items-center
            border-b
            border-[#E4DDD4]
            ${
              collapsed
                ? "justify-center px-3"
                : "justify-between px-5"
            }
          `}
        >
          <NavLink
            to="/admin"
            className="flex items-center gap-3"
          >
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-[#8F6B3F]
                text-white
              "
            >
              <span className="font-serif text-[19px]">
                T
              </span>
            </div>

            {!collapsed && (
              <div>
                <p
                  className="
                    font-serif
                    text-[20px]
                    leading-none
                    tracking-[-0.03em]
                  "
                >
                  Taksham
                </p>

                <p
                  className="
                    mt-1
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-[0.22em]
                    text-[#9A7138]
                  "
                >
                  Admin
                </p>
              </div>
            )}
          </NavLink>

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-[#81776C]
              hover:bg-[#F0EBE4]
              lg:hidden
            "
          >
            <X size={17} />
          </button>
        </div>

        {/* Navigation */}

        <div className="flex-1 overflow-y-auto px-3 py-5">
          {!collapsed && (
            <p
              className="
                mb-3
                px-3
                text-[7px]
                font-semibold
                uppercase
                tracking-[0.24em]
                text-[#A0988E]
              "
            >
              Management
            </p>
          )}

          <nav className="space-y-1">
            {navigationItems.map(
              ({
                label,
                path,
                icon: Icon,
              }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() =>
                    setSidebarOpen(false)
                  }
                  end={path === "/admin"}
                  title={
                    collapsed
                      ? label
                      : undefined
                  }
                  className={({ isActive }) =>
                    `
                    group
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-[10px]
                    font-medium
                    transition-all
                    duration-200
                    ${
                      collapsed
                        ? "justify-center"
                        : ""
                    }
                    ${
                      isActive
                        ? `
                          bg-[#EFE5D8]
                          text-[#76562F]
                        `
                        : `
                          text-[#71685E]
                          hover:bg-[#F3EFE9]
                          hover:text-[#302B25]
                        `
                    }
                  `
                  }
                >
                  <Icon
                    size={16}
                    strokeWidth={1.5}
                    className="
                      shrink-0
                      transition-transform
                      duration-200
                      group-hover:scale-105
                    "
                  />

                  {!collapsed && (
                    <span>{label}</span>
                  )}
                </NavLink>
              ),
            )}
          </nav>

          <div className="my-6 h-px bg-[#E7E0D7]" />

          <NavLink
            to="/admin/settings"
            title={
              collapsed
                ? "Settings"
                : undefined
            }
            className={`
              flex
              items-center
              gap-3
              rounded-xl
              px-3
              py-3
              text-[10px]
              font-medium
              text-[#71685E]
              transition-all
              hover:bg-[#F3EFE9]
              hover:text-[#302B25]
              ${
                collapsed
                  ? "justify-center"
                  : ""
              }
            `}
          >
            <Settings
              size={16}
              strokeWidth={1.5}
            />

            {!collapsed && (
              <span>Settings</span>
            )}
          </NavLink>
        </div>

        {/* Collapse */}

        <div className="hidden border-t border-[#E4DDD4] p-3 lg:block">
          <button
            type="button"
            onClick={() =>
              setCollapsed(
                (current) => !current,
              )
            }
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              py-2.5
              text-[#81776C]
              transition
              hover:bg-[#F0EBE4]
            "
            title={
              collapsed
                ? "Expand sidebar"
                : "Collapse sidebar"
            }
          >
            {collapsed ? (
              <ChevronRight size={15} />
            ) : (
              <>
                <ChevronLeft size={15} />

                <span
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                  "
                >
                  Collapse
                </span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div
        className={`
          min-h-screen
          transition-[padding]
          duration-300
          ${
            collapsed
              ? "lg:pl-20"
              : "lg:pl-63"
          }
        `}
      >
        {/* ===================================================
            TOPBAR
        =================================================== */}

        <header
          className="
            sticky
            top-0
            z-30
            flex
            h-19
            items-center
            justify-between
            border-b
            border-[#E4DDD4]
            bg-[#FBF9F5]/95
            px-5
            backdrop-blur-md
            sm:px-7
            lg:px-10
          "
        >
          {/* Left */}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setSidebarOpen(true)
              }
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-[#E2DAD0]
                bg-white
                text-[#62594F]
                lg:hidden
              "
            >
              <Menu size={17} />
            </button>

            <div>
              <p
                className="
                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-[#A4773E]
                "
              >
                Taksham
              </p>

              <h1
                className="
                  mt-0.5
                  font-serif
                  text-[22px]
                  leading-none
                  tracking-[-0.03em]
                  text-[#302B25]
                  sm:text-[24px]
                "
              >
                {isDashboard
                  ? "Dashboard"
                  : "Admin Panel"}
              </h1>
            </div>
          </div>

          {/* Right */}

          <div className="flex items-center gap-3">

            {/* ===============================================
                NOTIFICATION BELL
            =============================================== */}

            <div
              ref={notificationRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() =>
                  setNotificationOpen(
                    (current) => !current,
                  )
                }
                className="
                  relative
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#E2DAD0]
                  bg-white
                  text-[#62594F]
                  transition
                  hover:bg-[#F7F1E9]
                  hover:text-[#76562F]
                "
                aria-label="Notifications"
              >
                <Bell
                  size={17}
                  strokeWidth={1.6}
                />

                {unreadCount > 0 && (
                  <span
                    className="
                      absolute
                      -right-1
                      -top-1
                      flex
                      min-h-5
                      min-w-5
                      items-center
                      justify-center
                      rounded-full
                      bg-[#A4773E]
                      px-1
                      text-[8px]
                      font-bold
                      text-white
                    "
                  >
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
              </button>

              {/* =============================================
                  NOTIFICATION DROPDOWN
              ============================================== */}

              {notificationOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-12
                    z-50
                    w-90
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[#E4DDD4]
                    bg-[#FBF9F5]
                    shadow-xl
                    shadow-[#302B25]/10
                    sm:w-100
                  "
                >
                  {/* Header */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      border-b
                      border-[#E7E0D7]
                      px-4
                      py-4
                    "
                  >
                    <div>
                      <h2
                        className="
                          font-serif
                          text-[18px]
                          text-[#302B25]
                        "
                      >
                        Notifications
                      </h2>

                      <p
                        className="
                          mt-0.5
                          text-[9px]
                          text-[#81776C]
                        "
                      >
                        {unreadCount > 0
                          ? `${unreadCount} unread notification${
                              unreadCount > 1
                                ? "s"
                                : ""
                            }`
                          : "You're all caught up"}
                      </p>
                    </div>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          void handleMarkAllAsRead()
                        }
                        className="
                          flex
                          items-center
                          gap-1.5
                          rounded-lg
                          px-2.5
                          py-2
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-[0.08em]
                          text-[#8F6B3F]
                          transition
                          hover:bg-[#F1E8DC]
                        "
                      >
                        <CheckCheck
                          size={14}
                        />

                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notification List */}

                  <div
                    className="
                      max-h-105
                      overflow-y-auto
                    "
                  >
                    {loadingNotifications ? (
                      <div
                        className="
                          flex
                          min-h-45
                          items-center
                          justify-center
                          text-[10px]
                          text-[#81776C]
                        "
                      >
                        Loading notifications...
                      </div>
                    ) : notifications.length ===
                      0 ? (
                      <div
                        className="
                          flex
                          min-h-50
                          flex-col
                          items-center
                          justify-center
                          px-6
                          text-center
                        "
                      >
                        <Bell
                          size={24}
                          strokeWidth={1.3}
                          className="text-[#B5ACA1]"
                        />

                        <p
                          className="
                            mt-3
                            text-[11px]
                            font-medium
                            text-[#62594F]
                          "
                        >
                          No notifications yet
                        </p>

                        <p
                          className="
                            mt-1
                            text-[9px]
                            text-[#A0988E]
                          "
                        >
                          New orders and updates will
                          appear here.
                        </p>
                      </div>
                    ) : (
                      notifications.map(
                        (notification) => (
                          <button
                            key={
                              notification._id
                            }
                            type="button"
                            onClick={() =>
                              void handleMarkAsRead(
                                notification,
                              )
                            }
                            className={`
                              group
                              relative
                              flex
                              w-full
                              gap-3
                              border-b
                              border-[#EEE8E0]
                              px-4
                              py-4
                              text-left
                              transition
                              hover:bg-[#F7F1E9]
                              ${
                                notification.isRead
                                  ? ""
                                  : "bg-[#F4ECE2]/70"
                              }
                            `}
                          >
                            {/* Unread Dot */}

                            <div
                              className="
                                mt-1.5
                                shrink-0
                              "
                            >
                              <span
                                className={`
                                  block
                                  h-2
                                  w-2
                                  rounded-full
                                  ${
                                    notification.isRead
                                      ? "bg-[#D5CCC1]"
                                      : "bg-[#A4773E]"
                                  }
                                `}
                              />
                            </div>

                            {/* Content */}

                            <div
                              className="
                                min-w-0
                                flex-1
                                pr-6
                              "
                            >
                              <div
                                className="
                                  flex
                                  items-start
                                  justify-between
                                  gap-3
                                "
                              >
                                <p
                                  className="
                                    truncate
                                    text-[11px]
                                    font-semibold
                                    text-[#403932]
                                  "
                                >
                                  {
                                    notification.title
                                  }
                                </p>

                                <span
                                  className="
                                    shrink-0
                                    text-[8px]
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
                                  mt-1
                                  line-clamp-2
                                  text-[9px]
                                  leading-relaxed
                                  text-[#81776C]
                                "
                              >
                                {
                                  notification.message
                                }
                              </p>
                            </div>

                            {/* Delete */}

                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(
                                event,
                              ) =>
                                void handleDeleteNotification(
                                  event,
                                  notification,
                                )
                              }
                              className="
                                absolute
                                right-3
                                bottom-3
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-lg
                                text-[#B1A79C]
                                opacity-0
                                transition
                                hover:bg-[#F1DFD8]
                                hover:text-[#A85B4B]
                                group-hover:opacity-100
                              "
                              aria-label="Delete notification"
                            >
                              <Trash2
                                size={13}
                              />
                            </span>
                          </button>
                        ),
                      )
                    )}
                  </div>

                  {/* =============================================
                      VIEW ALL NOTIFICATIONS
                  ============================================== */}

                  <div
                    className="
                      border-t
                      border-[#E7E0D7]
                      p-3
                    "
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setNotificationOpen(false);

                        navigate(
                          "/admin/notifications",
                        );
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-[#E2DAD0]
                        bg-white
                        px-4
                        py-3
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-[#76562F]
                        transition
                        hover:bg-[#F7F1E9]
                      "
                    >
                      View all notifications

                      <ChevronRight
                        size={14}
                        strokeWidth={1.6}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Store Link */}

            <NavLink
              to="/"
              className="
                hidden
                items-center
                gap-2
                rounded-lg
                border
                border-[#DCCFC0]
                bg-white
                px-4
                py-2.5
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-[#76562F]
                transition
                hover:bg-[#F7F1E9]
                sm:flex
              "
            >
              <BarChart3
                size={13}
                strokeWidth={1.4}
              />

              View Store
            </NavLink>
          </div>
        </header>

        {/* Page */}

        <main className="p-5 sm:p-7 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;