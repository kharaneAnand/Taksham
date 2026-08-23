import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Copy,
  Mail,
  Package,
  Phone,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  UserRound,
  XCircle,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  getCustomerById,
} from "../../api/adminCustomer.api";

import {
  getOrdersByUserId,
} from "../../api/order.api";

import type {
  Customer,
} from "../../types/customer";

import type {
  Order,
} from "../../types/order";

/*
 * ========================================
 * Helpers
 * ========================================
 */

const getInitials = (
  firstName: string,
  lastName: string,
) => {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`
    .toUpperCase();
};

const formatDate = (
  date: string,
) => {
  return new Date(
    date,
  ).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  );
};

const formatDateTime = (
  date: string,
) => {
  return new Date(
    date,
  ).toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
};

const formatCurrency = (
  amount: number,
) => {
  return new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    },
  ).format(
    amount,
  );
};

const formatStatus = (
  status: string,
) => {
  return status
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
};

const getStatusClassName = (
  status: string,
) => {
  switch (status) {
    case "delivered":
      return "bg-[#EAF2E8] text-[#587142]";

    case "cancelled":
    case "failed":
      return "bg-[#F8ECEA] text-[#A4574D]";

    case "pending":
      return "bg-[#F9F0D9] text-[#9A742D]";

    case "paid":
      return "bg-[#EAF2E8] text-[#587142]";

    default:
      return "bg-[#EEF1F5] text-[#5F6B7A]";
  }
};

/*
 * ========================================
 * Customer Details
 * ========================================
 */

const CustomerDetails = () => {
  const navigate =
    useNavigate();

  const { id } =
    useParams<{
      id: string;
    }>();

  const [
    customer,
    setCustomer,
  ] = useState<Customer | null>(
    null,
  );

  const [
    orders,
    setOrders,
  ] = useState<Order[]>(
    [],
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  /*
   * ========================================
   * Load Customer + Orders
   * ========================================
   */

  const loadCustomer =
    useCallback(
      async (
        showRefreshState = false,
      ) => {
        if (!id) {
          setError(
            "Customer ID is missing.",
          );

          setLoading(false);

          return;
        }

        try {
          if (showRefreshState) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          setError("");

          const [
            customerResult,
            ordersResult,
          ] = await Promise.all([
            getCustomerById(
              id,
            ),
            getOrdersByUserId(
              id,
            ),
          ]);

          setCustomer(
            customerResult,
          );

          setOrders(
            ordersResult,
          );
        } catch (error) {
          console.error(
            "Failed to load customer:",
            error,
          );

          const message =
            error instanceof Error
              ? error.message
              : "Failed to load customer";

          setError(message);

          if (showRefreshState) {
            toast.error(message);
          }
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [id],
    );

  useEffect(() => {
    loadCustomer();
  }, [loadCustomer]);

  /*
   * ========================================
   * Copy Customer ID
   * ========================================
   */

  const handleCopyId =
    async () => {
      if (!customer) {
        return;
      }

      try {
        await navigator.clipboard.writeText(
          customer._id,
        );

        toast.success(
          "Customer ID copied",
        );
      } catch {
        toast.error(
          "Failed to copy customer ID",
        );
      }
    };

  /*
   * ========================================
   * Order Statistics
   * ========================================
   */

  const totalSpent =
    orders
      .filter(
        (order) =>
          order.orderStatus !==
          "cancelled",
      )
      .reduce(
        (
          total,
          order,
        ) =>
          total + order.total,
        0,
      );

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
          <div className="mx-auto mb-5 h-11 w-11 animate-spin rounded-full border-2 border-[#29251F] border-t-transparent" />

          <p className="text-sm text-[#777067]">
            Loading customer details...
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

  if (error || !customer) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-[#E1DAD0] bg-white px-8 py-10 text-center shadow-[0_15px_40px_rgba(68,53,37,0.06)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F8ECEA]">
            <UserRound
              size={28}
              strokeWidth={1.4}
              className="text-[#A4574D]"
            />
          </div>

          <h2 className="mt-5 font-serif text-2xl text-[#29251F]">
            Customer Not Found
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#777067]">
            {error ||
              "We couldn't find this customer."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/customers",
              )
            }
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#29251F] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#403B33]"
          >
            <ArrowLeft size={15} />

            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  const fullName =
    `${customer.firstName} ${customer.lastName}`;

  const avatarUrl =
    customer.avatar?.url;

  return (
    <div className="space-y-7">
      {/* ====================================
          HEADER
      ==================================== */}

      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/customers",
              )
            }
            className="group mb-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A8176] transition hover:text-[#29251F]"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-0.5"
            />

            Back to Customers
          </button>

          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A4773E]">
            Customer Management
          </p>

          <h1 className="mt-2 font-serif text-4xl tracking-[-0.03em] text-[#29251F]">
            Customer Details
          </h1>

          <p className="mt-2 text-sm text-[#777067]">
            View customer account and
            purchase history.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            loadCustomer(true)
          }
          disabled={refreshing}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#DDD4C8] bg-white px-4 text-xs font-semibold text-[#5F584F] transition hover:border-[#B7894A] hover:text-[#29251F] disabled:cursor-not-allowed disabled:opacity-60"
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
      </div>

      {/* ====================================
          MAIN GRID
      ==================================== */}

      <div className="grid gap-7 xl:grid-cols-[1.45fr_0.85fr]">
        {/* ==================================
            LEFT COLUMN
        ================================== */}

        <div className="space-y-6">
          {/* CUSTOMER PROFILE */}

          <section className="overflow-hidden rounded-2xl border border-[#E1DAD0] bg-white shadow-[0_8px_30px_rgba(68,53,37,0.035)]">
            <div className="border-b border-[#ECE6DE] bg-linear-to-r from-[#F7F2EB] to-[#FCFAF7] px-6 py-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A4773E]">
                Customer Profile
              </p>

              <h2 className="mt-1 font-serif text-2xl text-[#29251F]">
                Personal Information
              </h2>
            </div>

            <div className="p-5 sm:p-7">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={fullName}
                      className="h-24 w-24 rounded-2xl object-cover shadow-[0_10px_25px_rgba(68,53,37,0.12)]"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[#29251F] font-serif text-3xl text-[#E8D4B5] shadow-[0_10px_25px_rgba(68,53,37,0.12)]">
                      {getInitials(
                        customer.firstName,
                        customer.lastName,
                      )}
                    </div>
                  )}

                  <div
                    className={`absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white ${
                      customer.isVerified
                        ? "bg-[#567B5A]"
                        : "bg-[#B56A52]"
                    }`}
                  >
                    {customer.isVerified ? (
                      <CheckCircle2
                        size={14}
                        className="text-white"
                      />
                    ) : (
                      <XCircle
                        size={14}
                        className="text-white"
                      />
                    )}
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-serif text-3xl text-[#29251F]">
                      {fullName}
                    </h3>

                    <VerificationBadge
                      verified={
                        customer.isVerified
                      }
                    />
                  </div>

                  <p className="mt-2 text-sm text-[#777067]">
                    Registered customer account
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[#E5DDD2] bg-[#FAF8F4] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#756D63]">
                      Customer
                    </span>

                    <span className="rounded-full border border-[#E5DDD2] bg-[#FAF8F4] px-3 py-1.5 text-[10px] text-[#756D63]">
                      Joined{" "}
                      {formatDate(
                        customer.createdAt,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <InfoCard
                  icon={
                    <Mail size={18} />
                  }
                  label="Email Address"
                  value={customer.email}
                />

                <InfoCard
                  icon={
                    <Phone size={18} />
                  }
                  label="Phone Number"
                  value={
                    customer.phone ||
                    "Not provided"
                  }
                />
              </div>
            </div>
          </section>

          {/* ORDER HISTORY */}

          <section className="overflow-hidden rounded-2xl border border-[#E1DAD0] bg-white shadow-[0_8px_30px_rgba(68,53,37,0.035)]">
            <div className="flex flex-col gap-4 border-b border-[#ECE6DE] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A4773E]">
                  Purchase History
                </p>

                <h2 className="mt-1 font-serif text-2xl text-[#29251F]">
                  Customer Orders
                </h2>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#F3EEE7] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#6E6254]">
                <ShoppingBag size={13} />
                {orders.length} Orders
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F5F1EA] text-[#A4773E]">
                  <Package size={23} />
                </div>

                <h3 className="mt-4 font-serif text-xl text-[#29251F]">
                  No Orders Yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-[#777067]">
                  This customer has not placed
                  any orders yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#ECE6DE]">
                {orders.map(
                  (order) => (
                    <div
                      key={order._id}
                      className="p-5 transition hover:bg-[#FCFBF9] sm:px-6"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-mono text-sm font-semibold text-[#29251F]">
                              {order.orderNumber}
                            </p>

                            <OrderStatusBadge
                              status={
                                order.orderStatus
                              }
                            />
                          </div>

                          <p className="mt-2 text-xs text-[#8A8176]">
                            {formatDateTime(
                              order.createdAt,
                            )}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-5 sm:block sm:text-right">
                          <div>
                            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8A8176]">
                              Total
                            </p>

                            <p className="mt-1 text-base font-semibold text-[#29251F]">
                              {formatCurrency(
                                order.total,
                              )}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide ${getStatusClassName(
                              order.paymentStatus,
                            )}`}
                          >
                            {formatStatus(
                              order.paymentStatus,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </section>

          {/* ACCOUNT INFORMATION */}

          <section className="overflow-hidden rounded-2xl border border-[#E1DAD0] bg-white shadow-[0_8px_30px_rgba(68,53,37,0.035)]">
            <div className="border-b border-[#ECE6DE] px-5 py-5 sm:px-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A4773E]">
                Account
              </p>

              <h2 className="mt-1 font-serif text-2xl text-[#29251F]">
                Account Information
              </h2>
            </div>

            <div className="divide-y divide-[#ECE6DE]">
              <DetailRow
                icon={
                  <UserRound size={17} />
                }
                label="Customer ID"
                value={customer._id}
                action={
                  <button
                    type="button"
                    onClick={
                      handleCopyId
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E1DAD0] text-[#777067] transition hover:border-[#B7894A] hover:text-[#29251F]"
                    title="Copy customer ID"
                  >
                    <Copy size={14} />
                  </button>
                }
                mono
              />

              <DetailRow
                icon={
                  <ShieldCheck
                    size={17}
                  />
                }
                label="Email Verification"
                value={
                  customer.isVerified
                    ? "Verified"
                    : "Not verified"
                }
                valueClassName={
                  customer.isVerified
                    ? "text-[#587142]"
                    : "text-[#A4574D]"
                }
              />

              <DetailRow
                icon={
                  <CalendarDays
                    size={17}
                  />
                }
                label="Account Created"
                value={formatDateTime(
                  customer.createdAt,
                )}
              />

              <DetailRow
                icon={
                  <RefreshCw size={17} />
                }
                label="Last Updated"
                value={formatDateTime(
                  customer.updatedAt,
                )}
              />
            </div>
          </section>
        </div>

        {/* ==================================
            RIGHT COLUMN
        ================================== */}

        <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
          {/* ACCOUNT STATUS */}

          <section className="overflow-hidden rounded-2xl border border-[#DCD1C2] bg-[#29251F] shadow-[0_15px_40px_rgba(41,37,31,0.12)]">
            <div className="p-6 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C7A875]">
                Account Status
              </p>

              <h2 className="mt-2 font-serif text-2xl">
                {customer.isVerified
                  ? "Verified Account"
                  : "Verification Pending"}
              </h2>

              <p className="mt-3 text-xs leading-5 text-white/60">
                {customer.isVerified
                  ? "This customer has successfully verified their email address."
                  : "This customer has not yet verified their email address."}
              </p>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.07] p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      customer.isVerified
                        ? "bg-[#567B5A]/30 text-[#BFD7B8]"
                        : "bg-[#A4574D]/30 text-[#F0B9B1]"
                    }`}
                  >
                    {customer.isVerified ? (
                      <CheckCircle2
                        size={19}
                      />
                    ) : (
                      <XCircle
                        size={19}
                      />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      {customer.isVerified
                        ? "Email Verified"
                        : "Email Not Verified"}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-white/50">
                      {customer.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CUSTOMER SUMMARY */}

          <section className="overflow-hidden rounded-2xl border border-[#E1DAD0] bg-white shadow-[0_8px_30px_rgba(68,53,37,0.035)]">
            <div className="border-b border-[#ECE6DE] px-5 py-5 sm:px-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A4773E]">
                Overview
              </p>

              <h2 className="mt-1 font-serif text-2xl text-[#29251F]">
                Customer Summary
              </h2>
            </div>

            <div className="p-5 sm:p-6">
              <div className="space-y-5">
                <SummaryItem
                  label="Full Name"
                  value={fullName}
                />

                <SummaryItem
                  label="Email"
                  value={customer.email}
                />

                <SummaryItem
                  label="Phone"
                  value={
                    customer.phone ||
                    "Not provided"
                  }
                />

                <SummaryItem
                  label="Member Since"
                  value={formatDate(
                    customer.createdAt,
                  )}
                />
              </div>
            </div>
          </section>

          {/* ORDER SUMMARY */}

          <section className="overflow-hidden rounded-2xl border border-[#E1DAD0] bg-white shadow-[0_8px_30px_rgba(68,53,37,0.035)]">
            <div className="border-b border-[#ECE6DE] px-5 py-5 sm:px-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A4773E]">
                Orders
              </p>

              <h2 className="mt-1 font-serif text-2xl text-[#29251F]">
                Purchase Summary
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-px bg-[#ECE6DE]">
              <StatCard
                label="Total Orders"
                value={String(
                  orders.length,
                )}
              />

              <StatCard
                label="Delivered"
                value={String(
                  deliveredOrders,
                )}
              />

              <div className="col-span-2">
                <StatCard
                  label="Total Spent"
                  value={formatCurrency(
                    totalSpent,
                  )}
                  large
                />
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

/*
 * ========================================
 * Verification Badge
 * ========================================
 */

const VerificationBadge = ({
  verified,
}: {
  verified: boolean;
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-semibold uppercase tracking-wide ${
        verified
          ? "bg-[#EAF2E8] text-[#587142]"
          : "bg-[#F8ECEA] text-[#A4574D]"
      }`}
    >
      {verified ? (
        <CheckCircle2 size={12} />
      ) : (
        <XCircle size={12} />
      )}

      {verified
        ? "Verified"
        : "Unverified"}
    </span>
  );
};

/*
 * ========================================
 * Order Status Badge
 * ========================================
 */

const OrderStatusBadge = ({
  status,
}: {
  status: string;
}) => {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wide ${getStatusClassName(
        status,
      )}`}
    >
      {formatStatus(status)}
    </span>
  );
};

/*
 * ========================================
 * Info Card
 * ========================================
 */

const InfoCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <div className="rounded-xl border border-[#E7E0D7] bg-[#FCFBF9] p-4">
      <div className="flex items-center gap-2 text-[#A4773E]">
        {icon}

        <p className="text-[9px] font-semibold uppercase tracking-[0.18em]">
          {label}
        </p>
      </div>

      <p className="mt-3 break-all text-sm font-medium text-[#29251F]">
        {value}
      </p>
    </div>
  );
};

/*
 * ========================================
 * Detail Row
 * ========================================
 */

const DetailRow = ({
  icon,
  label,
  value,
  action,
  mono = false,
  valueClassName = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  action?: React.ReactNode;
  mono?: boolean;
  valueClassName?: string;
}) => {
  return (
    <div className="flex items-center gap-4 px-5 py-5 sm:px-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3EEE7] text-[#806A4D]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8A8176]">
          {label}
        </p>

        <p
          className={`mt-1 truncate text-sm font-medium text-[#29251F] ${
            mono
              ? "font-mono text-xs"
              : ""
          } ${valueClassName}`}
          title={value}
        >
          {value}
        </p>
      </div>

      {action}
    </div>
  );
};

/*
 * ========================================
 * Summary Item
 * ========================================
 */

const SummaryItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-start justify-between gap-5">
      <p className="text-xs text-[#8A8176]">
        {label}
      </p>

      <p className="max-w-[65%] wrap-break-words text-right text-xs font-semibold text-[#29251F]">
        {value}
      </p>
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
  large = false,
}: {
  label: string;
  value: string;
  large?: boolean;
}) => {
  return (
    <div className="bg-white px-5 py-5">
      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8A8176]">
        {label}
      </p>

      <p
        className={`mt-2 font-serif text-[#29251F] ${
          large
            ? "text-2xl"
            : "text-xl"
        }`}
      >
        {value}
      </p>
    </div>
  );
};

export default CustomerDetails;