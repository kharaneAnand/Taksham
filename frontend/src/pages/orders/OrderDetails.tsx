import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  MapPin,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  getOrderById,
} from "../../api/order.api";

import type {
  Order,
} from "../../types/order";

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

  const [error, setError] =
    useState("");

  /*
   * ----------------------------------------
   * Load Order
   * ----------------------------------------
   */

  useEffect(() => {
    if (!id) {
      const message =
        "Order ID is missing.";

      setError(message);

      toast.error(message);

      setLoading(false);

      return;
    }

    const loadOrder =
      async () => {
        try {
          setLoading(true);

          setError("");

          const result =
            await getOrderById(id);

          setOrder(result);
        } catch (error) {
          console.error(
            "Failed to load order:",
            error,
          );

          const message =
            error instanceof Error
              ? error.message
              : "Failed to load order";

          setError(message);

          toast.error(message);
        } finally {
          setLoading(false);
        }
      };

    loadOrder();
  }, [id]);

  /*
   * ----------------------------------------
   * Loading
   * ----------------------------------------
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F4EF] text-[#29251F]">
        <div className="mx-auto flex min-h-[75vh] max-w-7xl items-center justify-center px-5 sm:px-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#DED4C7] bg-white shadow-[0_12px_40px_rgba(70,55,40,0.08)]">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#B7894A] border-t-transparent" />
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8A8176]">
              Preparing your order
            </p>

            <p className="mt-2 font-serif text-xl text-[#39332C]">
              Just a moment...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ----------------------------------------
   * Error
   * ----------------------------------------
   */

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#F7F4EF]">
        <div className="mx-auto flex min-h-[75vh] max-w-7xl items-center justify-center px-5 sm:px-8">
          <div className="max-w-lg rounded-[28px] border border-[#E3DBD0] bg-[#FCFBF8] px-7 py-12 text-center shadow-[0_20px_70px_rgba(65,50,35,0.07)] sm:px-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F0E9DE]">
              <Package
                size={30}
                strokeWidth={1.1}
                className="text-[#8A765C]"
              />
            </div>

            <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#A4773E]">
              Taksham Orders
            </p>

            <h1 className="mt-3 font-serif text-3xl tracking-[-0.02em] text-[#29251F] sm:text-4xl">
              Order Not Found
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-[#777067]">
              {error ||
                "We couldn't find this order. It may have been removed or the link may be incorrect."}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
              className="
                group
                mt-8
                inline-flex
                h-12
                items-center
                gap-3
                rounded-full
                bg-[#29251F]
                px-7
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-white
                shadow-[0_12px_30px_rgba(41,37,31,0.16)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#3A342D]
              "
            >
              Continue Shopping

              <ChevronRight
                size={15}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ----------------------------------------
   * Order Data
   * ----------------------------------------
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

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F4EF] text-[#29251F]">
      {/* =====================================================
          TOP NAV
      ===================================================== */}

      <section className="border-b border-[#E4DED5] bg-[#FAF8F4]">
        <div className="mx-auto max-w-7xl px-5 py-4 sm:px-8 lg:px-10">
          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
            className="
              group
              inline-flex
              items-center
              gap-2.5
              rounded-full
              px-1
              py-1.5
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[#756D63]
              transition-all
              duration-300
              hover:text-[#29251F]
            "
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#DED6CB] bg-white transition-all duration-300 group-hover:border-[#B7894A] group-hover:bg-[#F7EFE2]">
              <ArrowLeft
                size={14}
                strokeWidth={1.5}
              />
            </span>

            Continue Shopping
          </button>
        </div>
      </section>

      {/* =====================================================
          SUCCESS HERO
      ===================================================== */}

      <section className="relative overflow-hidden px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16 lg:px-10 lg:pt-20">
        <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[320px] -translate-x-1/2 rounded-full bg-[#E9D8BD]/25 blur-3xl" />

        <div className="pointer-events-none absolute -right-24 top-20 hidden h-64 w-64 rounded-full border border-[#DCCDBA]/40 lg:block" />

        <div className="pointer-events-none absolute -left-20 top-32 hidden h-44 w-44 rounded-full border border-[#DCCDBA]/30" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[#D9CCBA] bg-white shadow-[0_15px_45px_rgba(73,56,39,0.10)]">
            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-[#29251F] text-white shadow-[0_8px_20px_rgba(41,37,31,0.18)]">
              <Check
                size={24}
                strokeWidth={1.6}
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#B7894A]" />

            <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#A4773E]">
              {order.orderStatus ===
              "cancelled"
                ? "Order Cancelled"
                : "Order Confirmed"}
            </p>

            <span className="h-px w-8 bg-[#B7894A]" />
          </div>

          <h1 className="mt-4 font-serif text-[38px] leading-[1.05] tracking-[-0.035em] text-[#29251F] sm:text-5xl lg:text-[58px]">
            {order.orderStatus ===
            "cancelled"
              ? "Your order has been cancelled."
              : "Thank you for your order."}
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-[13px] leading-7 text-[#777067] sm:text-sm">
            {order.orderStatus ===
            "cancelled"
              ? "This order has been successfully cancelled. If you have any questions, please contact our support team."
              : "Your order has been successfully placed. We've received your request and will begin preparing your pieces shortly."}
          </p>

          <div className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-[#DCD2C5] bg-white px-5 py-3 shadow-[0_6px_22px_rgba(65,50,35,0.05)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B7894A]" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#655D53]">
              Order #{order.orderNumber}
            </span>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
        <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[1.55fr_0.85fr] lg:items-start">
          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="space-y-6">
            {/* ORDER INFORMATION */}

            <section className="overflow-hidden rounded-3xl border border-[#E1DAD0] bg-[#FCFBF8] shadow-[0_8px_35px_rgba(68,53,37,0.045)]">
              <SectionHeader
                eyebrow="Order Information"
                title="Order Details"
              />

              <div className="grid grid-cols-1 divide-y divide-[#ECE6DE] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <InfoItem
                  label="Order Number"
                  value={order.orderNumber}
                />

                <InfoItem
                  label="Order Date"
                  value={formattedDate}
                />

                <InfoItem
                  label="Status"
                  value={order.orderStatus.replace(
                    /_/g,
                    " ",
                  )}
                  capitalize
                  highlighted
                />
              </div>
            </section>

            {/* ORDER ITEMS */}

            <section className="overflow-hidden rounded-3xl border border-[#E1DAD0] bg-[#FCFBF8] shadow-[0_8px_35px_rgba(68,53,37,0.045)]">
              <SectionHeader
                eyebrow="Your Order"
                title="Order Items"
                right={
                  <span className="rounded-full bg-[#F2ECE3] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#756D63]">
                    {order.items.length}{" "}
                    {order.items.length ===
                    1
                      ? "Item"
                      : "Items"}
                  </span>
                }
              />

              <div className="divide-y divide-[#EAE4DC]">
                {order.items.map(
                  (item) => (
                    <div
                      key={`${item.productId}-${item.variantId ?? "default"}`}
                      className="
                        group
                        flex
                        gap-4
                        px-5
                        py-5
                        transition-colors
                        duration-300
                        hover:bg-[#FAF7F2]
                        sm:gap-5
                        sm:px-6
                        sm:py-6
                      "
                    >
                      <div className="relative h-23 w-23 shrink-0 overflow-hidden rounded-2xl bg-[#F0ECE5] ring-1 ring-inset ring-[#E3DBD0] sm:h-27 sm:w-27">
                        {item.productImage ? (
                          <img
                            src={
                              item.productImage
                            }
                            alt={
                              item.productName
                            }
                            className="
                              h-full
                              w-full
                              object-cover
                              transition-transform
                              duration-700
                              ease-out
                              group-hover:scale-[1.045]
                            "
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package
                              size={24}
                              strokeWidth={1}
                              className="text-[#AAA198]"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-serif text-[17px] leading-tight tracking-[-0.015em] text-[#29251F] sm:text-xl">
                              {
                                item.productName
                              }
                            </h3>

                            <ArrowUpRight
                              size={15}
                              strokeWidth={1.35}
                              className="mt-0.5 shrink-0 text-[#B8AEA1] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#A4773E]"
                            />
                          </div>

                          {item.variant && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {item.variant
                                .color && (
                                <span className="rounded-full border border-[#E1D9CE] bg-white px-2.5 py-1 text-[8px] font-medium text-[#766D63]">
                                  {
                                    item.variant
                                      .color
                                  }
                                </span>
                              )}

                              {item.variant
                                .material && (
                                <span className="rounded-full border border-[#E1D9CE] bg-white px-2.5 py-1 text-[8px] font-medium text-[#766D63]">
                                  {
                                    item.variant
                                      .material
                                  }
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex items-end justify-between gap-3">
                          <p className="text-[10px] uppercase tracking-widest text-[#8A8176]">
                            Qty{" "}
                            <span className="font-semibold text-[#5F584F]">
                              {item.quantity}
                            </span>
                          </p>

                          <p className="text-[15px] font-semibold tracking-[-0.01em] text-[#29251F] sm:text-base">
                            ₹
                            {item.subtotal.toLocaleString(
                              "en-IN",
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </section>

            {/* SHIPPING ADDRESS */}

            <section className="overflow-hidden rounded-3xl border border-[#E1DAD0] bg-[#FCFBF8] shadow-[0_8px_35px_rgba(68,53,37,0.045)]">
              <SectionHeader
                eyebrow="Delivery"
                title="Shipping Address"
              />

              <div className="px-5 py-6 sm:px-6 sm:py-7">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0E9DF]">
                    <MapPin
                      size={18}
                      strokeWidth={1.35}
                      className="text-[#806A4D]"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#29251F]">
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

                    <p className="mt-2 text-[13px] leading-6 text-[#777067]">
                      {
                        order
                          .shippingAddress
                          .address
                      }

                      <br />

                      {
                        order
                          .shippingAddress
                          .city
                      }
                      ,{" "}
                      {
                        order
                          .shippingAddress
                          .state
                      }{" "}
                      —{" "}
                      {
                        order
                          .shippingAddress
                          .pincode
                      }

                      {order
                        .shippingAddress
                        .landmark && (
                        <>
                          <br />
                          {
                            order
                              .shippingAddress
                              .landmark
                          }
                        </>
                      )}

                      <br />

                      {
                        order
                          .shippingAddress
                          .phone
                      }
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* STATUS TIMELINE */}

            <section className="overflow-hidden rounded-3xl border border-[#E1DAD0] bg-[#FCFBF8] px-5 py-6 shadow-[0_8px_35px_rgba(68,53,37,0.045)] sm:px-6 sm:py-7">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#A4773E]">
                  Your Journey
                </p>

                <h2 className="mt-1 font-serif text-[25px] tracking-[-0.02em] text-[#29251F]">
                  Order Status
                </h2>
              </div>

              {order.orderStatus ===
              "cancelled" ? (
                <div className="mt-8 flex items-center gap-4 rounded-2xl border border-[#E3D8CA] bg-[#F7F1E8] px-5 py-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#29251F] text-white">
                    <Package
                      size={17}
                      strokeWidth={1.4}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold capitalize text-[#29251F]">
                      Order Cancelled
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-[#8A8176]">
                      This order is no longer
                      being processed.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-8 space-y-7">
                  <TimelineItem
                    active
                    icon={
                      <Check
                        size={15}
                        strokeWidth={1.7}
                      />
                    }
                    title="Order Confirmed"
                    description="Your order has been received."
                  />

                  <TimelineItem
                    active={isConfirmed}
                    icon={
                      <Package
                        size={15}
                        strokeWidth={1.5}
                      />
                    }
                    title="Processing"
                    description="Your order will be prepared shortly."
                  />

                  <TimelineItem
                    active={isShipped}
                    icon={
                      <Truck
                        size={15}
                        strokeWidth={1.5}
                      />
                    }
                    title="Shipped"
                    description="Your order is on its way."
                  />

                  <TimelineItem
                    active={isDelivered}
                    last
                    icon={
                      <Check
                        size={15}
                        strokeWidth={1.7}
                      />
                    }
                    title="Delivered"
                    description="Enjoy your Taksham pieces."
                  />
                </div>
              )}
            </section>
          </div>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <aside className="space-y-5 lg:sticky lg:top-6">
            {/* ORDER SUMMARY */}

            <section className="overflow-hidden rounded-3xl border border-[#DCD1C2] bg-[#29251F] text-white shadow-[0_18px_55px_rgba(48,39,30,0.14)]">
              <div className="relative overflow-hidden px-6 py-6 sm:px-7">
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full border border-white/10" />

                <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full border border-[#CBA66D]/20" />

                <p className="relative text-[9px] font-semibold uppercase tracking-[0.25em] text-[#C7A875]">
                  Summary
                </p>

                <h2 className="relative mt-1 font-serif text-[27px] tracking-[-0.02em]">
                  Order Total
                </h2>
              </div>

              <div className="border-t border-white/10 px-6 py-6 sm:px-7">
                <div className="space-y-4">
                  <DarkSummaryRow
                    label="Subtotal"
                    value={`₹${order.subtotal.toLocaleString(
                      "en-IN",
                    )}`}
                  />

                  <DarkSummaryRow
                    label="Shipping"
                    value={shippingText}
                    accent={
                      order.shippingCost ===
                      0
                    }
                  />
                </div>

                <div className="my-6 h-px bg-white/10" />

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.18em] text-white/50">
                      Total payable
                    </p>

                    <p className="mt-1 text-sm font-medium text-white/80">
                      Inclusive of shipping
                    </p>
                  </div>

                  <span className="font-serif text-[30px] tracking-tight text-[#F4E6D2]">
                    ₹
                    {order.total.toLocaleString(
                      "en-IN",
                    )}
                  </span>
                </div>
              </div>
            </section>

            {/* PAYMENT */}

            <section className="rounded-[22px] border border-[#E1DAD0] bg-[#FCFBF8] px-5 py-5 shadow-[0_7px_28px_rgba(68,53,37,0.04)] sm:px-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0E9DF]">
                  <ShieldCheck
                    size={19}
                    strokeWidth={1.35}
                    className="text-[#806A4D]"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#A4773E]">
                    Payment
                  </p>

                  <p className="mt-1.5 text-sm font-semibold text-[#29251F]">
                    {order.paymentMethod ===
                    "cod"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </p>

                  <p className="mt-1.5 text-[11px] leading-5 text-[#8A8176]">
                    Payment status:{" "}
                    <span className="font-medium capitalize text-[#5F584F]">
                      {
                        order.paymentStatus
                      }
                    </span>
                  </p>
                </div>
              </div>
            </section>

            {/* DELIVERY METHOD */}

            <section className="rounded-[22px] border border-[#E1DAD0] bg-[#FCFBF8] px-5 py-5 shadow-[0_7px_28px_rgba(68,53,37,0.04)] sm:px-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F0E9DF]">
                  <Truck
                    size={19}
                    strokeWidth={1.35}
                    className="text-[#806A4D]"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#A4773E]">
                    Delivery Method
                  </p>

                  <p className="mt-1.5 text-sm font-semibold capitalize text-[#29251F]">
                    {order.shippingMethod}{" "}
                    Delivery
                  </p>

                  <p className="mt-1.5 text-[11px] leading-5 text-[#8A8176]">
                    We'll keep you updated as
                    your order progresses.
                  </p>
                </div>
              </div>
            </section>

            {/* ORDER POLICY */}

            <section className="rounded-[22px] border border-[#E1D6C7] bg-[#F8F2E9] px-5 py-5 sm:px-6">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E9DCC9] text-[#8D6B40]">
                  <ShieldCheck
                    size={14}
                    strokeWidth={1.5}
                  />
                </div>

                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#806545]">
                    Order Policy
                  </p>

                  <p className="mt-1.5 text-[11px] leading-5 text-[#81776C]">
                    Orders cannot be cancelled
                    once they have been placed.
                    Please review your order
                    details carefully before
                    checkout.
                  </p>
                </div>
              </div>
            </section>

            {/* ACTIONS */}

            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={() =>
                  navigate("/orders")
                }
                className="
                  group
                  flex
                  h-13
                  w-full
                  items-center
                  justify-center
                  gap-2.5
                  rounded-[14px]
                  bg-[#29251F]
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-white
                  shadow-[0_12px_30px_rgba(41,37,31,0.14)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#3A342D]
                  hover:shadow-[0_16px_36px_rgba(41,37,31,0.18)]
                  active:scale-[0.985]
                "
              >
                View My Orders

                <ChevronRight
                  size={15}
                  strokeWidth={1.5}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/products")
                }
                className="
                  flex
                  h-13
                  w-full
                  items-center
                  justify-center
                  rounded-[14px]
                  border
                  border-[#D9D0C4]
                  bg-white
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-[#514A42]
                  transition-all
                  duration-300
                  hover:border-[#BDA27B]
                  hover:bg-[#F8F2E9]
                  hover:text-[#76572F]
                  active:scale-[0.985]
                "
              >
                Continue Shopping
              </button>
            </div>

            {/* TRUST */}

            <div className="flex items-center justify-center gap-2 pt-2 text-center">
              <ShieldCheck
                size={13}
                strokeWidth={1.35}
                className="text-[#A4773E]"
              />

              <span className="text-[8px] font-medium uppercase tracking-[0.15em] text-[#93897E]">
                Your order is securely placed
              </span>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

/*
 * ========================================
 * Section Header
 * ========================================
 */

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  right?: ReactNode;
}

const SectionHeader = ({
  eyebrow,
  title,
  right,
}: SectionHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#EAE4DC] px-5 py-5 sm:px-6 sm:py-6">
      <div>
        <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#A4773E]">
          {eyebrow}
        </p>

        <h2 className="mt-1 font-serif text-[24px] leading-tight tracking-[-0.02em] text-[#29251F] sm:text-[26px]">
          {title}
        </h2>
      </div>

      {right}
    </div>
  );
};

/*
 * ========================================
 * Info Item
 * ========================================
 */

interface InfoItemProps {
  label: string;
  value: string;
  capitalize?: boolean;
  highlighted?: boolean;
}

const InfoItem = ({
  label,
  value,
  capitalize = false,
  highlighted = false,
}: InfoItemProps) => {
  return (
    <div className="px-5 py-5 sm:px-6 sm:py-6">
      <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#9A9288]">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-2">
        {highlighted && (
          <span className="h-1.5 w-1.5 rounded-full bg-[#B7894A]" />
        )}

        <p
          className={`text-sm font-semibold text-[#29251F] ${
            capitalize
              ? "capitalize"
              : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

/*
 * ========================================
 * Dark Summary Row
 * ========================================
 */

interface DarkSummaryRowProps {
  label: string;
  value: string;
  accent?: boolean;
}

const DarkSummaryRow = ({
  label,
  value,
  accent = false,
}: DarkSummaryRowProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[12px] text-white/55">
        {label}
      </span>

      <span
        className={`text-[13px] font-medium ${
          accent
            ? "text-[#D9B981]"
            : "text-white/85"
        }`}
      >
        {value}
      </span>
    </div>
  );
};

/*
 * ========================================
 * Timeline Item
 * ========================================
 */

interface TimelineItemProps {
  active: boolean;
  last?: boolean;
  icon: ReactNode;
  title: string;
  description: string;
}

const TimelineItem = ({
  active,
  last = false,
  icon,
  title,
  description,
}: TimelineItemProps) => {
  return (
    <div className="relative flex gap-4">
      {!last && (
        <div
          className={`absolute left-5 top-10 h-[calc(100%+1.75rem)] w-px transition-colors duration-500 ${
            active
              ? "bg-[#B7894A]"
              : "bg-[#DDD8D0]"
          }`}
        />
      )}

      <div
        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
          active
            ? "border-[#29251F] bg-[#29251F] text-white shadow-[0_6px_18px_rgba(41,37,31,0.14)]"
            : "border-[#DDD8D0] bg-[#FCFBF8] text-[#AAA198]"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 pt-0.5">
        <div className="flex items-center gap-2">
          <p
            className={`text-sm font-semibold ${
              active
                ? "text-[#29251F]"
                : "text-[#AAA198]"
            }`}
          >
            {title}
          </p>

          {active && (
            <span className="h-1.5 w-1.5 rounded-full bg-[#B7894A]" />
          )}
        </div>

        <p className="mt-1 text-[11px] leading-5 text-[#8A8176] sm:text-xs">
          {description}
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;