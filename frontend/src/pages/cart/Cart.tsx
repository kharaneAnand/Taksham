import {
  ArrowLeft,
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";

const Cart = () => {
  const navigate = useNavigate();

  const {
    items,
    totalItems,
    subtotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const shipping = subtotal >= 50000 ? 0 : 999;

  const total = subtotal + shipping;

  /* =====================================================
     EMPTY CART
  ===================================================== */

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] text-[#302B25]">
        <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-5 py-12 sm:px-8 lg:px-10">
          <div className="relative mx-auto w-full max-w-180 overflow-hidden rounded-[28px] border border-[#E3D9CC] bg-[#F5EEE4] px-6 py-14 text-center shadow-[0_20px_70px_rgba(73,56,38,0.06)] sm:px-12 sm:py-20">
            {/* Decorative number */}

            <span
              className="
                pointer-events-none
                absolute
                -right-4
                -top-10
                font-serif
                text-[150px]
                leading-none
                text-[#B7894A]/[0.07]
                sm:text-[190px]
              "
            >
              00
            </span>

            {/* Small emblem */}

            <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#CDBB9F] bg-[#FAF8F5] shadow-[0_8px_30px_rgba(80,60,40,0.08)]">
              <ShoppingBag
                size={25}
                strokeWidth={1.25}
                className="text-[#9A7138]"
              />
            </div>

            <p
              className="
                relative
                mt-7
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.28em]
                text-[#A4773E]
              "
            >
              Your Collection
            </p>

            <h1
              className="
                relative
                mt-3
                font-serif
                text-[36px]
                leading-[1.05]
                tracking-[-0.035em]
                text-[#302B25]
                sm:text-[48px]
              "
            >
              Your cart is waiting.
            </h1>

            <p
              className="
                relative
                mx-auto
                mt-4
                max-w-108
                text-[12px]
                leading-6
                text-[#81776C]
                sm:text-[13px]
              "
            >
              Discover beautifully considered pieces and
              bring something special into your space.
            </p>

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="
                group
                relative
                mt-8
                inline-flex
                h-12
                items-center
                justify-center
                gap-3
                rounded-[10px]
                bg-[#8F6B3F]
                px-7
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-white
                shadow-[0_12px_28px_rgba(143,107,63,0.2)]
                transition-all
                duration-300
                hover:bg-[#795832]
                hover:shadow-[0_16px_34px_rgba(143,107,63,0.26)]
                active:scale-[0.98]
              "
            >
              Explore Collection

              <ArrowRight
                size={14}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            {/* Bottom reassurance */}

            <div className="relative mt-9 flex items-center justify-center gap-5 text-[8px] uppercase tracking-[0.14em] text-[#968A7D]">
              <span className="flex items-center gap-1.5">
                <Check size={11} />
                Curated pieces
              </span>

              <span className="h-3 w-px bg-[#D5C9BB]" />

              <span className="flex items-center gap-1.5">
                <ShieldCheck size={11} />
                Secure checkout
              </span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* =====================================================
     CART
  ===================================================== */

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#302B25]">
      <div
        className="
          mx-auto
          max-w-345
          px-4
          pb-20
          pt-7
          sm:px-7
          sm:pt-10
          lg:px-10
          lg:pb-28
          lg:pt-14
        "
      >
        {/* =================================================
            PAGE INTRO
        ================================================= */}

        <header
          className="
            relative
            overflow-hidden
            border-b
            border-[#E2D8CC]
            pb-7
            sm:pb-9
          "
        >
          {/* Decorative background number */}

          <span
            className="
              pointer-events-none
              absolute
              -right-2
              -top-12
              hidden
              font-serif
              text-[150px]
              leading-none
              text-[#B7894A]/5.5
              sm:block
              lg:text-[190px]
            "
          >
            01
          </span>

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {/* Eyebrow */}

              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-[#B7894A]" />

                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.27em]
                    text-[#A4773E]
                  "
                >
                  Shopping Bag
                </p>
              </div>

              <h1
                className="
                  mt-3
                  font-serif
                  text-[38px]
                  leading-none
                  tracking-[-0.04em]
                  text-[#302B25]
                  sm:text-[48px]
                  lg:text-[56px]
                "
              >
                Your Cart
              </h1>

              <p
                className="
                  mt-3
                  max-w-110
                  text-[11px]
                  leading-5
                  text-[#81776C]
                  sm:text-[12px]
                "
              >
                A collection of pieces you've chosen for
                your space.
              </p>
            </div>

            {/* Cart count + clear */}

            <div className="flex items-center justify-between gap-5 sm:justify-end">
              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#DED3C6]
                  bg-white/70
                  px-3.5
                  py-2
                "
              >
                <ShoppingBag
                  size={13}
                  strokeWidth={1.4}
                  className="text-[#9A7138]"
                />

                <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#675B4F]">
                  {totalItems}{" "}
                  {totalItems === 1 ? "Item" : "Items"}
                </span>
              </div>

              <button
                type="button"
                onClick={clearCart}
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[#978D82]
                  transition-colors
                  hover:text-[#9A7138]
                "
              >
                Clear Cart
              </button>
            </div>
          </div>
        </header>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div
          className="
            mt-7
            grid
            gap-7
            lg:mt-9
            lg:grid-cols-[minmax(0,1fr)_390px]
            lg:gap-10
          "
        >
          {/* =================================================
              ITEMS
          ================================================= */}

          <section className="min-w-0">
            {/* Section heading */}

            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-px w-5 bg-[#B7894A]" />

                <h2
                  className="
                    font-serif
                    text-[20px]
                    tracking-tight
                    text-[#302B25]
                    sm:text-[22px]
                  "
                >
                  Selected Pieces
                </h2>
              </div>

              <span className="hidden text-[8px] font-medium uppercase tracking-[0.16em] text-[#A3988B] sm:block">
                Taksham Collection
              </span>
            </div>

            <div className="space-y-3.5 sm:space-y-4">
              {items.map((item) => {
                const variant = item.variant;

                const maxStock =
                  variant?.stock ?? item.product.stock;

                const image =
                  variant?.images?.[0] ??
                  item.product.image;

                return (
                  <article
                    key={item.id}
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-[18px]
                      border
                      border-[#E2D9CE]
                      bg-white
                      p-2.5
                      shadow-[0_5px_25px_rgba(62,48,34,0.025)]
                      transition-all
                      duration-300
                      hover:border-[#D6C7B5]
                      hover:shadow-[0_12px_35px_rgba(62,48,34,0.055)]
                      sm:rounded-[20px]
                      sm:p-3.5
                    "
                  >
                    {/* Tiny accent */}

                    <div className="absolute left-0 top-5 h-10 w-0.5 rounded-r-full bg-[#B7894A]/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div
                      className="
                        grid
                        grid-cols-[96px_1fr]
                        gap-3.5
                        sm:grid-cols-[145px_1fr]
                        sm:gap-5
                        lg:grid-cols-[155px_1fr]
                        lg:gap-6
                      "
                    >
                      {/* =================================================
                          IMAGE
                      ================================================= */}

                      <div
                        className="
                          relative
                          aspect-square
                          overflow-hidden
                          rounded-[13px]
                          bg-[#F2ECE3]
                          ring-1
                          ring-inset
                          ring-[#E5DCD1]
                          sm:rounded-[15px]
                        "
                      >
                        <img
                          src={image}
                          alt={item.product.name}
                          className="
                            h-full
                            w-full
                            object-contain
                            p-2
                            transition-transform
                            duration-700
                            group-hover:scale-[1.035]
                            sm:p-3
                          "
                        />

                        {/* Image label */}

                        <div
                          className="
                            absolute
                            bottom-2
                            left-2
                            hidden
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            border-white/50
                            bg-white/75
                            px-2
                            py-1
                            backdrop-blur-md
                            sm:flex
                          "
                        >
                          <span className="h-1 w-1 rounded-full bg-[#B7894A]" />

                          <span className="text-[6px] font-semibold uppercase tracking-[0.16em] text-[#665A4D]">
                            Taksham Edit
                          </span>
                        </div>
                      </div>

                      {/* =================================================
                          DETAILS
                      ================================================= */}

                      <div className="flex min-w-0 flex-col py-0.5 sm:py-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p
                              className="
                                truncate
                                text-[7px]
                                font-semibold
                                uppercase
                                tracking-[0.19em]
                                text-[#A4773E]
                                sm:text-[8px]
                              "
                            >
                              {item.product.category}
                            </p>

                            <h2
                              className="
                                mt-1
                                font-serif
                                text-[17px]
                                leading-tight
                                tracking-tight
                                text-[#302B25]
                                sm:text-[23px]
                              "
                            >
                              {item.product.name}
                            </h2>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item.id)
                            }
                            aria-label={`Remove ${item.product.name}`}
                            className="
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              border
                              border-transparent
                              text-[#A0988D]
                              transition-all
                              duration-200
                              hover:border-[#E5D8C9]
                              hover:bg-[#F8F1E8]
                              hover:text-[#9A7138]
                              active:scale-95
                              sm:h-9
                              sm:w-9
                            "
                          >
                            <Trash2
                              size={14}
                              strokeWidth={1.35}
                            />
                          </button>
                        </div>

                        {/* Meta */}

                        <div className="mt-2.5 flex flex-wrap items-center gap-2 sm:mt-3">
                          {variant?.color && (
                            <span
                              className="
                                rounded-full
                                border
                                border-[#E2D6C7]
                                bg-[#F8F2EA]
                                px-2.5
                                py-1
                                text-[8px]
                                font-medium
                                text-[#66584A]
                                sm:text-[9px]
                              "
                            >
                              {variant.color}
                            </span>
                          )}

                          {variant?.material && (
                            <span
                              className="
                                text-[8px]
                                text-[#978D82]
                                sm:text-[9px]
                              "
                            >
                              {variant.material}
                            </span>
                          )}
                        </div>

                        {/* Bottom row */}

                        <div
                          className="
                            mt-auto
                            flex
                            flex-wrap
                            items-end
                            justify-between
                            gap-3
                            pt-4
                            sm:pt-6
                          "
                        >
                          {/* Quantity */}

                          <div>
                            <p
                              className="
                                mb-1.5
                                text-[7px]
                                font-semibold
                                uppercase
                                tracking-[0.16em]
                                text-[#A0988D]
                                sm:mb-2
                                sm:text-[8px]
                              "
                            >
                              Quantity
                            </p>

                            <div
                              className="
                                flex
                                h-9
                                items-center
                                rounded-[9px]
                                border
                                border-[#DCD2C5]
                                bg-[#FCFAF7]
                                sm:h-10
                              "
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.quantity - 1,
                                  )
                                }
                                disabled={item.quantity <= 1}
                                className="
                                  flex
                                  h-full
                                  w-8
                                  items-center
                                  justify-center
                                  text-[#81776C]
                                  transition-colors
                                  hover:text-[#302B25]
                                  disabled:cursor-not-allowed
                                  disabled:opacity-30
                                  sm:w-9
                                "
                              >
                                <Minus
                                  size={12}
                                  strokeWidth={1.5}
                                />
                              </button>

                              <span
                                className="
                                  min-w-6
                                  text-center
                                  text-[11px]
                                  font-semibold
                                  text-[#302B25]
                                "
                              >
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    Math.min(
                                      item.quantity + 1,
                                      maxStock,
                                    ),
                                  )
                                }
                                disabled={
                                  item.quantity >= maxStock
                                }
                                className="
                                  flex
                                  h-full
                                  w-8
                                  items-center
                                  justify-center
                                  text-[#81776C]
                                  transition-colors
                                  hover:text-[#302B25]
                                  disabled:cursor-not-allowed
                                  disabled:opacity-30
                                  sm:w-9
                                "
                              >
                                <Plus
                                  size={12}
                                  strokeWidth={1.5}
                                />
                              </button>
                            </div>
                          </div>

                          {/* Price */}

                          <div className="text-right">
                            <p
                              className="
                                text-[7px]
                                font-semibold
                                uppercase
                                tracking-[0.16em]
                                text-[#A0988D]
                                sm:text-[8px]
                              "
                            >
                              Total
                            </p>

                            <p
                              className="
                                mt-0.5
                                text-[15px]
                                font-semibold
                                tracking-[-0.02em]
                                text-[#302B25]
                                sm:text-[18px]
                              "
                            >
                              ₹
                              {(
                                item.price * item.quantity
                              ).toLocaleString("en-IN")}
                            </p>

                            {item.quantity > 1 && (
                              <p className="mt-0.5 text-[8px] text-[#978D82] sm:text-[9px]">
                                ₹
                                {item.price.toLocaleString(
                                  "en-IN",
                                )}{" "}
                                each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Continue shopping */}

            <button
              type="button"
              onClick={() => navigate("/products")}
              className="
                group
                mt-6
                flex
                items-center
                gap-2
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-[#6E6255]
                transition-colors
                hover:text-[#9A7138]
              "
            >
              <ArrowLeft
                size={14}
                strokeWidth={1.4}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />

              Continue Shopping
            </button>
          </section>

          {/* =================================================
              ORDER SUMMARY
          ================================================= */}

          <aside
            className="
              relative
              overflow-hidden
              rounded-[22px]
              border
              border-[#DCD1C4]
              bg-[#F4EDE3]
              p-5
              shadow-[0_14px_50px_rgba(68,51,34,0.05)]
              sm:p-6
              lg:sticky
              lg:top-24
            "
          >
            {/* Decorative number */}

            <span
              className="
                pointer-events-none
                absolute
                -right-2
                -top-8
                font-serif
                text-[100px]
                leading-none
                text-[#B7894A]/[0.07]
              "
            >
              02
            </span>

            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="h-px w-5 bg-[#B7894A]" />

                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.25em]
                    text-[#A4773E]
                  "
                >
                  Order Summary
                </p>
              </div>

              <h2
                className="
                  mt-2
                  font-serif
                  text-[27px]
                  leading-tight
                  tracking-tight
                  text-[#302B25]
                  sm:text-[30px]
                "
              >
                Your Selection
              </h2>

              {/* Price breakdown */}

              <div
                className="
                  mt-6
                  space-y-3
                  border-b
                  border-[#D8CCBE]
                  pb-5
                "
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#81776C]">
                    Subtotal
                  </span>

                  <span className="font-medium text-[#302B25]">
                    ₹
                    {subtotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#81776C]">
                    Delivery
                  </span>

                  <span className="font-medium text-[#302B25]">
                    {shipping === 0
                      ? "Free"
                      : `₹${shipping.toLocaleString(
                          "en-IN",
                        )}`}
                  </span>
                </div>
              </div>

              {/* Free delivery message */}

              {shipping > 0 && (
                <div
                  className="
                    mt-4
                    rounded-[11px]
                    border
                    border-[#E0D0BC]
                    bg-[#EEE3D4]
                    px-3
                    py-3
                  "
                >
                  <div className="flex gap-2.5">
                    <Truck
                      size={14}
                      strokeWidth={1.4}
                      className="mt-0.5 shrink-0 text-[#9A7138]"
                    />

                    <p
                      className="
                        text-[9px]
                        leading-4
                        text-[#725F49]
                      "
                    >
                      Add ₹
                      {(50000 - subtotal).toLocaleString(
                        "en-IN",
                      )}{" "}
                      more to unlock{" "}
                      <span className="font-semibold">
                        free delivery.
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* Total */}

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#7C7063]">
                    Grand Total
                  </p>

                  <p className="mt-1 text-[8px] text-[#A0988D]">
                    Inclusive of applicable taxes
                  </p>
                </div>

                <span
                  className="
                    font-serif
                    text-[27px]
                    tracking-tight
                    text-[#302B25]
                    sm:text-[30px]
                  "
                >
                  ₹
                  {total.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Checkout */}

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="
                  group
                  mt-6
                  flex
                  h-12
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-[10px]
                  bg-[#8F6B3F]
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-white
                  shadow-[0_10px_25px_rgba(143,107,63,0.18)]
                  transition-all
                  duration-300
                  hover:bg-[#795832]
                  hover:shadow-[0_14px_30px_rgba(143,107,63,0.25)]
                  active:scale-[0.99]
                "
              >
                Proceed to Checkout

                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              {/* Trust row */}

              <div className="mt-5 grid grid-cols-3 divide-x divide-[#D8CCBE] border-t border-[#D8CCBE] pt-5">
                <div className="flex flex-col items-center gap-1.5 px-2 text-center">
                  <Truck
                    size={15}
                    strokeWidth={1.25}
                    className="text-[#9A7138]"
                  />

                  <span className="text-[7px] font-semibold uppercase tracking-[0.08em] text-[#62574B]">
                    Delivery
                  </span>

                  <span className="hidden text-[7px] text-[#998E81] sm:block">
                    Safe doorstep
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1.5 px-2 text-center">
                  <ShieldCheck
                    size={15}
                    strokeWidth={1.25}
                    className="text-[#9A7138]"
                  />

                  <span className="text-[7px] font-semibold uppercase tracking-[0.08em] text-[#62574B]">
                    Secure
                  </span>

                  <span className="hidden text-[7px] text-[#998E81] sm:block">
                    Safe checkout
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1.5 px-2 text-center">
                  <Sparkles
                    size={15}
                    strokeWidth={1.25}
                    className="text-[#9A7138]"
                  />

                  <span className="text-[7px] font-semibold uppercase tracking-[0.08em] text-[#62574B]">
                    Support
                  </span>

                  <span className="hidden text-[7px] text-[#998E81] sm:block">
                    Expert assistance
                  </span>
                </div>
              </div>

              {/* Bottom note */}

              <div className="mt-5 flex items-center justify-center gap-2 text-[7px] uppercase tracking-[0.13em] text-[#95897C]">
                <span className="h-1 w-1 rounded-full bg-[#B7894A]" />
                Curated for beautiful living
                <span className="h-1 w-1 rounded-full bg-[#B7894A]" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Cart;