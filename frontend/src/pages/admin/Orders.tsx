import {
  ChevronRight,
  Eye,
  Package,
  RefreshCw,
  Search,
  ShoppingBag,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  getAllOrders,
  type AdminOrdersResponse,
} from "../../api/adminOrder.api";

import type {
  Order,
  OrderStatus,
} from "../../types/order";

/*
 * ========================================
 * Orders Page
 * ========================================
 */

const Orders = () => {
  const navigate =
    useNavigate();

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [
    pagination,
    setPagination,
  ] =
    useState<
      AdminOrdersResponse["pagination"] | null
    >(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<
      "all" | OrderStatus
    >("all");

  /*
   * ========================================
   * Load Orders
   * ========================================
   */

  const loadOrders =
    async () => {
      try {
        setLoading(true);

        setError("");

        const result =
          await getAllOrders();

        setOrders(
          result.orders,
        );

        setPagination(
          result.pagination,
        );
      } catch (error) {
        console.error(
          "Failed to load admin orders:",
          error,
        );

        const message =
          error instanceof Error
            ? error.message
            : "Failed to load orders";

        setError(message);

        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadOrders();
  }, []);

  /*
   * ========================================
   * Filtered Orders
   * ========================================
   */

  const filteredOrders =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      return orders.filter(
        (order) => {
          const matchesSearch =
            !searchValue ||
            order.orderNumber
              .toLowerCase()
              .includes(searchValue) ||
            `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
              .toLowerCase()
              .includes(searchValue) ||
            order.shippingAddress.phone.includes(
              searchValue,
            );

          const matchesStatus =
            statusFilter === "all" ||
            order.orderStatus ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        },
      );
    }, [
      orders,
      search,
      statusFilter,
    ]);

  /*
   * ========================================
   * Statistics
   * ========================================
   */

  const totalRevenue =
    orders
      .filter(
        (order) =>
          order.orderStatus !==
          "cancelled",
      )
      .reduce(
        (total, order) =>
          total + order.total,
        0,
      );

  const pendingOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "pending",
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "delivered",
    ).length;

  /*
   * ========================================
   * Loading
   * ========================================
   */

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-[#29251F] border-t-transparent" />

          <p className="text-sm text-[#777067]">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  /*
   * ========================================
   * Error
   * ========================================
   */

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-3xl border border-[#E1DAD0] bg-white px-8 py-10 text-center">
          <Package
            size={34}
            strokeWidth={1.3}
            className="mx-auto text-[#A4773E]"
          />

          <h2 className="mt-5 font-serif text-2xl text-[#29251F]">
            Unable to load orders
          </h2>

          <p className="mt-2 text-sm text-[#777067]">
            {error}
          </p>

          <button
            type="button"
            onClick={loadOrders}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#29251F] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white"
          >
            <RefreshCw size={15} />

            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* ====================================
          HEADER
      ==================================== */}

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A4773E]">
            Store Management
          </p>

          <h1 className="mt-2 font-serif text-4xl tracking-[-0.03em] text-[#29251F]">
            Orders
          </h1>

          <p className="mt-2 text-sm text-[#777067]">
            Manage and track all customer
            orders.
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#DDD4C8] bg-white px-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#5F584F] transition hover:border-[#B7894A] hover:text-[#29251F]"
        >
          <RefreshCw size={14} />

          Refresh
        </button>
      </div>

      {/* ====================================
          STATS
      ==================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Orders"
          value={
            (
              pagination?.totalOrders ??
              orders.length
            ).toString()
          }
        />

        <StatCard
          label="Pending"
          value={pendingOrders.toString()}
        />

        <StatCard
          label="Delivered"
          value={deliveredOrders.toString()}
        />

        <StatCard
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString(
            "en-IN",
          )}`}
        />
      </div>

      {/* ====================================
          FILTERS
      ==================================== */}

      <section className="rounded-2xl border border-[#E1DAD0] bg-white p-4 shadow-[0_8px_30px_rgba(68,53,37,0.035)]">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={17}
              strokeWidth={1.5}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9A9288]"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search by order number, customer or phone..."
              className="h-12 w-full rounded-xl border border-[#E2DBD2] bg-[#FCFBF8] pl-11 pr-4 text-sm outline-none transition placeholder:text-[#AAA198] focus:border-[#B7894A]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target
                  .value as
                  | "all"
                  | OrderStatus,
              )
            }
            className="h-12 rounded-xl border border-[#E2DBD2] bg-[#FCFBF8] px-4 text-sm text-[#5F584F] outline-none focus:border-[#B7894A]"
          >
            <option value="all">
              All Statuses
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="confirmed">
              Confirmed
            </option>

            <option value="processing">
              Processing
            </option>

            <option value="shipped">
              Shipped
            </option>

            <option value="out_for_delivery">
              Out for Delivery
            </option>

            <option value="delivered">
              Delivered
            </option>

            <option value="cancelled">
              Cancelled
            </option>
          </select>
        </div>
      </section>

      {/* ====================================
          ORDERS TABLE
      ==================================== */}

      <section className="overflow-hidden rounded-2xl border border-[#E1DAD0] bg-white shadow-[0_8px_30px_rgba(68,53,37,0.035)]">
        <div className="border-b border-[#ECE6DE] px-5 py-5 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl text-[#29251F]">
                All Orders
              </h2>

              <p className="mt-1 text-xs text-[#8A8176]">
                {filteredOrders.length}{" "}
                {filteredOrders.length ===
                1
                  ? "order"
                  : "orders"}{" "}
                found
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F4EEE5]">
              <ShoppingBag
                size={17}
                strokeWidth={1.4}
                className="text-[#806A4D]"
              />
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Package
              size={32}
              strokeWidth={1.2}
              className="mx-auto text-[#AAA198]"
            />

            <h3 className="mt-4 text-base font-semibold text-[#29251F]">
              No orders found
            </h3>

            <p className="mt-2 text-sm text-[#8A8176]">
              Try changing your search or
              filter.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-250">
                <thead className="bg-[#FAF8F4]">
                  <tr className="border-b border-[#EAE4DC]">
                    <TableHead>
                      Order
                    </TableHead>

                    <TableHead>
                      Customer
                    </TableHead>

                    <TableHead>
                      Items
                    </TableHead>

                    <TableHead>
                      Payment
                    </TableHead>

                    <TableHead>
                      Status
                    </TableHead>

                    <TableHead>
                      Total
                    </TableHead>

                    <TableHead>
                      Date
                    </TableHead>

                    <TableHead>
                      Action
                    </TableHead>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map(
                    (order) => (
                      <tr
                        key={order._id}
                        className="border-b border-[#F0EBE5] transition hover:bg-[#FCFAF7]"
                      >
                        <TableCell>
                          <p className="font-semibold text-[#29251F]">
                            #
                            {
                              order.orderNumber
                            }
                          </p>
                        </TableCell>

                        <TableCell>
                          <p className="font-medium text-[#29251F]">
                            {
                              order
                                .shippingAddress
                                .firstName
                            }{" "}
                            {
                              order
                                .shippingAddress
                                .lastName
                            }
                          </p>

                          <p className="mt-1 text-[11px] text-[#8A8176]">
                            {
                              order
                                .shippingAddress
                                .phone
                            }
                          </p>
                        </TableCell>

                        <TableCell>
                          <span className="rounded-full bg-[#F4EEE5] px-3 py-1.5 text-xs font-medium text-[#665E54]">
                            {
                              order.items
                                .length
                            }{" "}
                            {
                              order.items
                                .length ===
                              1
                                ? "item"
                                : "items"
                            }
                          </span>
                        </TableCell>

                        <TableCell>
                          <PaymentBadge
                            method={
                              order.paymentMethod
                            }
                            status={
                              order.paymentStatus
                            }
                          />
                        </TableCell>

                        <TableCell>
                          <StatusBadge
                            status={
                              order.orderStatus
                            }
                          />
                        </TableCell>

                        <TableCell>
                          <p className="font-semibold text-[#29251F]">
                            ₹
                            {order.total.toLocaleString(
                              "en-IN",
                            )}
                          </p>
                        </TableCell>

                        <TableCell>
                          <p className="text-sm text-[#756D63]">
                            {formatDate(
                              order.createdAt,
                            )}
                          </p>
                        </TableCell>

                        <TableCell>
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/orders/${order._id}`,
                              )
                            }
                            className="group inline-flex h-9 items-center gap-2 rounded-lg border border-[#DED6CB] px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#655D53] transition hover:border-[#B7894A] hover:text-[#76572F]"
                          >
                            <Eye
                              size={14}
                              strokeWidth={1.5}
                            />

                            View

                            <ChevronRight
                              size={13}
                              className="transition-transform group-hover:translate-x-0.5"
                            />
                          </button>
                        </TableCell>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}

            <div className="divide-y divide-[#ECE6DE] lg:hidden">
              {filteredOrders.map(
                (order) => (
                  <div
                    key={order._id}
                    className="p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[#29251F]">
                          #
                          {
                            order.orderNumber
                          }
                        </p>

                        <p className="mt-1 text-xs text-[#8A8176]">
                          {
                            order
                              .shippingAddress
                              .firstName
                          }{" "}
                          {
                            order
                              .shippingAddress
                              .lastName
                          }
                        </p>
                      </div>

                      <StatusBadge
                        status={
                          order.orderStatus
                        }
                      />
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-[#9A9288]">
                          Total
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#29251F]">
                          ₹
                          {order.total.toLocaleString(
                            "en-IN",
                          )}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] font-semibold uppercase tracking-wider text-[#9A9288]">
                          Payment
                        </p>

                        <div className="mt-1">
                          <PaymentBadge
                            method={
                              order.paymentMethod
                            }
                            status={
                              order.paymentStatus
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-[#EEE8E0] pt-4">
                      <p className="text-xs text-[#8A8176]">
                        {formatDate(
                          order.createdAt,
                        )}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/admin/orders/${order._id}`,
                          )
                        }
                        className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#806545]"
                      >
                        View Details

                        <ChevronRight
                          size={14}
                        />
                      </button>
                    </div>
                  </div>
                ),
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

/*
 * ========================================
 * Stat Card
 * ========================================
 */

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="rounded-2xl border border-[#E1DAD0] bg-white p-5 shadow-[0_6px_24px_rgba(68,53,37,0.025)]">
      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9A9288]">
        {label}
      </p>

      <p className="mt-3 font-serif text-[28px] tracking-[-0.02em] text-[#29251F]">
        {value}
      </p>
    </div>
  );
};

/*
 * ========================================
 * Table Components
 * ========================================
 */

const TableHead = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <th className="px-5 py-4 text-left text-[9px] font-semibold uppercase tracking-[0.15em] text-[#8A8176]">
      {children}
    </th>
  );
};

const TableCell = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <td className="px-5 py-5 text-sm">
      {children}
    </td>
  );
};

/*
 * ========================================
 * Status Badge
 * ========================================
 */

const StatusBadge = ({
  status,
}: {
  status: OrderStatus;
}) => {
  const label =
    status.replace(/_/g, " ");

  const styles: Record<
    OrderStatus,
    string
  > = {
    pending:
      "bg-[#F7F1E4] text-[#9A6B20]",

    confirmed:
      "bg-[#EDF2E8] text-[#587142]",

    processing:
      "bg-[#EAF1F5] text-[#496E83]",

    shipped:
      "bg-[#EEEAF5] text-[#695A8A]",

    out_for_delivery:
      "bg-[#F4ECE3] text-[#966638]",

    delivered:
      "bg-[#E9F2EC] text-[#3F7854]",

    cancelled:
      "bg-[#F6E9E7] text-[#A4574D]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-[9px] font-semibold capitalize tracking-wide ${styles[status]}`}
    >
      {label}
    </span>
  );
};

/*
 * ========================================
 * Payment Badge
 * ========================================
 */

const PaymentBadge = ({
  method,
  status,
}: {
  method: Order["paymentMethod"];
  status: Order["paymentStatus"];
}) => {
  return (
    <div>
      <p className="text-xs font-medium capitalize text-[#5F584F]">
        {method === "cod"
          ? "Cash on Delivery"
          : "Online"}
      </p>

      <p
        className={`mt-1 text-[9px] font-semibold capitalize ${
          status === "paid"
            ? "text-[#4C7957]"
            : status === "failed"
              ? "text-[#A4574D]"
              : status === "refunded"
                ? "text-[#806A4D]"
                : "text-[#9A7A4C]"
        }`}
      >
        {status}
      </p>
    </div>
  );
};

/*
 * ========================================
 * Date Helper
 * ========================================
 */

const formatDate = (
  date: string,
) => {
  return new Date(
    date,
  ).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
};

export default Orders;