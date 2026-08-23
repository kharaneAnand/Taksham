import {
  ArrowRight,
  Loader2,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { getProducts } from "../../api/product.api";
import { getAllOrders } from "../../api/order.api";
import { getAllCustomers } from "../../api/adminCustomer.api";

import type { Order } from "../../types/order";

/* =====================================================
   TYPES
===================================================== */

interface DashboardData {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  revenue: number;
  recentOrders: Order[];
}

/* =====================================================
   INITIAL DATA
===================================================== */

const initialDashboardData: DashboardData = {
  totalProducts: 0,
  totalOrders: 0,
  totalCustomers: 0,
  revenue: 0,
  recentOrders: [],
};

/* =====================================================
   HELPERS
===================================================== */

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

const getCustomerName = (order: Order): string => {
  const firstName =
    order.shippingAddress?.firstName || "";

  const lastName =
    order.shippingAddress?.lastName || "";

  const fullName =
    `${firstName} ${lastName}`.trim();

  return fullName || "Customer";
};

/* =====================================================
   DASHBOARD
===================================================== */

const Dashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] =
    useState<DashboardData>(initialDashboardData);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =====================================================
     LOAD DASHBOARD DATA
  ===================================================== */

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [
        productsResponse,
        ordersResponse,
        customersResponse,
      ] = await Promise.all([
        getProducts({
          page: 1,
          limit: 1,
        }),

        getAllOrders({
          page: 1,
          limit: 100,
          sort: "newest",
        }),

        getAllCustomers({
          page: 1,
          limit: 1,
        }),
      ]);

      const orders =
        ordersResponse?.orders || [];

      const totalProducts =
        productsResponse?.pagination
          ?.totalProducts ??
        productsResponse?.products?.length ??
        0;

      const totalOrders =
        ordersResponse?.pagination
          ?.totalOrders ??
        orders.length;

      const totalCustomers =
        customersResponse?.pagination
          ?.totalCustomers ??
        customersResponse?.customers?.length ??
        0;

      const revenue = orders
        .filter(
          (order) =>
            order.orderStatus !== "cancelled",
        )
        .reduce(
          (total, order) =>
            total +
            Number(order.total || 0),
          0,
        );

      const recentOrders = [...orders]
        .sort(
          (first, second) =>
            new Date(
              second.createdAt,
            ).getTime() -
            new Date(
              first.createdAt,
            ).getTime(),
        )
        .slice(0, 5);

      setDashboardData({
        totalProducts,
        totalOrders,
        totalCustomers,
        revenue,
        recentOrders,
      });
    } catch (dashboardError) {
      console.error(
        "Failed to load dashboard:",
        dashboardError,
      );

      const message =
        dashboardError instanceof Error
          ? dashboardError.message
          : "Failed to load dashboard data";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  /* =====================================================
     STATISTICS
  ===================================================== */

  const stats = useMemo(() => {
    return [
      {
        label: "Total Products",
        value:
          dashboardData.totalProducts.toLocaleString(
            "en-IN",
          ),
        icon: Package,
        description: "Products in catalogue",
      },
      {
        label: "Total Orders",
        value:
          dashboardData.totalOrders.toLocaleString(
            "en-IN",
          ),
        icon: ShoppingBag,
        description: "Orders received",
      },
      {
        label: "Customers",
        value:
          dashboardData.totalCustomers.toLocaleString(
            "en-IN",
          ),
        icon: Users,
        description: "Registered customers",
      },
      {
        label: "Revenue",
        value: formatCurrency(
          dashboardData.revenue,
        ),
        icon: TrendingUp,
        description: "Total sales",
      },
    ];
  }, [dashboardData]);

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <Loader2
            size={30}
            className="mx-auto animate-spin text-[#8F6B3F]"
          />

          <p className="mt-3 text-[10px] text-[#81776C]">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-[18px] border border-[#E2DAD0] bg-white p-6 text-center">
          <p className="text-[11px] text-[#81776C]">
            {error}
          </p>

          <button
            type="button"
            onClick={() => {
              void loadDashboard();
            }}
            className="mt-5 rounded-xl bg-[#8F6B3F] px-5 py-3 text-[8px] font-semibold uppercase tracking-[0.14em] text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-375">
      {/* WELCOME */}

      <section className="rounded-[22px] border border-[#E1D8CD] bg-[#F4EEE6] px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
        <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[#A4773E]">
          Overview
        </p>

        <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-serif text-[34px] leading-none tracking-[-0.045em] text-[#302B25] sm:text-[42px]">
              Welcome to Taksham.
            </h2>

            <p className="mt-3 max-w-xl text-[10px] leading-5 text-[#81776C] sm:text-[11px]">
              Manage your products, orders and customers
              from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/products")
            }
            className="group flex w-fit items-center gap-2 rounded-xl bg-[#8F6B3F] px-5 py-3 text-[8px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#795832]"
          >
            Manage Products

            <ArrowRight
              size={12}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      </section>

      {/* STATISTICS */}

      <section className="mt-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(
            ({
              label,
              value,
              icon: Icon,
              description,
            }) => (
              <div
                key={label}
                className="rounded-[18px] border border-[#E2DAD0] bg-white p-5 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0E6D9]">
                    <Icon
                      size={16}
                      strokeWidth={1.4}
                      className="text-[#8F6B3F]"
                    />
                  </div>

                  <span className="text-[7px] font-semibold uppercase tracking-[0.15em] text-[#B0A69B]">
                    Overview
                  </span>
                </div>

                <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#81776C]">
                  {label}
                </p>

                <p className="mt-1 font-serif text-[30px] leading-none tracking-[-0.04em] text-[#302B25]">
                  {value}
                </p>

                <p className="mt-2 text-[9px] text-[#A0988E]">
                  {description}
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      {/* QUICK ACTIONS */}

      <section className="mt-6">
        <div className="mb-4">
          <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#A4773E]">
            Quick actions
          </p>

          <h2 className="mt-1.5 font-serif text-[26px] leading-none tracking-[-0.035em] text-[#302B25]">
            Manage your store
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <button
            type="button"
            onClick={() =>
              navigate("/admin/products")
            }
            className="group rounded-[18px] border border-[#E2DAD0] bg-white p-5 text-left transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <Package
                size={19}
                strokeWidth={1.3}
                className="text-[#9A7138]"
              />

              <ArrowRight
                size={14}
                strokeWidth={1.4}
                className="text-[#A0988E] transition-transform duration-300 group-hover:translate-x-1"
              />
            </div>

            <h3 className="mt-7 font-serif text-[22px] tracking-tight text-[#302B25]">
              Products
            </h3>

            <p className="mt-2 text-[10px] leading-5 text-[#81776C]">
              Add, edit and manage your furniture
              catalogue.
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/orders")
            }
            className="group rounded-[18px] border border-[#E2DAD0] bg-white p-5 text-left transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <ShoppingBag
                size={19}
                strokeWidth={1.3}
                className="text-[#9A7138]"
              />

              <ArrowRight
                size={14}
                strokeWidth={1.4}
                className="text-[#A0988E] transition-transform duration-300 group-hover:translate-x-1"
              />
            </div>

            <h3 className="mt-7 font-serif text-[22px] tracking-tight text-[#302B25]">
              Orders
            </h3>

            <p className="mt-2 text-[10px] leading-5 text-[#81776C]">
              Review and manage customer orders.
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/customers")
            }
            className="group rounded-[18px] border border-[#E2DAD0] bg-white p-5 text-left transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <Users
                size={19}
                strokeWidth={1.3}
                className="text-[#9A7138]"
              />

              <ArrowRight
                size={14}
                strokeWidth={1.4}
                className="text-[#A0988E] transition-transform duration-300 group-hover:translate-x-1"
              />
            </div>

            <h3 className="mt-7 font-serif text-[22px] tracking-tight text-[#302B25]">
              Customers
            </h3>

            <p className="mt-2 text-[10px] leading-5 text-[#81776C]">
              View and manage registered customers.
            </p>
          </button>
        </div>
      </section>

      {/* RECENT ACTIVITY */}

      <section className="mt-6">
        <div className="rounded-[18px] border border-[#E2DAD0] bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#A4773E]">
                Activity
              </p>

              <h2 className="mt-1.5 font-serif text-[25px] leading-none tracking-[-0.035em] text-[#302B25]">
                Recent activity
              </h2>
            </div>

            {dashboardData.recentOrders.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  navigate("/admin/orders")
                }
                className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#8F6B3F]"
              >
                View all
              </button>
            )}
          </div>

          {dashboardData.recentOrders.length === 0 ? (
            <div className="flex min-h-38 items-center justify-center text-center">
              <div>
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#F3EDE5]">
                  <ShoppingBag
                    size={16}
                    strokeWidth={1.3}
                    className="text-[#A4773E]"
                  />
                </div>

                <p className="mt-3 text-[10px] font-medium text-[#71685E]">
                  No recent activity yet
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {dashboardData.recentOrders.map(
                (order) => {
                  const orderDate =
                    formatDate(
                      order.createdAt,
                    );

                  return (
                    <button
                      key={order._id}
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin/orders/${order._id}`,
                        )
                      }
                      className="flex w-full items-center justify-between gap-4 rounded-xl border border-[#EEE8E0] p-4 text-left transition-all duration-200 hover:border-[#D8C4A6] hover:bg-[#FCFAF7]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[10px] font-semibold text-[#302B25]">
                          {getCustomerName(order)}
                        </p>

                        <p className="mt-1 text-[8px] text-[#A0988E]">
                          Order #{order.orderNumber}

                          {orderDate
                            ? ` · ${orderDate}`
                            : ""}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-[10px] font-semibold text-[#302B25]">
                          {formatCurrency(
                            Number(
                              order.total || 0,
                            ),
                          )}
                        </p>

                        <p className="mt-1 text-[8px] capitalize text-[#A0988E]">
                          {order.orderStatus.replace(
                            /_/g,
                            " ",
                          )}
                        </p>
                      </div>
                    </button>
                  );
                },
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;