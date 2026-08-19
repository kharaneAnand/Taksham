import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Tag,
  Users,
  X,
} from "lucide-react";

import {
  NavLink,
  useLocation,
} from "react-router-dom";

import { useState } from "react";
import { Outlet } from "react-router-dom";

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

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [collapsed, setCollapsed] =
    useState(false);

  const location = useLocation();

  const isDashboard =
    location.pathname === "/admin";

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

          {/* Mobile close */}

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

          {/* Divider */}

          <div className="my-6 h-px bg-[#E7E0D7]" />

          {/* Settings */}

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
        {/* Topbar */}

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
          <div className="flex items-center gap-3">
            {/* Mobile menu */}

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

          {/* Store link */}

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