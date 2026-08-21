import {
  ArrowLeft,
  Check,
  ChevronRight,
  MapPin,
  ShieldCheck,
  Sparkles,
  Truck,
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

import { useCart } from "../../context/CartContext";

import {
  getActiveOffers,
} from "../../api/offer.api";

import {
  createOrder,
  createPaymentOrder,
  verifyPayment,
} from "../../api/order.api";

import type {
  Offer,
} from "../../types/offer";

import type {
  CreateOrderInput,
} from "../../types/order";

/*
 * ========================================
 * Razorpay Global Type
 * ========================================
 */

declare global {
  interface Window {
    Razorpay?: new (
      options: RazorpayOptions,
    ) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;

  amount: number;

  currency: string;

  name: string;

  description?: string;

  order_id: string;

  prefill?: {
    name?: string;
    contact?: string;
    email?: string;
  };

  notes?: Record<
    string,
    string
  >;

  theme?: {
    color?: string;
  };

  handler: (
    response: RazorpayResponse,
  ) => void;

  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;

  razorpay_order_id: string;

  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;

  on: (
    event: string,
    handler: (
      response: unknown,
    ) => void,
  ) => void;
}

/*
 * ========================================
 * Checkout Types
 * ========================================
 */

type ShippingMethod =
  | "standard"
  | "express";

type PaymentMethod =
  | "cod"
  | "online";

interface AddressForm {
  firstName: string;

  lastName: string;

  phone: string;

  address: string;

  city: string;

  state: string;

  pincode: string;

  landmark: string;
}

/*
 * ========================================
 * Initial Address
 * ========================================
 */

const initialAddress: AddressForm = {
  firstName: "",

  lastName: "",

  phone: "",

  address: "",

  city: "",

  state: "",

  pincode: "",

  landmark: "",
};

/*
 * ========================================
 * Razorpay Configuration
 * ========================================
 */

const RAZORPAY_KEY_ID =
  String(
    import.meta.env
      .VITE_RAZORPAY_KEY_ID ||
      "",
  ).trim();

const RAZORPAY_SCRIPT_URL =
  "https://checkout.razorpay.com/v1/checkout.js";

/*
 * ========================================
 * Load Razorpay Script
 * ========================================
 */

const loadRazorpayScript =
  (): Promise<boolean> => {
    return new Promise(
      (resolve) => {
        if (
          typeof window !==
            "undefined" &&
          window.Razorpay
        ) {
          resolve(true);

          return;
        }

        const existingScript =
          document.querySelector(
            `script[src="${RAZORPAY_SCRIPT_URL}"]`,
          ) as HTMLScriptElement | null;

        if (existingScript) {
          if (
            window.Razorpay
          ) {
            resolve(true);

            return;
          }

          let settled = false;

          const cleanup =
            () => {
              existingScript.removeEventListener(
                "load",
                handleLoad,
              );

              existingScript.removeEventListener(
                "error",
                handleError,
              );
            };

          const handleLoad =
            () => {
              if (settled) {
                return;
              }

              settled = true;

              cleanup();

              resolve(
                Boolean(
                  window.Razorpay,
                ),
              );
            };

          const handleError =
            () => {
              if (settled) {
                return;
              }

              settled = true;

              cleanup();

              resolve(false);
            };

          existingScript.addEventListener(
            "load",
            handleLoad,
            {
              once: true,
            },
          );

          existingScript.addEventListener(
            "error",
            handleError,
            {
              once: true,
            },
          );

          const startedAt =
            Date.now();

          const checkLoaded =
            () => {
              if (settled) {
                return;
              }

              if (
                window.Razorpay
              ) {
                settled = true;

                cleanup();

                resolve(true);

                return;
              }

              if (
                Date.now() -
                  startedAt >
                10000
              ) {
                settled = true;

                cleanup();

                resolve(false);

                return;
              }

              window.setTimeout(
                checkLoaded,
                100,
              );
            };

          checkLoaded();

          return;
        }

        const script =
          document.createElement(
            "script",
          );

        script.src =
          RAZORPAY_SCRIPT_URL;

        script.async = true;

        script.onload =
          () => {
            resolve(
              Boolean(
                window.Razorpay,
              ),
            );
          };

        script.onerror =
          () => {
            resolve(false);
          };

        document.body.appendChild(
          script,
        );
      },
    );
  };

/*
 * ========================================
 * Checkout Component
 * ========================================
 */

const Checkout = () => {
  const navigate =
    useNavigate();

  const {
    items,
    totalItems,
    clearCart,
  } = useCart();

  const [offers, setOffers] =
    useState<Offer[]>([]);

  const [isOffersLoading, setIsOffersLoading] =
    useState(true);

  /*
   * ----------------------------------------
   * State
   * ----------------------------------------
   */

  const [address, setAddress] =
    useState<AddressForm>(
      initialAddress,
    );

  const [
    shippingMethod,
    setShippingMethod,
  ] =
    useState<ShippingMethod>(
      "standard",
    );

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<PaymentMethod>(
      "cod",
    );

  const [
    isPlacingOrder,
    setIsPlacingOrder,
  ] =
    useState(false);

  const [errors, setErrors] =
    useState<
      Partial<
        Record<
          keyof AddressForm,
          string
        >
      >
    >({});

  /*
   * ========================================
   * Fetch Active Offers
   * ========================================
   */

  useEffect(() => {
    let cancelled = false;

    const fetchOffers =
      async () => {
        try {
          setIsOffersLoading(true);

          const data =
            await getActiveOffers();

          if (!cancelled) {
            setOffers(data);
          }
        } catch (error) {
          console.error(
            "Failed to fetch active offers:",
            error,
          );

          if (!cancelled) {
            setOffers([]);
          }
        } finally {
          if (!cancelled) {
            setIsOffersLoading(false);
          }
        }
      };

    void fetchOffers();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * ========================================
   * OFFER HELPERS
   * ========================================
   */

  const getOfferProductIds = (
    offer: Offer,
  ): string[] => {
    return offer.productIds.map(
      (product) =>
        typeof product === "string"
          ? product
          : product._id,
    );
  };

  const getOfferCollectionIds = (
    offer: Offer,
  ): string[] => {
    return offer.collectionIds.map(
      (collection) =>
        typeof collection === "string"
          ? collection
          : collection._id,
    );
  };

  const getApplicableOffer = (
    productId: string,
    collectionId?: string,
  ): Offer | null => {
    const now = new Date();

    const applicableOffers =
      offers.filter((offer) => {
        if (!offer.isActive) {
          return false;
        }

        const startDate =
          new Date(
            offer.startDate,
          );

        const endDate =
          new Date(
            offer.endDate,
          );

        if (
          now < startDate ||
          now > endDate
        ) {
          return false;
        }

        if (
          offer.appliesTo ===
          "all"
        ) {
          return true;
        }

        if (
          offer.appliesTo ===
          "products"
        ) {
          return getOfferProductIds(
            offer,
          ).includes(productId);
        }

        if (
          offer.appliesTo ===
          "collections"
        ) {
          if (!collectionId) {
            return false;
          }

          return getOfferCollectionIds(
            offer,
          ).includes(
            collectionId,
          );
        }

        return false;
      });

    if (
      applicableOffers.length === 0
    ) {
      return null;
    }

    return applicableOffers.reduce(
      (
        bestOffer,
        currentOffer,
      ) => {
        const bestDiscount =
          bestOffer.discountType ===
          "percentage"
            ? bestOffer.discountValue
            : bestOffer.discountValue;

        const currentDiscount =
          currentOffer.discountType ===
          "percentage"
            ? currentOffer.discountValue
            : currentOffer.discountValue;

        return currentDiscount >
          bestDiscount
          ? currentOffer
          : bestOffer;
      },
    );
  };

  const getDiscountedPrice = (
    originalPrice: number,
    productId: string,
    collectionId?: string,
  ): {
    price: number;
    offer: Offer | null;
    discountAmount: number;
  } => {
    const offer =
      getApplicableOffer(
        productId,
        collectionId,
      );

    if (!offer) {
      return {
        price: originalPrice,
        offer: null,
        discountAmount: 0,
      };
    }

    let discountAmount = 0;

    if (
      offer.discountType ===
      "percentage"
    ) {
      discountAmount =
        (originalPrice *
          offer.discountValue) /
        100;
    } else {
      discountAmount =
        offer.discountValue;
    }

    discountAmount = Math.min(
      discountAmount,
      originalPrice,
    );

    const discountedPrice =
      Math.max(
        0,
        originalPrice -
          discountAmount,
      );

    return {
      price: Math.round(
        discountedPrice,
      ),
      offer,
      discountAmount:
        Math.round(
          discountAmount,
        ),
    };
  };

  /*
   * ========================================
   * CART CALCULATIONS
   * ========================================
   */

  const cartCalculations =
    useMemo(() => {
      let originalSubtotal = 0;

      let discountedSubtotal = 0;

      items.forEach((item) => {
        const originalPrice =
          item.price;

        const collectionId =
          (
            item.product as typeof item.product & {
              collectionId?: string;
            }
          ).collectionId;

        const {
          price: discountedPrice,
        } = getDiscountedPrice(
          originalPrice,
          item.product._id,
          collectionId,
        );

        originalSubtotal +=
          originalPrice *
          item.quantity;

        discountedSubtotal +=
          discountedPrice *
          item.quantity;
      });

      return {
        originalSubtotal,
        discountedSubtotal,
        totalSavings:
          originalSubtotal -
          discountedSubtotal,
      };
    }, [
      items,
      offers,
    ]);

  const subtotal =
    cartCalculations.discountedSubtotal;

  const originalSubtotal =
    cartCalculations.originalSubtotal;

  const totalSavings =
    cartCalculations.totalSavings;

  /*
   * ----------------------------------------
   * Shipping
   *
   * Delivery logic stays here exactly as
   * checkout logic.
   * ----------------------------------------
   */

  const shippingCost =
    useMemo(() => {
      if (
        shippingMethod ===
        "express"
      ) {
        return 199;
      }

      return subtotal >= 999
        ? 0
        : 99;
    }, [
      shippingMethod,
      subtotal,
    ]);

  /*
   * ----------------------------------------
   * Total
   * ----------------------------------------
   */

  const total = useMemo(
    () =>
      subtotal +
      shippingCost,
    [
      subtotal,
      shippingCost,
    ],
  );

  /*
   * ----------------------------------------
   * Empty Cart
   * ----------------------------------------
   */

  if (items.length === 0) {
    return (
      <main
        className="
          min-h-screen
          bg-[#FAF8F5]
          px-5
          py-16
          sm:px-8
          lg:px-12
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[60vh]
            max-w-3xl
            flex-col
            items-center
            justify-center
            text-center
          "
        >
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-full
              border
              border-[#DCCFC0]
              bg-[#F4EEE5]
            "
          >
            <Truck
              size={25}
              strokeWidth={1.4}
              className="text-[#A4773E]"
            />
          </div>

          <h1
            className="
              mt-6
              font-serif
              text-[34px]
              text-[#302B25]
              sm:text-[44px]
            "
          >
            Your cart is empty.
          </h1>

          <p
            className="
              mt-3
              max-w-md
              text-[12px]
              leading-6
              text-[#81776C]
            "
          >
            Add something to your cart before
            continuing to checkout.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
            className="
              mt-7
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-[#8F6B3F]
              px-6
              py-3
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.15em]
              text-white
              transition
              hover:bg-[#795832]
            "
          >
            Continue Shopping

            <ChevronRight
              size={14}
            />
          </button>
        </div>
      </main>
    );
  }

  /*
   * ----------------------------------------
   * Update Address
   * ----------------------------------------
   */

  const handleAddressChange =
    (
      field: keyof AddressForm,
      value: string,
    ) => {
      setAddress(
        (currentAddress) => ({
          ...currentAddress,
          [field]: value,
        }),
      );

      if (errors[field]) {
        setErrors(
          (currentErrors) => ({
            ...currentErrors,
            [field]: undefined,
          }),
        );
      }
    };

  /*
   * ----------------------------------------
   * Validate Address
   * ----------------------------------------
   */

  const validateAddress =
    (): boolean => {
      const nextErrors:
        Partial<
          Record<
            keyof AddressForm,
            string
          >
        > = {};

      if (
        !address.firstName.trim()
      ) {
        nextErrors.firstName =
          "First name is required";
      }

      if (
        !address.lastName.trim()
      ) {
        nextErrors.lastName =
          "Last name is required";
      }

      if (
        !address.phone.trim()
      ) {
        nextErrors.phone =
          "Phone number is required";
      }

      if (
        !address.address.trim()
      ) {
        nextErrors.address =
          "Address is required";
      }

      if (
        !address.city.trim()
      ) {
        nextErrors.city =
          "City is required";
      }

      if (
        !address.state.trim()
      ) {
        nextErrors.state =
          "State is required";
      }

      if (
        !address.pincode.trim()
      ) {
        nextErrors.pincode =
          "Pincode is required";
      }

      setErrors(nextErrors);

      return (
        Object.keys(
          nextErrors,
        ).length === 0
      );
    };

  /*
   * ----------------------------------------
   * Open Razorpay Checkout
   * ----------------------------------------
   */

  const openRazorpayCheckout =
    async (
      order: {
        _id: string;
        orderNumber: string;
      },
    ) => {
      if (
        !RAZORPAY_KEY_ID
      ) {
        throw new Error(
          "Razorpay Key ID is not configured. Check VITE_RAZORPAY_KEY_ID in the frontend .env file.",
        );
      }

      const isLoaded =
        await loadRazorpayScript();

      if (
        !isLoaded ||
        !window.Razorpay
      ) {
        throw new Error(
          "Razorpay Checkout could not be loaded. Please check your internet connection or try again.",
        );
      }

      const paymentOrder =
        await createPaymentOrder(
          order._id,
        );

      if (
        !paymentOrder
          ?.razorpayOrderId
      ) {
        throw new Error(
          "Razorpay order ID was not returned by the server.",
        );
      }

      if (
        !paymentOrder.amount
      ) {
        throw new Error(
          "Invalid Razorpay payment amount.",
        );
      }

      const razorpay =
        new window.Razorpay({
          key:
            RAZORPAY_KEY_ID,

          amount:
            paymentOrder.amount,

          currency:
            paymentOrder.currency ||
            "INR",

          name: "Taksham",

          description:
            `Order ${order.orderNumber}`,

          order_id:
            paymentOrder.razorpayOrderId,

          prefill: {
            name: `${address.firstName.trim()} ${address.lastName.trim()}`,

            contact:
              address.phone.trim(),
          },

          notes: {
            orderNumber:
              order.orderNumber,
          },

          theme: {
            color:
              "#9A7138",
          },

          handler:
            async (
              response,
            ) => {
              try {
                await verifyPayment(
                  {
                    orderId:
                      order._id,

                    razorpayPaymentId:
                      response.razorpay_payment_id,

                    razorpayOrderId:
                      response.razorpay_order_id,

                    razorpaySignature:
                      response.razorpay_signature,
                  },
                );

                clearCart();

                toast.success(
                  "Payment successful! Order placed.",
                );

                navigate(
                  `/orders/${order._id}`,
                );
              } catch (error) {
                console.error(
                  "Payment verification failed:",
                  error,
                );

                toast.error(
                  error instanceof
                    Error
                    ? error.message
                    : "Payment verification failed",
                );
              } finally {
                setIsPlacingOrder(
                  false,
                );
              }
            },

          modal: {
            ondismiss:
              () => {
                toast.error(
                  "Payment cancelled. You can try again.",
                );

                setIsPlacingOrder(
                  false,
                );
              },
          },
        });

      razorpay.on(
        "payment.failed",
        (
          response,
        ) => {
          console.error(
            "Razorpay payment failed:",
            response,
          );

          toast.error(
            "Payment failed. Please try again.",
          );

          setIsPlacingOrder(
            false,
          );
        },
      );

      razorpay.open();
    };

  /*
   * ----------------------------------------
   * Place Order
   * ----------------------------------------
   */

  const handlePlaceOrder =
    async () => {
      if (
        isPlacingOrder
      ) {
        return;
      }

      if (
        !validateAddress()
      ) {
        toast.error(
          "Please complete your delivery address.",
        );

        return;
      }

      if (
        paymentMethod ===
          "online" &&
        !RAZORPAY_KEY_ID
      ) {
        toast.error(
          "Online payment is not configured. Please check the Razorpay Key ID.",
        );

        return;
      }

      try {
        setIsPlacingOrder(
          true,
        );

        const orderData: CreateOrderInput =
          {
            shippingAddress: {
              firstName:
                address.firstName.trim(),

              lastName:
                address.lastName.trim(),

              phone:
                address.phone.trim(),

              address:
                address.address.trim(),

              city:
                address.city.trim(),

              state:
                address.state.trim(),

              pincode:
                address.pincode.trim(),

              ...(address.landmark.trim()
                ? {
                    landmark:
                      address.landmark.trim(),
                  }
                : {}),
            },

            shippingMethod,

            paymentMethod,
          };

        const order =
          await createOrder(
            orderData,
          );

        if (
          paymentMethod ===
          "cod"
        ) {
          clearCart();

          toast.success(
            "Order placed successfully!",
          );

          navigate(
            `/orders/${order._id}`,
          );

          return;
        }

        await openRazorpayCheckout(
          order,
        );
      } catch (error) {
        console.error(
          "Failed to place order:",
          error,
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to place order",
        );

        setIsPlacingOrder(
          false,
        );
      }
    };

  return (
    <main
      className="
        min-h-screen
        bg-[#FAF8F5]
        text-[#302B25]
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
          px-5
          py-8
          sm:px-8
          sm:py-10
          lg:px-12
          lg:py-12
        "
      >
        <button
          type="button"
          onClick={() =>
            navigate("/cart")
          }
          className="
            group
            mb-7
            flex
            items-center
            gap-2
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.15em]
            text-[#81776C]
            transition-colors
            hover:text-[#9A7138]
          "
        >
          <ArrowLeft
            size={14}
            strokeWidth={1.5}
            className="
              transition-transform
              duration-300
              group-hover:-translate-x-1
            "
          />

          Back to Cart
        </button>

        <div
          className="
            grid
            gap-8
            lg:grid-cols-[minmax(0,1fr)_390px]
            lg:gap-10
          "
        >
          <section>
            <div
              className="
                mb-7
                border-b
                border-[#E2D8CC]
                pb-6
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    h-px
                    w-6
                    bg-[#B7894A]
                  "
                />

                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.22em]
                    text-[#A4773E]
                  "
                >
                  Secure Checkout
                </p>
              </div>

              <h1
                className="
                  mt-3
                  font-serif
                  text-[36px]
                  tracking-[-0.04em]
                  text-[#302B25]
                  sm:text-[46px]
                "
              >
                Delivery Details
              </h1>
            </div>

            <div
              className="
                rounded-[20px]
                border
                border-[#E2D8CC]
                bg-white
                p-5
                shadow-[0_10px_35px_rgba(65,50,35,0.035)]
                sm:p-7
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <MapPin
                  size={17}
                  strokeWidth={1.4}
                  className="text-[#A4773E]"
                />

                <h2
                  className="
                    font-serif
                    text-[23px]
                    text-[#302B25]
                  "
                >
                  Delivery Address
                </h2>
              </div>

              <div
                className="
                  mt-6
                  grid
                  gap-4
                  sm:grid-cols-2
                "
              >
                {(
                  [
                    [
                      "firstName",
                      "First Name",
                    ],
                    [
                      "lastName",
                      "Last Name",
                    ],
                    [
                      "phone",
                      "Phone Number",
                    ],
                    [
                      "city",
                      "City",
                    ],
                    [
                      "state",
                      "State",
                    ],
                    [
                      "pincode",
                      "Pincode",
                    ],
                  ] as Array<
                    [
                      keyof AddressForm,
                      string,
                    ]
                  >
                ).map(
                  ([
                    field,
                    label,
                  ]) => (
                    <div
                      key={field}
                    >
                      <label
                        className="
                          mb-1.5
                          block
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-[0.14em]
                          text-[#81776C]
                        "
                      >
                        {label}
                      </label>

                      <input
                        type="text"
                        value={
                          address[field]
                        }
                        onChange={(
                          event,
                        ) =>
                          handleAddressChange(
                            field,
                            event.target.value,
                          )
                        }
                        className="
                          h-11
                          w-full
                          rounded-[10px]
                          border
                          border-[#DED4C7]
                          bg-[#FCFAF7]
                          px-3.5
                          text-[11px]
                          text-[#302B25]
                          outline-none
                          transition
                          focus:border-[#B7894A]
                          focus:ring-2
                          focus:ring-[#B7894A]/10
                        "
                      />

                      {errors[field] && (
                        <p
                          className="
                            mt-1
                            text-[8px]
                            text-red-500
                          "
                        >
                          {
                            errors[
                              field
                            ]
                          }
                        </p>
                      )}
                    </div>
                  ),
                )}

                <div
                  className="
                    sm:col-span-2
                  "
                >
                  <label
                    className="
                      mb-1.5
                      block
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.14em]
                      text-[#81776C]
                    "
                  >
                    Full Address
                  </label>

                  <textarea
                    value={
                      address.address
                    }
                    onChange={(
                      event,
                    ) =>
                      handleAddressChange(
                        "address",
                        event.target.value,
                      )
                    }
                    rows={4}
                    className="
                      w-full
                      resize-none
                      rounded-[10px]
                      border
                      border-[#DED4C7]
                      bg-[#FCFAF7]
                      px-3.5
                      py-3
                      text-[11px]
                      text-[#302B25]
                      outline-none
                      transition
                      focus:border-[#B7894A]
                      focus:ring-2
                      focus:ring-[#B7894A]/10
                    "
                  />

                  {errors.address && (
                    <p
                      className="
                        mt-1
                        text-[8px]
                        text-red-500
                      "
                    >
                      {
                        errors.address
                      }
                    </p>
                  )}
                </div>

                <div
                  className="
                    sm:col-span-2
                  "
                >
                  <label
                    className="
                      mb-1.5
                      block
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.14em]
                      text-[#81776C]
                    "
                  >
                    Landmark
                    <span
                      className="
                        ml-1
                        normal-case
                        tracking-normal
                        text-[#AAA095]
                      "
                    >
                      (Optional)
                    </span>
                  </label>

                  <input
                    type="text"
                    value={
                      address.landmark
                    }
                    onChange={(
                      event,
                    ) =>
                      handleAddressChange(
                        "landmark",
                        event.target.value,
                      )
                    }
                    className="
                      h-11
                      w-full
                      rounded-[10px]
                      border
                      border-[#DED4C7]
                      bg-[#FCFAF7]
                      px-3.5
                      text-[11px]
                      text-[#302B25]
                      outline-none
                      transition
                      focus:border-[#B7894A]
                      focus:ring-2
                      focus:ring-[#B7894A]/10
                    "
                  />
                </div>
              </div>
            </div>

            <div
              className="
                mt-6
                rounded-[20px]
                border
                border-[#E2D8CC]
                bg-white
                p-5
                shadow-[0_10px_35px_rgba(65,50,35,0.035)]
                sm:p-7
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <Truck
                  size={17}
                  strokeWidth={1.4}
                  className="text-[#A4773E]"
                />

                <h2
                  className="
                    font-serif
                    text-[23px]
                    text-[#302B25]
                  "
                >
                  Shipping Method
                </h2>
              </div>

              <div
                className="
                  mt-5
                  space-y-3
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setShippingMethod(
                      "standard",
                    )
                  }
                  className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    border
                    p-4
                    text-left
                    transition
                    ${
                      shippingMethod ===
                      "standard"
                        ? "border-[#B7894A] bg-[#FBF6EF]"
                        : "border-[#E2D8CC] hover:border-[#D1B890]"
                    }
                  `}
                >
                  <div>
                    <p
                      className="
                        text-[11px]
                        font-semibold
                        text-[#302B25]
                      "
                    >
                      Standard Delivery
                    </p>

                    <p
                      className="
                        mt-1
                        text-[9px]
                        text-[#81776C]
                      "
                    >
                      Delivered in 4–7 business days
                    </p>
                  </div>

                  <span
                    className="
                      text-[10px]
                      font-semibold
                      text-[#A4773E]
                    "
                  >
                    {subtotal >= 999
                      ? "Free"
                      : "₹99"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShippingMethod(
                      "express",
                    )
                  }
                  className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    border
                    p-4
                    text-left
                    transition
                    ${
                      shippingMethod ===
                      "express"
                        ? "border-[#B7894A] bg-[#FBF6EF]"
                        : "border-[#E2D8CC] hover:border-[#D1B890]"
                    }
                  `}
                >
                  <div>
                    <p
                      className="
                        text-[11px]
                        font-semibold
                        text-[#302B25]
                      "
                    >
                      Express Delivery
                    </p>

                    <p
                      className="
                        mt-1
                        text-[9px]
                        text-[#81776C]
                      "
                    >
                      Faster delivery where available
                    </p>
                  </div>

                  <span
                    className="
                      text-[10px]
                      font-semibold
                      text-[#A4773E]
                    "
                  >
                    ₹199
                  </span>
                </button>
              </div>
            </div>

            <div
              className="
                mt-6
                rounded-[20px]
                border
                border-[#E2D8CC]
                bg-white
                p-5
                shadow-[0_10px_35px_rgba(65,50,35,0.035)]
                sm:p-7
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <ShieldCheck
                  size={17}
                  strokeWidth={1.4}
                  className="text-[#A4773E]"
                />

                <h2
                  className="
                    font-serif
                    text-[23px]
                    text-[#302B25]
                  "
                >
                  Payment Method
                </h2>
              </div>

              <div
                className="
                  mt-5
                  space-y-3
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod(
                      "cod",
                    )
                  }
                  className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    border
                    p-4
                    text-left
                    transition
                    ${
                      paymentMethod ===
                      "cod"
                        ? "border-[#B7894A] bg-[#FBF6EF]"
                        : "border-[#E2D8CC] hover:border-[#D1B890]"
                    }
                  `}
                >
                  <div>
                    <p
                      className="
                        text-[11px]
                        font-semibold
                        text-[#302B25]
                      "
                    >
                      Cash on Delivery
                    </p>

                    <p
                      className="
                        mt-1
                        text-[9px]
                        text-[#81776C]
                      "
                    >
                      Pay when your order arrives
                    </p>
                  </div>

                  {paymentMethod ===
                    "cod" && (
                    <Check
                      size={17}
                      className="text-[#A4773E]"
                    />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod(
                      "online",
                    )
                  }
                  className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    border
                    p-4
                    text-left
                    transition
                    ${
                      paymentMethod ===
                      "online"
                        ? "border-[#B7894A] bg-[#FBF6EF]"
                        : "border-[#E2D8CC] hover:border-[#D1B890]"
                    }
                  `}
                >
                  <div>
                    <p
                      className="
                        text-[11px]
                        font-semibold
                        text-[#302B25]
                      "
                    >
                      Pay Online
                    </p>

                    <p
                      className="
                        mt-1
                        text-[9px]
                        text-[#81776C]
                      "
                    >
                      Secure payment powered by Razorpay
                    </p>
                  </div>

                  {paymentMethod ===
                    "online" && (
                    <Check
                      size={17}
                      className="text-[#A4773E]"
                    />
                  )}
                </button>
              </div>
            </div>
          </section>

          <aside
            className="
              h-fit
              overflow-hidden
              rounded-[22px]
              border
              border-[#DCD1C4]
              bg-[#F4EDE3]
              p-5
              shadow-[0_14px_50px_rgba(68,51,34,0.05)]
              lg:sticky
              lg:top-24
              sm:p-6
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <div>
                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.22em]
                    text-[#A4773E]
                  "
                >
                  Order Summary
                </p>

                <h2
                  className="
                    mt-2
                    font-serif
                    text-[29px]
                    text-[#302B25]
                  "
                >
                  Your Order
                </h2>
              </div>

              <span
                className="
                  rounded-full
                  border
                  border-[#DED1C1]
                  bg-white/70
                  px-3
                  py-1.5
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[#75695D]
                "
              >
                {totalItems} Items
              </span>
            </div>

            <div
              className="
                mt-6
                space-y-4
                border-b
                border-[#D8CCBE]
                pb-5
              "
            >
              {items.map(
                (item) => {
                  const collectionId =
                    (
                      item.product as typeof item.product & {
                        collectionId?: string;
                      }
                    ).collectionId;

                  const {
                    price: discountedPrice,
                    offer,
                  } =
                    getDiscountedPrice(
                      item.price,
                      item.product._id,
                      collectionId,
                    );

                  const itemOriginalTotal =
                    item.price *
                    item.quantity;

                  const itemDiscountedTotal =
                    discountedPrice *
                    item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="
                        flex
                        items-start
                        justify-between
                        gap-4
                      "
                    >
                      <div
                        className="min-w-0"
                      >
                        <p
                          className="
                            truncate
                            text-[10px]
                            font-medium
                            text-[#302B25]
                          "
                        >
                          {
                            item.product.name
                          }
                        </p>

                        <p
                          className="
                            mt-1
                            text-[8px]
                            text-[#81776C]
                          "
                        >
                          Qty:{" "}
                          {
                            item.quantity
                          }
                        </p>

                        {offer && (
                          <p
                            className="
                              mt-1
                              text-[8px]
                              font-medium
                              text-[#A4773E]
                            "
                          >
                            {
                              offer.name
                            }
                          </p>
                        )}
                      </div>

                      <div
                        className="
                          shrink-0
                          text-right
                        "
                      >
                        {offer && (
                          <p
                            className="
                              text-[8px]
                              text-[#A0988D]
                              line-through
                            "
                          >
                            ₹
                            {itemOriginalTotal.toLocaleString(
                              "en-IN",
                            )}
                          </p>
                        )}

                        <p
                          className="
                            mt-0.5
                            text-[10px]
                            font-semibold
                            text-[#302B25]
                          "
                        >
                          ₹
                          {itemDiscountedTotal.toLocaleString(
                            "en-IN",
                          )}
                        </p>
                      </div>
                    </div>
                  );
                },
              )}
            </div>

            {isOffersLoading && (
              <p
                className="
                  mt-3
                  text-[8px]
                  text-[#978D82]
                "
              >
                Checking available offers...
              </p>
            )}

            <div
              className="
                mt-5
                space-y-3
                border-b
                border-[#D8CCBE]
                pb-5
              "
            >
              {totalSavings > 0 && (
                <>
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      text-[11px]
                    "
                  >
                    <span
                      className="
                        text-[#81776C]
                      "
                    >
                      Original Subtotal
                    </span>

                    <span
                      className="
                        font-medium
                        text-[#81776C]
                        line-through
                      "
                    >
                      ₹
                      {originalSubtotal.toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      text-[11px]
                    "
                  >
                    <span
                      className="
                        text-[#A4773E]
                      "
                    >
                      Offer Savings
                    </span>

                    <span
                      className="
                        font-semibold
                        text-[#A4773E]
                      "
                    >
                      −₹
                      {totalSavings.toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>
                </>
              )}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  text-[11px]
                "
              >
                <span
                  className="
                    text-[#81776C]
                  "
                >
                  Subtotal
                </span>

                <span
                  className="
                    font-semibold
                    text-[#302B25]
                  "
                >
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  text-[11px]
                "
              >
                <span
                  className="
                    text-[#81776C]
                  "
                >
                  Delivery
                </span>

                <span
                  className="
                    font-medium
                    text-[#302B25]
                  "
                >
                  {shippingCost === 0
                    ? "Free"
                    : `₹${shippingCost.toLocaleString(
                        "en-IN",
                      )}`}
                </span>
              </div>
            </div>

            {totalSavings > 0 && (
              <div
                className="
                  mt-4
                  rounded-[11px]
                  border
                  border-[#DCC8AA]
                  bg-[#F7EDDF]
                  px-3
                  py-3
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <Sparkles
                    size={14}
                    strokeWidth={1.4}
                    className="
                      shrink-0
                      text-[#A4773E]
                    "
                  />

                  <p
                    className="
                      text-[9px]
                      leading-4
                      text-[#725F49]
                    "
                  >
                    Great choice! You are saving{" "}
                    <span
                      className="
                        font-semibold
                        text-[#9A7138]
                      "
                    >
                      ₹
                      {totalSavings.toLocaleString(
                        "en-IN",
                      )}
                    </span>{" "}
                    with active offers.
                  </p>
                </div>
              </div>
            )}

            <div
              className="
                mt-5
                flex
                items-end
                justify-between
              "
            >
              <div>
                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-[#7C7063]
                  "
                >
                  Grand Total
                </p>

                <p
                  className="
                    mt-1
                    text-[8px]
                    text-[#A0988D]
                  "
                >
                  Inclusive of applicable taxes
                </p>
              </div>

              <span
                className="
                  font-serif
                  text-[28px]
                  tracking-tight
                  text-[#302B25]
                "
              >
                ₹
                {total.toLocaleString(
                  "en-IN",
                )}
              </span>
            </div>

            <button
              type="button"
              onClick={
                handlePlaceOrder
              }
              disabled={
                isPlacingOrder
              }
              className="
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
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isPlacingOrder
                ? "Processing..."
                : paymentMethod ===
                    "online"
                  ? "Pay Securely"
                  : "Place Order"}

              <ChevronRight
                size={14}
                strokeWidth={1.5}
              />
            </button>

            <div
              className="
                mt-5
                flex
                items-center
                justify-center
                gap-2
                text-[7px]
                uppercase
                tracking-[0.13em]
                text-[#95897C]
              "
            >
              <ShieldCheck
                size={12}
                strokeWidth={1.4}
                className="text-[#A4773E]"
              />

              Secure checkout
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;