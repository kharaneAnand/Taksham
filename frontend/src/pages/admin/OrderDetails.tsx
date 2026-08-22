import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  Clock3,
  MapPin,
  Package,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Truck,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  getAdminOrderById,
  updateOrderStatus,
} from "../../api/adminOrder.api";

import type {
  Order,
  OrderStatus,
} from "../../types/order";

/*
 * ========================================
 * Order Status Flow
 * ========================================
 */

const ORDER_STATUS_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

/*
 * ========================================
 * Get Next Valid Status
 * ========================================
 */

const getNextOrderStatus = (
  currentStatus: OrderStatus,
): OrderStatus | null => {
  const currentIndex =
    ORDER_STATUS_FLOW.indexOf(
      currentStatus,
    );

  if (
    currentIndex === -1 ||
    currentIndex ===
      ORDER_STATUS_FLOW.length - 1
  ) {
    return null;
  }

  return (
    ORDER_STATUS_FLOW[
      currentIndex + 1
    ] ?? null
  );
};

/*
 * ========================================
 * Format Status
 * ========================================
 */

const formatOrderStatus = (
  status: OrderStatus,
) => {
  return status
    .replace(
      /_/g,
      " ",
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
};

/*
 * ========================================
 * Status Icon
 * ========================================
 */

const getStatusIcon = (
  status: OrderStatus,
) => {
  switch (status) {
    case "pending":
      return (
        <Clock3
          size={18}
          strokeWidth={1.7}
        />
      );

    case "confirmed":
      return (
        <CircleCheck
          size={18}
          strokeWidth={1.7}
        />
      );

    case "processing":
      return (
        <Package
          size={18}
          strokeWidth={1.7}
        />
      );

    case "shipped":
      return (
        <Truck
          size={18}
          strokeWidth={1.7}
        />
      );

    case "out_for_delivery":
      return (
        <Truck
          size={18}
          strokeWidth={1.7}
        />
      );

    case "delivered":
      return (
        <PackageCheck
          size={18}
          strokeWidth={1.7}
        />
      );

    case "cancelled":
      return (
        <Clock3
          size={18}
          strokeWidth={1.7}
        />
      );

    default:
      return (
        <Package
          size={18}
          strokeWidth={1.7}
        />
      );
  }
};

/*
 * ========================================
 * Component
 * ========================================
 */

const OrderDetails = () => {
  const navigate =
    useNavigate();

  const { id } =
    useParams<{
      id: string;
    }>();

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
   * ========================================
   * Load Order
   * ========================================
   */

  const loadOrder =
    async () => {
      if (!id) {
        setError(
          "Order ID is missing.",
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);

        setError("");

        const result =
          await getAdminOrderById(
            id,
          );

        setOrder(
          result,
        );
      } catch (error) {
        console.error(
          "Failed to load admin order:",
          error,
        );

        const message =
          error instanceof Error
            ? error.message
            : "Failed to load order";

        setError(
          message,
        );

        toast.error(
          message,
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadOrder();
  }, [id]);

  /*
   * ========================================
   * Update Status
   * ========================================
   */

  const handleStatusUpdate =
    async (
      orderStatus: OrderStatus,
    ) => {
      if (
        !order ||
        updating
      ) {
        return;
      }

      if (
        orderStatus ===
        order.orderStatus
      ) {
        return;
      }

      const nextStatus =
        getNextOrderStatus(
          order.orderStatus,
        );

      /*
       * Frontend safety check.
       * Backend remains final authority.
       */

      if (
        !nextStatus ||
        orderStatus !== nextStatus
      ) {
        toast.error(
          "This order can only move to the next valid status.",
        );

        return;
      }

      try {
        setUpdating(
          true,
        );

        const updatedOrder =
          await updateOrderStatus(
            order._id,
            orderStatus,
          );

        setOrder(
          updatedOrder,
        );

        toast.success(
          `Order moved to ${formatOrderStatus(
            orderStatus,
          )}`,
        );
      } catch (error) {
        console.error(
          "Failed to update order status:",
          error,
        );

        const message =
          error instanceof Error
            ? error.message
            : "Failed to update order status";

        toast.error(
          message,
        );
      } finally {
        setUpdating(
          false,
        );
      }
    };

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
            Loading order details...
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

  if (error || !order) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="max-w-md rounded-3xl border border-[#E1DAD0] bg-white px-8 py-10 text-center shadow-[0_18px_50px_rgba(68,53,37,0.08)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F4EEE5]">
            <Package
              size={28}
              strokeWidth={1.3}
              className="text-[#A4773E]"
            />
          </div>

          <h2 className="mt-5 font-serif text-2xl text-[#29251F]">
            Order Not Found
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#777067]">
            {error ||
              "We couldn't find this order."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/orders",
              )
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#29251F] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:-translate-y-0.5 hover:bg-[#3A352E]"
          >
            <ArrowLeft size={15} />

            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  /*
   * ========================================
   * Derived Values
   * ========================================
   */

  const formattedDate =
    new Date(
      order.createdAt,
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      },
    );

  const isConfirmed =
    order.orderStatus ===
      "confirmed" ||
    order.orderStatus ===
      "processing" ||
    order.orderStatus ===
      "shipped" ||
    order.orderStatus ===
      "out_for_delivery" ||
    order.orderStatus ===
      "delivered";

  const isShipped =
    order.orderStatus ===
      "shipped" ||
    order.orderStatus ===
      "out_for_delivery" ||
    order.orderStatus ===
      "delivered";

  const isDelivered =
    order.orderStatus ===
    "delivered";

  const shippingText =
    order.shippingCost === 0
      ? "FREE"
      : `₹${order.shippingCost.toLocaleString(
          "en-IN",
        )}`;

  const nextOrderStatus =
    getNextOrderStatus(
      order.orderStatus,
    );

  const currentStatusIndex =
    ORDER_STATUS_FLOW.indexOf(
      order.orderStatus,
    );

  const canUpdateStatus =
    order.orderStatus !==
      "delivered" &&
    order.orderStatus !==
      "cancelled" &&
    nextOrderStatus !== null;

  return (
    <div className="space-y-7">
      {/* ====================================
          HEADER
      ==================================== */}

      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/orders",
              )
            }
            className="group mb-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A8176] transition hover:text-[#29251F]"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-0.5"
            />

            Back to Orders
          </button>

          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A4773E]">
            Order Management
          </p>

          <h1 className="mt-2 font-serif text-4xl tracking-[-0.03em] text-[#29251F]">
            #{order.orderNumber}
          </h1>

          <p className="mt-2 text-sm text-[#777067]">
            Placed on {formattedDate}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge
            status={
              order.orderStatus
            }
          />

          <button
            type="button"
            onClick={loadOrder}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#DDD4C8] bg-white text-[#756D63] transition hover:-translate-y-0.5 hover:border-[#B7894A] hover:text-[#29251F]"
            title="Refresh order"
          >
            <RefreshCw
              size={16}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />
          </button>
        </div>
      </div>

      <div className="grid gap-7 xl:grid-cols-[1.55fr_0.85fr]">
        {/* ==================================
            LEFT COLUMN
        ================================== */}

        <div className="space-y-6">
          {/* ORDER ITEMS */}

          <section className="overflow-hidden rounded-2xl border border-[#E1DAD0] bg-white shadow-[0_8px_30px_rgba(68,53,37,0.035)]">
            <SectionHeader
              eyebrow="Customer Order"
              title="Order Items"
              right={
                <span className="rounded-full bg-[#F4EEE5] px-3 py-1.5 text-[10px] font-semibold text-[#756D63]">
                  {order.items.length}{" "}
                  {order.items.length ===
                  1
                    ? "Item"
                    : "Items"}
                </span>
              }
            />

            <div className="divide-y divide-[#ECE6DE]">
              {order.items.map(
                (item) => (
                  <div
                    key={`${item.productId}-${item.variantId ?? "default"}`}
                    className="flex gap-4 p-5 sm:gap-5 sm:p-6"
                  >
                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F2EEE8] sm:h-28 sm:w-28">
                      {item.productImage ? (
                        <img
                          src={
                            item.productImage
                          }
                          alt={
                            item.productName
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package
                            size={25}
                            strokeWidth={1.2}
                            className="text-[#AAA198]"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-lg text-[#29251F] sm:text-xl">
                          {item.productName}
                        </h3>

                        {item.variant && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {item.variant.color && (
                              <span className="rounded-full border border-[#E4DDD4] px-2.5 py-1 text-[9px] text-[#756D63]">
                                {
                                  item.variant
                                    .color
                                }
                              </span>
                            )}

                            {item.variant
                              .material && (
                              <span className="rounded-full border border-[#E4DDD4] px-2.5 py-1 text-[9px] text-[#756D63]">
                                {
                                  item.variant
                                    .material
                                }
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex items-end justify-between gap-4">
                        <p className="text-[10px] uppercase tracking-wider text-[#8A8176]">
                          Quantity{" "}
                          <span className="font-semibold text-[#5F584F]">
                            {
                              item.quantity
                            }
                          </span>
                        </p>

                        <div className="text-right">
                          {item.originalPrice >
                            item.price && (
                            <p className="text-xs text-[#AAA198] line-through">
                              ₹
                              {(
                                item.originalPrice *
                                item.quantity
                              ).toLocaleString(
                                "en-IN",
                              )}
                            </p>
                          )}

                          <p className="mt-1 text-base font-semibold text-[#29251F]">
                            ₹
                            {item.subtotal.toLocaleString(
                              "en-IN",
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </section>

          {/* CUSTOMER */}

          <section className="overflow-hidden rounded-2xl border border-[#E1DAD0] bg-white shadow-[0_8px_30px_rgba(68,53,37,0.035)]">
            <SectionHeader
              eyebrow="Customer"
              title="Shipping Details"
            />

            <div className="p-5 sm:p-6">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0E9DF]">
                  <MapPin
                    size={18}
                    strokeWidth={1.4}
                    className="text-[#806A4D]"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#29251F]">
                    {
                      order.shippingAddress
                        .firstName
                    }{" "}
                    {
                      order.shippingAddress
                        .lastName
                    }
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#777067]">
                    {
                      order.shippingAddress
                        .address
                    }

                    <br />

                    {
                      order.shippingAddress
                        .city
                    }
                    ,{" "}
                    {
                      order.shippingAddress
                        .state
                    }{" "}
                    {
                      order.shippingAddress
                        .pincode
                    }

                    {order.shippingAddress
                      .landmark && (
                      <>
                        <br />

                        {
                          order.shippingAddress
                            .landmark
                        }
                      </>
                    )}

                    <br />

                    <span className="font-medium text-[#5F584F]">
                      {
                        order.shippingAddress
                          .phone
                      }
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ORDER TIMELINE */}

          <section className="rounded-2xl border border-[#E1DAD0] bg-white p-5 shadow-[0_8px_30px_rgba(68,53,37,0.035)] sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A4773E]">
              Progress
            </p>

            <h2 className="mt-1 font-serif text-2xl text-[#29251F]">
              Order Journey
            </h2>

            {order.orderStatus ===
            "cancelled" ? (
              <div className="mt-7 rounded-xl bg-[#F8ECEA] p-4">
                <p className="font-semibold text-[#A4574D]">
                  Order Cancelled
                </p>

                <p className="mt-1 text-xs text-[#8A8176]">
                  This order is no longer
                  being processed.
                </p>
              </div>
            ) : (
              <div className="mt-8 space-y-7">
                <TimelineItem
                  active
                  icon={
                    <Check
                      size={15}
                    />
                  }
                  title="Order Confirmed"
                  description="Order has been received."
                />

                <TimelineItem
                  active={isConfirmed}
                  icon={
                    <Package
                      size={15}
                    />
                  }
                  title="Processing"
                  description="Order is being prepared."
                />

                <TimelineItem
                  active={isShipped}
                  icon={
                    <Truck
                      size={15}
                    />
                  }
                  title="Shipped"
                  description="Order is on its way."
                />

                <TimelineItem
                  active={isDelivered}
                  last
                  icon={
                    <Check
                      size={15}
                    />
                  }
                  title="Delivered"
                  description="Order has been delivered."
                />
              </div>
            )}
          </section>
        </div>

        {/* ==================================
            RIGHT COLUMN
        ================================== */}

        <aside className="space-y-5 xl:sticky xl:top-6">
          {/* ==================================
              STATUS UPDATE
          ================================== */}

          <section className="relative overflow-hidden rounded-2xl border border-[#393229] bg-[#29251F] p-6 text-white shadow-[0_18px_50px_rgba(41,37,31,0.16)]">
            {/* Decorative glow */}

            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#C7A875]/10 blur-3xl" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D9B981]" />

                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C7A875]">
                      Admin Control
                    </p>
                  </div>

                  <h2 className="mt-2 font-serif text-2xl text-white">
                    Update Status
                  </h2>

                  <p className="mt-2 text-xs leading-5 text-white/60">
                    Move this order through its
                    delivery journey.
                  </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-[#D9B981]">
                  {getStatusIcon(
                    order.orderStatus,
                  )}
                </div>
              </div>

              {/* CURRENT STATUS */}

              <div className="mt-6">
                <p className="mb-2.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">
                  Current Status
                </p>

                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C7A875] text-[#29251F] shadow-[0_8px_20px_rgba(199,168,117,0.18)]">
                      {getStatusIcon(
                        order.orderStatus,
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#D9B981]">
                        Currently at
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        {formatOrderStatus(
                          order.orderStatus,
                        )}
                      </p>
                    </div>

                    <div className="ml-auto flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#A9D18E] shadow-[0_0_0_5px_rgba(169,209,142,0.08)]" />
                  </div>
                </div>
              </div>

              {/* NEXT ACTION */}

              {canUpdateStatus &&
              nextOrderStatus ? (
                <div className="mt-5">
                  <p className="mb-2.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Next Available Action
                  </p>

                  <div className="rounded-2xl border border-[#C7A875]/30 bg-[#342F29] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#C7A875]/30 bg-[#C7A875]/10 text-[#D9B981]">
                        {getStatusIcon(
                          nextOrderStatus,
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
                          Move to
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white">
                          {formatOrderStatus(
                            nextOrderStatus,
                          )}
                        </p>
                      </div>

                      <ArrowRight
                        size={17}
                        className="shrink-0 text-[#D9B981]"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={updating}
                      onClick={() =>
                        handleStatusUpdate(
                          nextOrderStatus,
                        )
                      }
                      className="group relative mt-4 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#C7A875] px-4 text-sm font-semibold text-[#29251F] shadow-[0_10px_25px_rgba(199,168,117,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[#D9B981] hover:shadow-[0_15px_30px_rgba(199,168,117,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-white/20 transition-all duration-700 group-hover:left-[120%]" />

                      {updating ? (
                        <>
                          <RefreshCw
                            size={16}
                            className="relative animate-spin"
                          />

                          <span className="relative">
                            Updating Order...
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="relative">
                            Move to{" "}
                            {formatOrderStatus(
                              nextOrderStatus,
                            )}
                          </span>

                          <ArrowRight
                            size={16}
                            className="relative transition-transform group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-[#C7A875]">
                      <Check
                        size={18}
                        strokeWidth={1.8}
                      />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {order.orderStatus ===
                        "delivered"
                          ? "Order Completed"
                          : "No Further Updates"}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/50">
                        {order.orderStatus ===
                        "delivered"
                          ? "This order has been successfully delivered."
                          : "This order cannot be moved to another status."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PROGRESS */}

              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/40">
                    Order Progress
                  </p>

                  <p className="text-[10px] font-semibold text-[#D9B981]">
                    Step{" "}
                    {Math.max(
                      currentStatusIndex + 1,
                      1,
                    )}{" "}
                    of {ORDER_STATUS_FLOW.length}
                  </p>
                </div>

                <div className="flex gap-1.5">
                  {ORDER_STATUS_FLOW.map(
                    (
                      status,
                      index,
                    ) => (
                      <div
                        key={status}
                        className={`h-1.5 flex-1 rounded-full ${
                          index <=
                          currentStatusIndex
                            ? "bg-[#C7A875]"
                            : "bg-white/10"
                        }`}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ORDER SUMMARY */}

          <section className="overflow-hidden rounded-2xl border border-[#E1DAD0] bg-white shadow-[0_8px_30px_rgba(68,53,37,0.035)]">
            <SectionHeader
              eyebrow="Payment"
              title="Order Summary"
            />

            <div className="space-y-4 p-5 sm:p-6">
              <SummaryRow
                label="Subtotal"
                value={`₹${order.subtotal.toLocaleString(
                  "en-IN",
                )}`}
              />

              {order.discountAmount >
                0 && (
                <SummaryRow
                  label="Discount"
                  value={`- ₹${order.discountAmount.toLocaleString(
                    "en-IN",
                  )}`}
                  accent
                />
              )}

              <SummaryRow
                label="Shipping"
                value={shippingText}
                accent={
                  order.shippingCost ===
                  0
                }
              />

              <div className="h-px bg-[#ECE6DE]" />

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8A8176]">
                    Total
                  </p>

                  <p className="mt-1 text-xs text-[#9A9288]">
                    Amount paid by customer
                  </p>
                </div>

                <p className="font-serif text-3xl text-[#29251F]">
                  ₹
                  {order.total.toLocaleString(
                    "en-IN",
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* PAYMENT DETAILS */}

          <section className="rounded-2xl border border-[#E1DAD0] bg-white p-5 shadow-[0_8px_30px_rgba(68,53,37,0.035)] sm:p-6">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0E9DF]">
                <ShieldCheck
                  size={19}
                  strokeWidth={1.4}
                  className="text-[#806A4D]"
                />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A4773E]">
                  Payment
                </p>

                <p className="mt-2 text-sm font-semibold capitalize text-[#29251F]">
                  {order.paymentMethod ===
                  "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </p>

                <p className="mt-1 text-xs text-[#8A8176]">
                  Status:{" "}

                  <span className="font-semibold capitalize text-[#5F584F]">
                    {
                      order.paymentStatus
                    }
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* SHIPPING METHOD */}

          <section className="rounded-2xl border border-[#E1DAD0] bg-white p-5 shadow-[0_8px_30px_rgba(68,53,37,0.035)] sm:p-6">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0E9DF]">
                <Truck
                  size={19}
                  strokeWidth={1.4}
                  className="text-[#806A4D]"
                />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A4773E]">
                  Delivery
                </p>

                <p className="mt-2 text-sm font-semibold capitalize text-[#29251F]">
                  {
                    order.shippingMethod
                  }{" "}
                  Delivery
                </p>

                <p className="mt-1 text-xs text-[#8A8176]">
                  {shippingText}
                </p>
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
 * Section Header
 * ========================================
 */

const SectionHeader = ({
  eyebrow,
  title,
  right,
}: {
  eyebrow: string;
  title: string;
  right?: React.ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#ECE6DE] px-5 py-5 sm:px-6">
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#A4773E]">
          {eyebrow}
        </p>

        <h2 className="mt-1 font-serif text-2xl text-[#29251F]">
          {title}
        </h2>
      </div>

      {right}
    </div>
  );
};

/*
 * ========================================
 * Summary Row
 * ========================================
 */

const SummaryRow = ({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-[#777067]">
        {label}
      </span>

      <span
        className={`text-sm font-medium ${
          accent
            ? "text-[#806545]"
            : "text-[#29251F]"
        }`}
      >
        {value}
      </span>
    </div>
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
  const styles: Record<
    OrderStatus,
    string
  > = {
    pending:
      "border border-[#E6D5AE] bg-[#F7F1E4] text-[#9A6B20]",

    confirmed:
      "border border-[#CFDDC4] bg-[#EDF2E8] text-[#587142]",

    processing:
      "border border-[#C9DBE5] bg-[#EAF1F5] text-[#496E83]",

    shipped:
      "border border-[#D7CCE8] bg-[#EEEAF5] text-[#695A8A]",

    out_for_delivery:
      "border border-[#E6CDAF] bg-[#F4ECE3] text-[#966638]",

    delivered:
      "border border-[#C8DEC9] bg-[#E9F2EC] text-[#3F7854]",

    cancelled:
      "border border-[#E6C8C4] bg-[#F6E9E7] text-[#A4574D]",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[9px] font-semibold capitalize tracking-wide ${styles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />

      {status.replace(
        /_/g,
        " ",
      )}
    </span>
  );
};

/*
 * ========================================
 * Timeline Item
 * ========================================
 */

const TimelineItem = ({
  active,
  last = false,
  icon,
  title,
  description,
}: {
  active: boolean;
  last?: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="relative flex gap-4">
      {!last && (
        <div
          className={`absolute left-5 top-10 h-[calc(100%+1.75rem)] w-px ${
            active
              ? "bg-[#B7894A]"
              : "bg-[#E1DAD0]"
          }`}
        />
      )}

      <div
        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
          active
            ? "border-[#29251F] bg-[#29251F] text-white"
            : "border-[#DDD6CC] bg-white text-[#AAA198]"
        }`}
      >
        {icon}
      </div>

      <div className="pt-0.5">
        <p
          className={`text-sm font-semibold ${
            active
              ? "text-[#29251F]"
              : "text-[#AAA198]"
          }`}
        >
          {title}
        </p>

        <p className="mt-1 text-xs text-[#8A8176]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;