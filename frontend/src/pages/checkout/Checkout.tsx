import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  ChevronRight,
  CreditCard,
  Gift,
  Loader2,
  MapPin,
  Package,
  ShieldCheck,
  Tag,
  Truck,
  X,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  toast,
} from "sonner";

import {
  useCart,
} from "../../context/CartContext";

import type {
  CreateOrderInput,
} from "../../types/order";

import type {
  Coupon,
} from "../../types/coupon";

import type {
  Offer,
} from "../../types/offer";

import {
  getAllCoupons,
} from "../../api/coupon.api";

import {
  getActiveOffers,
} from "../../api/offer.api";

import {
  createOrder,
  createPaymentOrder,
  verifyPayment,
} from "../../api/order.api";

/* ========================================
 * TYPES
 * ======================================== */

type ShippingMethod =
  | "standard"
  | "express";

type PaymentMethod =
  | "cod"
  | "online";

type AddressForm = {
  firstName: string;

  lastName: string;

  phone: string;

  address: string;

  landmark: string;

  city: string;

  state: string;

  pincode: string;
};

type RazorpayResponse = {
  razorpay_payment_id: string;

  razorpay_order_id: string;

  razorpay_signature: string;
};

type RazorpayInstance = {
  open: () => void;

  on: (
    event: string,
    callback: (
      response: unknown,
    ) => void,
  ) => void;
};

type RazorpayConstructor = new (
  options: {
    key: string;

    amount: number;

    currency: string;

    name: string;

    description: string;

    order_id: string;

    prefill?: {
      name?: string;

      contact?: string;
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
  },
) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

/* ========================================
 * CONSTANTS
 * ======================================== */

const RAZORPAY_KEY_ID =
  import.meta.env
    .VITE_RAZORPAY_KEY_ID ||
  "";

const RAZORPAY_SCRIPT_URL =
  "https://checkout.razorpay.com/v1/checkout.js";

const initialAddress: AddressForm =
  {
    firstName: "",

    lastName: "",

    phone: "",

    address: "",

    landmark: "",

    city: "",

    state: "",

    pincode: "",
  };

/* ========================================
 * HELPERS
 * ======================================== */

const formatCurrency = (
  value: number,
) =>
  `₹${Math.max(
    0,
    Math.round(value),
  ).toLocaleString("en-IN")}`;

const getImageUrl = (
  image?:
    | string
    | {
        url: string;
        publicId?: string;
      },
) => {
  if (!image) {
    return "";
  }

  return typeof image ===
    "string"
    ? image
    : image.url;
};

const loadRazorpayScript =
  (): Promise<boolean> => {
    return new Promise(
      (resolve) => {
        if (
          window.Razorpay
        ) {
          resolve(true);

          return;
        }

        const existingScript =
          document.querySelector<HTMLScriptElement>(
            `script[src="${RAZORPAY_SCRIPT_URL}"]`,
          );

        if (
          existingScript
        ) {
          existingScript.addEventListener(
            "load",
            () => {
              resolve(
                Boolean(
                  window.Razorpay,
                ),
              );
            },
            {
              once: true,
            },
          );

          existingScript.addEventListener(
            "error",
            () => {
              resolve(false);
            },
            {
              once: true,
            },
          );

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

/* ========================================
 * CHECKOUT COMPONENT
 * ======================================== */

const Checkout = () => {
  const navigate =
    useNavigate();

  const {
    items,
    totalItems,
    clearCart,
  } = useCart();

  /* ========================================
   * OFFER STATE
   * ======================================== */

  const [
    offers,
    setOffers,
  ] =
    useState<Offer[]>([]);

  const [
    isOffersLoading,
    setIsOffersLoading,
  ] =
    useState(true);

  /* ========================================
   * COUPON STATE
   * ======================================== */

  const [
    coupons,
    setCoupons,
  ] =
    useState<Coupon[]>([]);

  const [
    isCouponsLoading,
    setIsCouponsLoading,
  ] =
    useState(true);

  const [
    couponCode,
    setCouponCode,
  ] =
    useState("");

  const [
    selectedCoupon,
    setSelectedCoupon,
  ] =
    useState<Coupon | null>(
      null,
    );

  /* ========================================
   * CHECKOUT STATE
   * ======================================== */

  const [
    address,
    setAddress,
  ] =
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

  const [
    errors,
    setErrors,
  ] =
    useState<
      Partial<
        Record<
          keyof AddressForm,
          string
        >
      >
    >({});

  /* ========================================
   * FETCH ACTIVE OFFERS
   *
   * OFFERS ARE AUTOMATIC.
   * USER DOES NOT ENTER ANY OFFER CODE.
   * ======================================== */

  useEffect(() => {
    let cancelled = false;

    const fetchOffers =
      async () => {
        try {
          setIsOffersLoading(
            true,
          );

          const response =
            await getActiveOffers();

          if (!cancelled) {
            setOffers(
              Array.isArray(
                response,
              )
                ? response
                : [],
            );
          }
        } catch (
          error
        ) {
          console.error(
            "Failed to fetch active offers:",
            error,
          );

          if (!cancelled) {
            setOffers([]);
          }
        } finally {
          if (!cancelled) {
            setIsOffersLoading(
              false,
            );
          }
        }
      };

    void fetchOffers();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ========================================
   * FETCH COUPONS
   *
   * COUPONS ARE NOT AUTOMATICALLY APPLIED.
   * THEY ARE ONLY USED AFTER THE CUSTOMER
   * ENTERS AND APPLIES A VALID CODE.
   * ======================================== */

  useEffect(() => {
    let cancelled = false;

    const fetchCoupons =
      async () => {
        try {
          setIsCouponsLoading(
            true,
          );

          const response =
            await getAllCoupons();

          if (!cancelled) {
            setCoupons(
              Array.isArray(
                response,
              )
                ? response
                : [],
            );
          }
        } catch (
          error
        ) {
          console.error(
            "Failed to fetch coupons:",
            error,
          );

          if (!cancelled) {
            setCoupons([]);
          }
        } finally {
          if (!cancelled) {
            setIsCouponsLoading(
              false,
            );
          }
        }
      };

    void fetchCoupons();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ========================================
   * OFFER HELPERS
   * ======================================== */

  const getOfferProductIds =
    (
      offer: Offer,
    ): string[] => {
      return (
        offer.productIds ?? []
      ).map(
        (product) =>
          typeof product ===
          "string"
            ? product
            : product._id,
      );
    };

  const getOfferCollectionIds =
    (
      offer: Offer,
    ): string[] => {
      return (
        offer.collectionIds ?? []
      ).map(
        (collection) =>
          typeof collection ===
          "string"
            ? collection
            : collection._id,
      );
    };

  const getApplicableOffer =
    (
      productId: string,
      collectionId?: string,
    ): Offer | null => {
      const now =
        new Date();

      const applicableOffers =
        offers.filter(
          (offer) => {
            if (
              !offer.isActive
            ) {
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
              Number.isNaN(
                startDate.getTime(),
              ) ||
              Number.isNaN(
                endDate.getTime(),
              )
            ) {
              return false;
            }

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
              ).includes(
                productId,
              );
            }

            if (
              offer.appliesTo ===
                "collections" &&
              collectionId
            ) {
              return getOfferCollectionIds(
                offer,
              ).includes(
                collectionId,
              );
            }

            return false;
          },
        );

      if (
        applicableOffers.length ===
        0
      ) {
        return null;
      }

      /*
       * If multiple offers match,
       * use the one giving the
       * highest discount.
       */

      return applicableOffers.reduce(
        (
          bestOffer,
          currentOffer,
        ) => {
          if (
            currentOffer.discountType ===
            "percentage"
          ) {
            if (
              bestOffer.discountType ===
              "fixed"
            ) {
              return currentOffer;
            }

            return currentOffer.discountValue >
              bestOffer.discountValue
              ? currentOffer
              : bestOffer;
          }

          if (
            bestOffer.discountType ===
            "percentage"
          ) {
            return currentOffer;
          }

          return currentOffer.discountValue >
            bestOffer.discountValue
            ? currentOffer
            : bestOffer;
        },
      );
    };

  const calculateOfferDiscount =
    (
      price: number,
      offer: Offer | null,
    ) => {
      if (!offer) {
        return 0;
      }

      if (
        offer.discountType ===
        "percentage"
      ) {
        return Math.min(
          price,
          (
            price *
            offer.discountValue
          ) / 100,
        );
      }

      return Math.min(
        price,
        offer.discountValue,
      );
    };

  /* ========================================
   * CART + AUTOMATIC OFFER CALCULATIONS
   * ======================================== */

  const cartSummary =
    useMemo(() => {
      return items.map(
        (item) => {
          const productId =
            item.product._id ??
            item.product._id;

          const collectionId =
            (
              item as {
                collectionId?: string;
              }
            ).collectionId;

          const offer =
            getApplicableOffer(
              productId,
              collectionId,
            );

          const unitPrice =
            Number(
              item.price,
            ) || 0;

          const quantity =
            Number(
              item.quantity,
            ) || 0;

          const unitOfferDiscount =
            calculateOfferDiscount(
              unitPrice,
              offer,
            );

          const discountedUnitPrice =
            Math.max(
              0,
              unitPrice -
                unitOfferDiscount,
            );

          const originalTotal =
            unitPrice *
            quantity;

          const offerDiscount =
            unitOfferDiscount *
            quantity;

          const discountedTotal =
            discountedUnitPrice *
            quantity;

          return {
            item,
            offer,
            unitPrice,
            quantity,
            originalTotal,
            offerDiscount,
            discountedUnitPrice,
            discountedTotal,
          };
        },
      );
    }, [
      items,
      offers,
    ]);

  const originalSubtotal =
    useMemo(
      () =>
        cartSummary.reduce(
          (
            total,
            item,
          ) =>
            total +
            item.originalTotal,
          0,
        ),
      [cartSummary],
    );

  const offerDiscount =
    useMemo(
      () =>
        cartSummary.reduce(
          (
            total,
            item,
          ) =>
            total +
            item.offerDiscount,
          0,
        ),
      [cartSummary],
    );

  /*
   * This is the amount AFTER automatic
   * product/collection offers.
   *
   * Coupon is calculated only on this amount.
   */

  const subtotalAfterOffers =
    Math.max(
      0,
      originalSubtotal -
        offerDiscount,
    );

  /* ========================================
   * COUPON APPLY
   * ======================================== */

  const handleApplyCoupon =
    () => {
      const normalizedCode =
        couponCode
          .trim()
          .toUpperCase();

      if (
        !normalizedCode
      ) {
        toast.error(
          "Please enter a coupon code",
        );

        return;
      }

      if (
        isCouponsLoading
      ) {
        toast.error(
          "Coupons are loading. Please try again.",
        );

        return;
      }

      const coupon =
        coupons.find(
          (item) =>
            item.code
              .trim()
              .toUpperCase() ===
            normalizedCode,
        );

      if (!coupon) {
        toast.error(
          "Invalid coupon code",
        );

        return;
      }

      const now =
        new Date();

      const startDate =
        new Date(
          coupon.startDate,
        );

      const endDate =
        new Date(
          coupon.endDate,
        );

      if (
        !coupon.isActive
      ) {
        toast.error(
          "This coupon is not active",
        );

        return;
      }

      if (
        now < startDate
      ) {
        toast.error(
          "This coupon is not active yet",
        );

        return;
      }

      if (
        now > endDate
      ) {
        toast.error(
          "This coupon has expired",
        );

        return;
      }

      if (
        subtotalAfterOffers <
        (
          coupon.minimumOrderAmount ??
          0
        )
      ) {
        toast.error(
          `Minimum order amount of ${formatCurrency(
            coupon.minimumOrderAmount ??
              0,
          )} is required`,
        );

        return;
      }

      if (
        coupon.usageLimit !==
          undefined &&
        coupon.usedCount >=
          coupon.usageLimit
      ) {
        toast.error(
          "This coupon usage limit has been reached",
        );

        return;
      }

      setSelectedCoupon(
        coupon,
      );

      setCouponCode(
        coupon.code,
      );

      toast.success(
        "Coupon applied successfully",
      );
    };

  const handleRemoveCoupon =
    () => {
      setSelectedCoupon(
        null,
      );

      setCouponCode("");

      toast.success(
        "Coupon removed",
      );
    };

  /* ========================================
   * COUPON DISCOUNT
   *
   * ONLY RUNS WHEN selectedCoupon EXISTS.
   * Typing a code alone does nothing.
   * ======================================== */

  const couponDiscount =
    useMemo(() => {
      if (
        !selectedCoupon
      ) {
        return 0;
      }

      if (
        subtotalAfterOffers <
        (
          selectedCoupon.minimumOrderAmount ??
          0
        )
      ) {
        return 0;
      }

      if (
        selectedCoupon.discountType ===
        "percentage"
      ) {
        const calculatedDiscount =
          (
            subtotalAfterOffers *
            selectedCoupon.discountValue
          ) / 100;

        const maximumDiscount =
          selectedCoupon.maximumDiscountAmount;

        return Math.min(
          calculatedDiscount,
          maximumDiscount ??
            calculatedDiscount,
          subtotalAfterOffers,
        );
      }

      return Math.min(
        selectedCoupon.discountValue,
        subtotalAfterOffers,
      );
    }, [
      selectedCoupon,
      subtotalAfterOffers,
    ]);

  const amountAfterDiscounts =
    Math.max(
      0,
      subtotalAfterOffers -
        couponDiscount,
    );

  /* ========================================
   * SHIPPING
   * ======================================== */

  const shippingCost =
    shippingMethod ===
    "express"
      ? 199
      : amountAfterDiscounts >= 999
        ? 0
        : 99;

  /* ========================================
   * FINAL TOTAL
   * ======================================== */

  const estimatedTotal =
    Math.max(
      0,
      amountAfterDiscounts +
        shippingCost,
    );

  const totalSavings =
    offerDiscount +
    couponDiscount;

  /* ========================================
   * EMPTY CART
   * ======================================== */

  if (
    items.length === 0
  ) {
    return (
      <main
        className="
          min-h-screen
          bg-[#F8F5F0]
          px-5
          py-20
          sm:px-8
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-xl
            flex-col
            items-center
            justify-center
            rounded-[28px]
            border
            border-[#E4D8CA]
            bg-[#FFFCF8]
            px-6
            py-16
            text-center
            shadow-[0_20px_60px_rgba(65,48,31,0.08)]
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
              bg-[#F2E8DB]
              text-[#9A7138]
            "
          >
            <Package
              size={24}
              strokeWidth={1.5}
            />
          </div>

          <h1
            className="
              mt-6
              font-serif
              text-[30px]
              text-[#332D27]
            "
          >
            Your cart is empty
          </h1>

          <p
            className="
              mt-3
              max-w-sm
              text-[11px]
              leading-6
              text-[#84796D]
            "
          >
            Add something beautiful
            to your cart before
            proceeding to checkout.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/products",
              )
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

  /* ========================================
   * ADDRESS
   * ======================================== */

  const handleAddressChange =
    (
      field: keyof AddressForm,
      value: string,
    ) => {
      setAddress(
        (
          currentAddress,
        ) => ({
          ...currentAddress,
          [field]: value,
        }),
      );

      if (
        errors[field]
      ) {
        setErrors(
          (
            currentErrors,
          ) => ({
            ...currentErrors,
            [field]: undefined,
          }),
        );
      }
    };

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

      setErrors(
        nextErrors,
      );

      return (
        Object.keys(
          nextErrors,
        ).length === 0
      );
    };

  /* ========================================
   * RAZORPAY
   * ======================================== */

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
          "Razorpay Key ID is not configured.",
        );
      }

      const isLoaded =
        await loadRazorpayScript();

      if (
        !isLoaded ||
        !window.Razorpay
      ) {
        throw new Error(
          "Razorpay Checkout could not be loaded. Please check your internet connection and try again.",
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
            name:
              `${address.firstName.trim()} ${address.lastName.trim()}`,

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
              } catch (
                error
              ) {
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
            "Payment failed:",
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

  /* ========================================
   * PLACE ORDER
   *
   * couponCode is sent ONLY if the customer
   * manually applied a coupon.
   *
   * Offers are automatic and the backend
   * must calculate eligible offers again.
   * ======================================== */

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

            ...(selectedCoupon
              ? {
                  couponCode:
                    selectedCoupon.code
                      .trim()
                      .toUpperCase(),
                }
              : {}),
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
      } catch (
        error
      ) {
        console.error(
          "Failed to place order:",
          error,
        );

        toast.error(
          error instanceof
            Error
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
        bg-[#F8F5F0]
        pb-16
      "
    >
      <div
        className="
          mx-auto
          max-w-350
          px-4
          py-8
          sm:px-6
          lg:px-8
          lg:py-10
        "
      >
        {/* ====================================
         * HEADER
         * ==================================== */}

        <div
          className="
            mb-8
            flex
            items-end
            justify-between
            gap-4
            border-b
            border-[#DED4C8]
            pb-5
          "
        >
          <div>
            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.24em]
                text-[#A4773E]
              "
            >
              Secure Checkout
            </p>

            <h1
              className="
                mt-2
                font-serif
                text-[30px]
                text-[#2F2923]
                sm:text-[36px]
              "
            >
              Complete your order
            </h1>
          </div>

          <div
            className="
              hidden
              items-center
              gap-2
              text-[9px]
              text-[#81776C]
              sm:flex
            "
          >
            <Package
              size={14}
            />

            {totalItems} item
            {totalItems !== 1
              ? "s"
              : ""}
          </div>
        </div>

        <div
          className="
            grid
            gap-7
            lg:grid-cols-[minmax(0,1fr)_420px]
          "
        >
          {/* ====================================
           * LEFT
           * ==================================== */}

          <div
            className="
              space-y-6
            "
          >
            {/* DELIVERY ADDRESS */}

            <section
              className="
                rounded-[22px]
                border
                border-[#E2D8CC]
                bg-[#FFFCF8]
                p-5
                shadow-[0_8px_30px_rgba(70,50,30,0.035)]
                sm:p-6
              "
            >
              <div
                className="
                  mb-5
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F2E7D8]
                    text-[#9A7138]
                  "
                >
                  <MapPin
                    size={16}
                  />
                </div>

                <div>
                  <h2
                    className="
                      text-[13px]
                      font-semibold
                      text-[#332D27]
                    "
                  >
                    Delivery Address
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-[9px]
                      text-[#93877A]
                    "
                  >
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              <div
                className="
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
                    <label
                      key={field}
                      className="
                        block
                      "
                    >
                      <span
                        className="
                          mb-1.5
                          block
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-[0.12em]
                          text-[#7C7166]
                        "
                      >
                        {label}
                      </span>

                      <input
                        type={
                          field ===
                          "phone"
                            ? "tel"
                            : "text"
                        }
                        value={
                          address[field]
                        }
                        onChange={(
                          event,
                        ) =>
                          handleAddressChange(
                            field,
                            event.target
                              .value,
                          )
                        }
                        className={`
                          h-11
                          w-full
                          rounded-lg
                          border
                          bg-[#FFFEFC]
                          px-3
                          text-[11px]
                          text-[#302B25]
                          outline-none
                          transition
                          ${
                            errors[
                              field
                            ]
                              ? "border-red-400"
                              : "border-[#DDD2C5] focus:border-[#A4773E]"
                          }
                        `}
                      />

                      {errors[
                        field
                      ] && (
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
                    </label>
                  ),
                )}

                <label
                  className="
                    block
                    sm:col-span-2
                  "
                >
                  <span
                    className="
                      mb-1.5
                      block
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-[#7C7166]
                    "
                  >
                    Full Address
                  </span>

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
                    rows={3}
                    className={`
                      w-full
                      resize-none
                      rounded-lg
                      border
                      bg-[#FFFEFC]
                      px-3
                      py-3
                      text-[11px]
                      text-[#302B25]
                      outline-none
                      transition
                      ${
                        errors.address
                          ? "border-red-400"
                          : "border-[#DDD2C5] focus:border-[#A4773E]"
                      }
                    `}
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
                </label>

                <label
                  className="
                    block
                    sm:col-span-2
                  "
                >
                  <span
                    className="
                      mb-1.5
                      block
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-[#7C7166]
                    "
                  >
                    Landmark
                    <span
                      className="
                        ml-1
                        normal-case
                        tracking-normal
                        text-[#A79C90]
                      "
                    >
                      (Optional)
                    </span>
                  </span>

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
                      rounded-lg
                      border
                      border-[#DDD2C5]
                      bg-[#FFFEFC]
                      px-3
                      text-[11px]
                      text-[#302B25]
                      outline-none
                      transition
                      focus:border-[#A4773E]
                    "
                  />
                </label>
              </div>
            </section>

            {/* SHIPPING */}

            <section
              className="
                rounded-[22px]
                border
                border-[#E2D8CC]
                bg-[#FFFCF8]
                p-5
                shadow-[0_8px_30px_rgba(70,50,30,0.035)]
                sm:p-6
              "
            >
              <div
                className="
                  mb-5
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F2E7D8]
                    text-[#9A7138]
                  "
                >
                  <Truck
                    size={16}
                  />
                </div>

                <div>
                  <h2
                    className="
                      text-[13px]
                      font-semibold
                      text-[#332D27]
                    "
                  >
                    Shipping Method
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-[9px]
                      text-[#93877A]
                    "
                  >
                    Choose how quickly you want your order.
                  </p>
                </div>
              </div>

              <div
                className="
                  grid
                  gap-3
                  sm:grid-cols-2
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
                    rounded-xl
                    border
                    p-4
                    text-left
                    transition
                    ${
                      shippingMethod ===
                      "standard"
                        ? "border-[#A4773E] bg-[#FBF5ED]"
                        : "border-[#DED4C8] bg-white hover:border-[#C7B49E]"
                    }
                  `}
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <span
                      className="
                        text-[10px]
                        font-semibold
                        text-[#332D27]
                      "
                    >
                      Standard Delivery
                    </span>

                    {shippingMethod ===
                      "standard" && (
                      <Check
                        size={15}
                        className="
                          text-[#A4773E]
                        "
                      />
                    )}
                  </div>

                  <p
                    className="
                      mt-2
                      text-[9px]
                      text-[#8B8074]
                    "
                  >
                    Free above ₹999
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShippingMethod(
                      "express",
                    )
                  }
                  className={`
                    rounded-xl
                    border
                    p-4
                    text-left
                    transition
                    ${
                      shippingMethod ===
                      "express"
                        ? "border-[#A4773E] bg-[#FBF5ED]"
                        : "border-[#DED4C8] bg-white hover:border-[#C7B49E]"
                    }
                  `}
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <span
                      className="
                        text-[10px]
                        font-semibold
                        text-[#332D27]
                      "
                    >
                      Express Delivery
                    </span>

                    {shippingMethod ===
                      "express" && (
                      <Check
                        size={15}
                        className="
                          text-[#A4773E]
                        "
                      />
                    )}
                  </div>

                  <p
                    className="
                      mt-2
                      text-[9px]
                      text-[#8B8074]
                    "
                  >
                    ₹199 · Faster delivery
                  </p>
                </button>
              </div>
            </section>

            {/* PAYMENT */}

            <section
              className="
                rounded-[22px]
                border
                border-[#E2D8CC]
                bg-[#FFFCF8]
                p-5
                shadow-[0_8px_30px_rgba(70,50,30,0.035)]
                sm:p-6
              "
            >
              <div
                className="
                  mb-5
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F2E7D8]
                    text-[#9A7138]
                  "
                >
                  <CreditCard
                    size={16}
                  />
                </div>

                <div>
                  <h2
                    className="
                      text-[13px]
                      font-semibold
                      text-[#332D27]
                    "
                  >
                    Payment Method
                  </h2>

                  <p
                    className="
                      mt-0.5
                      text-[9px]
                      text-[#93877A]
                    "
                  >
                    Choose your preferred payment method.
                  </p>
                </div>
              </div>

              <div
                className="
                  grid
                  gap-3
                  sm:grid-cols-2
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
                    rounded-xl
                    border
                    p-4
                    text-left
                    transition
                    ${
                      paymentMethod ===
                      "cod"
                        ? "border-[#A4773E] bg-[#FBF5ED]"
                        : "border-[#DED4C8] bg-white hover:border-[#C7B49E]"
                    }
                  `}
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <span
                      className="
                        text-[10px]
                        font-semibold
                        text-[#332D27]
                      "
                    >
                      Cash on Delivery
                    </span>

                    {paymentMethod ===
                      "cod" && (
                      <Check
                        size={15}
                        className="
                          text-[#A4773E]
                        "
                      />
                    )}
                  </div>

                  <p
                    className="
                      mt-2
                      text-[9px]
                      text-[#8B8074]
                    "
                  >
                    Pay when your order arrives
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPaymentMethod(
                      "online",
                    )
                  }
                  className={`
                    rounded-xl
                    border
                    p-4
                    text-left
                    transition
                    ${
                      paymentMethod ===
                      "online"
                        ? "border-[#A4773E] bg-[#FBF5ED]"
                        : "border-[#DED4C8] bg-white hover:border-[#C7B49E]"
                    }
                  `}
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >
                    <span
                      className="
                        text-[10px]
                        font-semibold
                        text-[#332D27]
                      "
                    >
                      Pay Online
                    </span>

                    {paymentMethod ===
                      "online" && (
                      <Check
                        size={15}
                        className="
                          text-[#A4773E]
                        "
                      />
                    )}
                  </div>

                  <p
                    className="
                      mt-2
                      text-[9px]
                      text-[#8B8074]
                    "
                  >
                    Secure payment with Razorpay
                  </p>
                </button>
              </div>
            </section>
          </div>

          {/* ====================================
           * ORDER SUMMARY
           * ==================================== */}

          <aside
            className="
              h-fit
              rounded-[22px]
              border
              border-[#E0D5C8]
              bg-[#FFFCF8]
              p-5
              shadow-[0_12px_40px_rgba(65,48,31,0.06)]
              lg:sticky
              lg:top-6
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
                    text-[24px]
                    text-[#332D27]
                  "
                >
                  Your order
                </h2>
              </div>

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-[#F3E8DA]
                  text-[#9A7138]
                "
              >
                <Package
                  size={16}
                />
              </div>
            </div>

            {/* PRODUCTS */}

            <div
              className="
                mt-5
                max-h-83
                space-y-4
                overflow-y-auto
                pr-1
              "
            >
              {cartSummary.map(
                ({
                  item,
                  offer,
                  quantity,
                  originalTotal,
                  offerDiscount:
                    itemOfferDiscount,
                  discountedTotal,
                }) => {
                  const imageUrl =
                    getImageUrl(
                      item.product.image,
                    );

                  return (
                    <div
                      key={
                        item.product._id ??
                        item.product._id
                      }
                      className="
                        flex
                        gap-3
                      "
                    >
                      <div
                        className="
                          flex
                          h-14
                          w-14
                          shrink-0
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-xl
                          border
                          border-[#E5DACE]
                          bg-[#F4EFE8]
                        "
                      >
                        {imageUrl ? (
                          <img
                            src={
                              imageUrl
                            }
                            alt={
                              item.product.name
                            }
                            className="
                              h-full
                              w-full
                              object-contain
                              p-1
                            "
                          />
                        ) : (
                          <Package
                            size={18}
                            className="
                              text-[#A99C8C]
                            "
                          />
                        )}
                      </div>

                      <div
                        className="
                          min-w-0
                          flex-1
                        "
                      >
                        <p
                          className="
                            truncate
                            text-[10px]
                            font-semibold
                            text-[#332D27]
                          "
                        >
                          {item.product.name}
                        </p>

                        <p
                          className="
                            mt-1
                            text-[8px]
                            text-[#968B7F]
                          "
                        >
                          Qty: {quantity}
                        </p>

                        {offer && (
                          <div
                            className="
                              mt-1.5
                              inline-flex
                              items-center
                              gap-1
                              rounded-full
                              bg-[#EAF2E9]
                              px-2
                              py-1
                              text-[7px]
                              font-semibold
                              text-[#587154]
                            "
                          >
                            <Tag
                              size={9}
                            />

                            {offer.name}
                          </div>
                        )}

                        <div
                          className="
                            mt-2
                            flex
                            items-end
                            justify-between
                            gap-3
                          "
                        >
                          <div>
                            {itemOfferDiscount >
                              0 && (
                              <p
                                className="
                                  text-[8px]
                                  text-[#A59A8D]
                                  line-through
                                "
                              >
                                {formatCurrency(
                                  originalTotal,
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
                              {formatCurrency(
                                discountedTotal,
                              )}
                            </p>
                          </div>

                          {itemOfferDiscount >
                            0 && (
                            <p
                              className="
                                text-[8px]
                                font-medium
                                text-[#65805F]
                              "
                            >
                              Save{" "}
                              {formatCurrency(
                                itemOfferDiscount,
                              )}
                            </p>
                          )}
                        </div>
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

            {/* COUPON */}

            <div
              className="
                mt-5
                border-t
                border-[#E4D9CC]
                pt-5
              "
            >
              <div
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                "
              >
                <Gift
                  size={14}
                  className="
                    text-[#A4773E]
                  "
                />

                <p
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-[#554C43]
                  "
                >
                  Have a coupon code?
                </p>
              </div>

              {!selectedCoupon ? (
                <>
                  <div
                    className="
                      flex
                      gap-2
                    "
                  >
                    <input
                      type="text"
                      value={
                        couponCode
                      }
                      onChange={(
                        event,
                      ) =>
                        setCouponCode(
                          event.target.value
                            .toUpperCase(),
                        )
                      }
                      onKeyDown={(
                        event,
                      ) => {
                        if (
                          event.key ===
                          "Enter"
                        ) {
                          event.preventDefault();

                          handleApplyCoupon();
                        }
                      }}
                      placeholder="Enter coupon code"
                      className="
                        h-11
                        min-w-0
                        flex-1
                        rounded-lg
                        border
                        border-[#DDD2C5]
                        bg-white
                        px-3
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.06em]
                        text-[#332D27]
                        outline-none
                        placeholder:normal-case
                        placeholder:tracking-normal
                        focus:border-[#A4773E]
                      "
                    />

                    <button
                      type="button"
                      onClick={
                        handleApplyCoupon
                      }
                      disabled={
                        isCouponsLoading
                      }
                      className="
                        flex
                        h-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-[#8F6B3F]
                        px-4
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-white
                        transition
                        hover:bg-[#795832]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {isCouponsLoading ? (
                        <Loader2
                          size={13}
                          className="
                            animate-spin
                          "
                        />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>

                  <p
                    className="
                      mt-2
                      text-[8px]
                      leading-5
                      text-[#978D82]
                    "
                  >
                    Coupon discount is applied only after you enter
                    and apply a valid coupon code.
                  </p>
                </>
              ) : (
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    rounded-xl
                    border
                    border-[#BED1BB]
                    bg-[#F1F7EF]
                    px-3
                    py-3
                  "
                >
                  <div
                    className="
                      min-w-0
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-1.5
                      "
                    >
                      <Check
                        size={13}
                        className="
                          text-[#64815F]
                        "
                      />

                      <span
                        className="
                          truncate
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-widest
                          text-[#4F684B]
                        "
                      >
                        {
                          selectedCoupon.code
                        }
                      </span>
                    </div>

                    <p
                      className="
                        mt-1
                        text-[8px]
                        text-[#70816D]
                      "
                    >
                      Coupon applied successfully
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      handleRemoveCoupon
                    }
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      text-[#8A5B52]
                      transition
                      hover:bg-[#F8E8E4]
                    "
                    aria-label="Remove coupon"
                  >
                    <X
                      size={14}
                    />
                  </button>
                </div>
              )}
            </div>

            {/* TOTALS */}

            <div
              className="
                mt-5
                space-y-3
                border-b
                border-[#D8CCBE]
                pb-5
              "
            >
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
                    text-[#403931]
                  "
                >
                  {formatCurrency(
                    originalSubtotal,
                  )}
                </span>
              </div>

              {offerDiscount > 0 && (
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
                      flex
                      items-center
                      gap-1.5
                      text-[#65805F]
                    "
                  >
                    <Tag
                      size={12}
                    />

                    Product Offers
                  </span>

                  <span
                    className="
                      font-medium
                      text-[#65805F]
                    "
                  >
                    −
                    {formatCurrency(
                      offerDiscount,
                    )}
                  </span>
                </div>
              )}

              {selectedCoupon && (
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
                      flex
                      items-center
                      gap-1.5
                      text-[#65805F]
                    "
                  >
                    <Gift
                      size={12}
                    />

                    Coupon (
                    {
                      selectedCoupon.code
                    }
                    )
                  </span>

                  <span
                    className="
                      font-medium
                      text-[#65805F]
                    "
                  >
                    −
                    {formatCurrency(
                      couponDiscount,
                    )}
                  </span>
                </div>
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
                  Shipping
                </span>

                <span
                  className="
                    font-medium
                    text-[#403931]
                  "
                >
                  {shippingCost ===
                  0
                    ? "FREE"
                    : formatCurrency(
                        shippingCost,
                      )}
                </span>
              </div>

              {totalSavings > 0 && (
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-lg
                    bg-[#F1F7EF]
                    px-3
                    py-2.5
                  "
                >
                  <span
                    className="
                      text-[9px]
                      font-medium
                      text-[#5D7659]
                    "
                  >
                    Total savings
                  </span>

                  <span
                    className="
                      text-[9px]
                      font-semibold
                      text-[#587154]
                    "
                  >
                    {formatCurrency(
                      totalSavings,
                    )}
                  </span>
                </div>
              )}
            </div>

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
                    text-[#95897D]
                  "
                >
                  Total
                </p>

                <p
                  className="
                    mt-1
                    text-[9px]
                    text-[#95897D]
                  "
                >
                  Inclusive of all applicable discounts
                </p>
              </div>

              <p
                className="
                  font-serif
                  text-[28px]
                  text-[#332D27]
                "
              >
                {formatCurrency(
                  estimatedTotal,
                )}
              </p>
            </div>

            {/* PLACE ORDER */}

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
                h-13
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#6B5138]
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-white
                shadow-[0_12px_28px_rgba(91,67,43,0.18)]
                transition
                hover:bg-[#59432F]
                disabled:cursor-not-allowed
                disabled:opacity-70
              "
            >
              {isPlacingOrder ? (
                <>
                  <Loader2
                    size={15}
                    className="
                      animate-spin
                    "
                  />

                  Processing...
                </>
              ) : paymentMethod ===
                "online" ? (
                <>
                  <CreditCard
                    size={15}
                  />

                  Pay
                  {" "}
                  {formatCurrency(
                    estimatedTotal,
                  )}
                </>
              ) : (
                <>
                  <Check
                    size={15}
                  />

                  Place Order
                </>
              )}
            </button>

            <div
              className="
                mt-4
                flex
                items-center
                justify-center
                gap-2
                text-center
                text-[8px]
                leading-5
                text-[#978D82]
              "
            >
              <ShieldCheck
                size={13}
                className="
                  shrink-0
                "
              />

              Secure checkout · Product offers are automatic ·
              Coupons require a valid code
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;