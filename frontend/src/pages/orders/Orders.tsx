import {
  ArrowRight,
  ChevronRight,
  Package,
  ShoppingBag,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  getMyOrders,
} from "../../api/order.api";

import type {
  Order,
} from "../../types/order";

const formatPrice = (
  price: number,
) =>
  price.toLocaleString(
    "en-IN",
  );

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadOrders =
      async () => {
        try {
          setLoading(true);

          setError("");

          const result =
            await getMyOrders();

          setOrders(result);
        } catch (error) {
          console.error(
            "Failed to load orders:",
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

    loadOrders();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F5F1]">
        <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto mb-5 h-8 w-8 animate-spin rounded-full border-2 border-[#29251F] border-t-transparent" />

            <p className="text-[11px] uppercase tracking-[0.2em] text-[#777067]">
              Loading your orders
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#F7F5F1]">
        <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-6">
          <div className="max-w-md text-center">
            <Package
              size={42}
              strokeWidth={1}
              className="mx-auto mb-6 text-[#8A8176]"
            />

            <h1 className="font-serif text-3xl text-[#29251F]">
              Unable to Load Orders
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#777067]">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#29251F] px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#3A342D]"
            >
              Continue Shopping

              <ChevronRight
                size={15}
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-[#F7F5F1]">
        <section className="px-6 pb-20 pt-16">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D8D2C8] bg-white">
              <ShoppingBag
                size={25}
                strokeWidth={1.3}
                className="text-[#6F675E]"
              />
            </div>

            <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8A8176]">
              Your Orders
            </p>

            <h1 className="mt-3 font-serif text-4xl text-[#29251F] md:text-5xl">
              No orders yet.
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#777067]">
              Your carefully chosen pieces
              will appear here once you
              place your first order.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#29251F] px-7 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#3A342D]"
            >
              Explore Collection

              <ArrowRight
                size={15}
                strokeWidth={1.5}
              />
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5F1]">
      {/* Header */}

      <section className="border-b border-[#E4E0D9]">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8A8176]">
            Account
          </p>

          <h1 className="mt-3 font-serif text-4xl text-[#29251F] md:text-5xl">
            My Orders
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-[#777067]">
            View your orders, track their
            progress, and revisit the details
            of your purchases.
          </p>
        </div>
      </section>

      {/* Orders */}

      <section className="px-6 py-10 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8176]">
              {orders.length}{" "}
              {orders.length === 1
                ? "Order"
                : "Orders"}
            </p>
          </div>

          <div className="space-y-5">
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onView={() =>
                  navigate(
                    `/orders/${order._id}`,
                  )
                }
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

interface OrderCardProps {
  order: Order;

  onView: () => void;
}

const OrderCard = ({
  order,
  onView,
}: OrderCardProps) => {
  const formattedDate =
    new Date(
      order.createdAt,
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    );

  const itemCount =
    order.items.reduce(
      (total, item) =>
        total + item.quantity,
      0,
    );

  /*
   * ========================================
   * ORIGINAL PRODUCTS TOTAL
   *
   * This is the total before automatic
   * product offers are applied.
   * ========================================
   */

  const originalItemsTotal =
    order.items.reduce(
      (total, item) =>
        total +
        (item.originalPrice ??
          item.price) *
          item.quantity,
      0,
    );

  /*
   * ========================================
   * FINAL PRODUCTS TOTAL
   *
   * price is the final price after
   * automatic product offers.
   * ========================================
   */

  const discountedItemsTotal =
    order.items.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0,
    );

  /*
   * Automatic offer savings.
   */

  const offerSavings =
    Math.max(
      originalItemsTotal -
        discountedItemsTotal,
      0,
    );

  const hasOfferDiscount =
    offerSavings > 0;

  const statusLabel =
    order.orderStatus.replace(
      /_/g,
      " ",
    );

  const paymentLabel =
    order.paymentMethod ===
    "cod"
      ? "Cash on Delivery"
      : "Online Payment";

  return (
    <article className="overflow-hidden rounded-2xl border border-[#E1DDD6] bg-white">
      {/* Top */}

      <div className="flex flex-col gap-5 border-b border-[#E8E4DE] px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9A9288]">
            Order Number
          </p>

          <p className="mt-1 font-medium text-[#29251F]">
            {order.orderNumber}
          </p>
        </div>

        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9A9288]">
              Date
            </p>

            <p className="mt-1 text-sm text-[#5F584F]">
              {formattedDate}
            </p>
          </div>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9A9288]">
              Payment
            </p>

            <p className="mt-1 text-sm text-[#5F584F]">
              {paymentLabel}
            </p>
          </div>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#9A9288]">
              Total Paid
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-[#29251F]">
                ₹
                {formatPrice(
                  order.total,
                )}
              </p>

              {hasOfferDiscount && (
                <span className="text-[10px] font-medium text-[#8A8176]">
                  Saved ₹
                  {formatPrice(
                    offerSavings,
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}

      <div className="px-6 py-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Products */}

          <div className="flex min-w-0 flex-1 gap-4">
            <div className="flex -space-x-3">
              {order.items
                .slice(0, 4)
                .map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId ?? "default"}`}
                    className="h-16 w-16 overflow-hidden rounded-xl border-2 border-white bg-[#F1EEE9]"
                  >
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
                          size={18}
                          strokeWidth={1}
                          className="text-[#AAA198]"
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-[#29251F]">
                {order.items[0]
                  ?.productName ||
                  "Order Items"}
              </p>

              {order.items.length >
                1 && (
                <p className="mt-1 text-xs text-[#8A8176]">
                  +{" "}
                  {order.items.length -
                    1}{" "}
                  more{" "}
                  {order.items.length -
                    1 ===
                  1
                    ? "item"
                    : "items"}
                </p>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="text-xs text-[#8A8176]">
                  {itemCount}{" "}
                  {itemCount === 1
                    ? "item"
                    : "items"}
                </p>

                {hasOfferDiscount && (
                  <>
                    <span className="text-[#C8C1B8]">
                      •
                    </span>

                    <p className="text-xs font-medium text-[#6F675E]">
                      ₹
                      {formatPrice(
                        originalItemsTotal,
                      )}

                      <span className="ml-1 text-[#9A9288] line-through">
                        original
                      </span>

                      <span className="mx-1">
                        →
                      </span>

                      ₹
                      {formatPrice(
                        discountedItemsTotal,
                      )}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Status */}

          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-full border border-[#D8D2C8] bg-[#F7F5F1] px-4 py-2">
              <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#5F584F]">
                {statusLabel}
              </span>
            </div>

            <button
              type="button"
              onClick={onView}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#29251F] px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#3A342D]"
            >
              View Order

              <ChevronRight
                size={15}
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Orders;