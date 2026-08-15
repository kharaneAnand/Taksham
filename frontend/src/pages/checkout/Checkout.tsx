import {
  ArrowLeft,
  Check,
  ChevronRight,
  MapPin,
  ShieldCheck,
  Truck,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import { useCart } from "../../context/CartContext";

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

const Checkout = () => {
  const navigate = useNavigate();

  const {
    items,
    totalItems,
    subtotal,
  } = useCart();

  const [address, setAddress] =
    useState<AddressForm>(
      initialAddress,
    );

  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>(
      "standard",
    );

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("cod");

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
   * ----------------------------------------
   * Shipping
   * ----------------------------------------
   */

  const shippingCost = useMemo(() => {
    if (shippingMethod === "express") {
      return 199;
    }

    return subtotal >= 999 ? 0 : 99;
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
      subtotal + shippingCost,
    [subtotal, shippingCost],
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
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              border
              border-[#DCCDBA]
              bg-[#F3ECE3]
              text-[#9A7138]
            "
          >
            <MapPin
              size={28}
              strokeWidth={1.3}
            />
          </div>

          <p
            className="
              mt-7
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.22em]
              text-[#A4773E]
            "
          >
            Checkout
          </p>

          <h1
            className="
              mt-3
              font-serif
              text-[38px]
              tracking-tight
              text-[#302B25]
            "
          >
            Your cart is empty.
          </h1>

          <p
            className="
              mt-4
              max-w-md
              text-[13px]
              leading-6
              text-[#81776C]
            "
          >
            Add something you love
            to your cart before
            continuing to checkout.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
            className="
              mt-8
              flex
              items-center
              gap-2
              rounded-xl
              bg-[#29251F]
              px-6
              py-3.5
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-white
              transition-all
              hover:bg-[#3A342D]
            "
          >
            Explore Products

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
   * Address Change
   * ----------------------------------------
   */

  const handleAddressChange = (
    field: keyof AddressForm,
    value: string,
  ) => {
    setAddress(
      (current) => ({
        ...current,
        [field]: value,
      }),
    );

    setErrors(
      (current) => ({
        ...current,
        [field]: undefined,
      }),
    );
  };

  /*
   * ----------------------------------------
   * Validate Address
   * ----------------------------------------
   */

  const validateAddress =
    (): boolean => {
      const newErrors: Partial<
        Record<
          keyof AddressForm,
          string
        >
      > = {};

      if (!address.firstName.trim()) {
        newErrors.firstName =
          "First name is required";
      }

      if (!address.lastName.trim()) {
        newErrors.lastName =
          "Last name is required";
      }

      if (
        !/^[6-9]\d{9}$/.test(
          address.phone.trim(),
        )
      ) {
        newErrors.phone =
          "Enter a valid 10-digit phone number";
      }

      if (!address.address.trim()) {
        newErrors.address =
          "Address is required";
      }

      if (!address.city.trim()) {
        newErrors.city =
          "City is required";
      }

      if (!address.state.trim()) {
        newErrors.state =
          "State is required";
      }

      if (
        !/^\d{6}$/.test(
          address.pincode.trim(),
        )
      ) {
        newErrors.pincode =
          "Enter a valid 6-digit pincode";
      }

      setErrors(newErrors);

      return (
        Object.keys(
          newErrors,
        ).length === 0
      );
    };

  /*
   * ----------------------------------------
   * Continue / Place Order
   * ----------------------------------------
   */

  const handlePlaceOrder = () => {
    if (!validateAddress()) {
      return;
    }

    /*
     * We are NOT creating the order yet.
     *
     * This button will be connected to
     * Order Service after the checkout UI
     * is verified.
     */

    console.log(
      "Checkout data:",
      {
        address,
        shippingMethod,
        paymentMethod,
        items,
        subtotal,
        shippingCost,
        total,
      },
    );
  };

  /*
   * ----------------------------------------
   * Render
   * ----------------------------------------
   */

  return (
    <main
      className="
        min-h-screen
        bg-[#FAF8F5]
        px-5
        py-10
        sm:px-8
        sm:py-14
        lg:px-12
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div
          className="
            border-b
            border-[#E3DBD0]
            pb-7
          "
        >
          <button
            type="button"
            onClick={() =>
              navigate("/cart")
            }
            className="
              flex
              items-center
              gap-2
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-[#7B7065]
              transition-colors
              hover:text-[#9A7138]
            "
          >
            <ArrowLeft
              size={13}
              strokeWidth={1.5}
            />

            Back to Cart
          </button>

          <div className="mt-7">
            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-[#A4773E]
              "
            >
              Secure checkout
            </p>

            <h1
              className="
                mt-2
                font-serif
                text-[40px]
                tracking-tight
                text-[#302B25]
                sm:text-[50px]
              "
            >
              Checkout
            </h1>

            <p
              className="
                mt-2
                text-[12px]
                text-[#81776C]
              "
            >
              {totalItems}{" "}
              {totalItems === 1
                ? "item"
                : "items"}{" "}
              in your order
            </p>
          </div>
        </div>

        {/* Main */}

        <div
          className="
            mt-10
            grid
            gap-10
            lg:grid-cols-[minmax(0,1fr)_390px]
            lg:items-start
          "
        >
          {/* LEFT */}

          <div className="space-y-8">
            {/* Address */}

            <section
              className="
                rounded-2xl
                border
                border-[#E3DBD0]
                bg-white
                p-5
                sm:p-7
              "
            >
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F3ECE3]
                    text-[#9A7138]
                  "
                >
                  <span
                    className="
                      text-[11px]
                      font-semibold
                    "
                  >
                    01
                  </span>
                </div>

                <div>
                  <h2
                    className="
                      font-serif
                      text-[22px]
                      text-[#302B25]
                    "
                  >
                    Delivery Address
                  </h2>

                  <p
                    className="
                      mt-1
                      text-[11px]
                      text-[#8A8178]
                    "
                  >
                    Where should we
                    deliver your order?
                  </p>
                </div>
              </div>

              <div
                className="
                  mt-7
                  grid
                  gap-4
                  sm:grid-cols-2
                "
              >
                <InputField
                  label="First Name"
                  value={
                    address.firstName
                  }
                  error={
                    errors.firstName
                  }
                  onChange={(value) =>
                    handleAddressChange(
                      "firstName",
                      value,
                    )
                  }
                />

                <InputField
                  label="Last Name"
                  value={
                    address.lastName
                  }
                  error={
                    errors.lastName
                  }
                  onChange={(value) =>
                    handleAddressChange(
                      "lastName",
                      value,
                    )
                  }
                />

                <InputField
                  label="Phone Number"
                  value={
                    address.phone
                  }
                  error={errors.phone}
                  type="tel"
                  onChange={(value) =>
                    handleAddressChange(
                      "phone",
                      value,
                    )
                  }
                />

                <InputField
                  label="Pincode"
                  value={
                    address.pincode
                  }
                  error={
                    errors.pincode
                  }
                  type="tel"
                  onChange={(value) =>
                    handleAddressChange(
                      "pincode",
                      value,
                    )
                  }
                />

                <div className="sm:col-span-2">
                  <InputField
                    label="Address"
                    value={
                      address.address
                    }
                    error={
                      errors.address
                    }
                    onChange={(value) =>
                      handleAddressChange(
                        "address",
                        value,
                      )
                    }
                  />
                </div>

                <InputField
                  label="City"
                  value={address.city}
                  error={
                    errors.city
                  }
                  onChange={(value) =>
                    handleAddressChange(
                      "city",
                      value,
                    )
                  }
                />

                <InputField
                  label="State"
                  value={address.state}
                  error={
                    errors.state
                  }
                  onChange={(value) =>
                    handleAddressChange(
                      "state",
                      value,
                    )
                  }
                />

                <div className="sm:col-span-2">
                  <InputField
                    label="Landmark (Optional)"
                    value={
                      address.landmark
                    }
                    onChange={(value) =>
                      handleAddressChange(
                        "landmark",
                        value,
                      )
                    }
                  />
                </div>
              </div>
            </section>

            {/* Shipping */}

            <section
              className="
                rounded-2xl
                border
                border-[#E3DBD0]
                bg-white
                p-5
                sm:p-7
              "
            >
              <CheckoutSectionHeader
                number="02"
                title="Shipping Method"
                description="Choose how you'd like your order delivered."
              />

              <div className="mt-7 space-y-3">
                <ShippingOption
                  selected={
                    shippingMethod ===
                    "standard"
                  }
                  title="Standard Delivery"
                  description="5–7 business days"
                  price={
                    subtotal >= 999
                      ? "FREE"
                      : "₹99"
                  }
                  icon={
                    <Truck
                      size={17}
                      strokeWidth={1.5}
                    />
                  }
                  onClick={() =>
                    setShippingMethod(
                      "standard",
                    )
                  }
                />

                <ShippingOption
                  selected={
                    shippingMethod ===
                    "express"
                  }
                  title="Express Delivery"
                  description="2–3 business days"
                  price="₹199"
                  icon={
                    <Truck
                      size={17}
                      strokeWidth={1.5}
                    />
                  }
                  onClick={() =>
                    setShippingMethod(
                      "express",
                    )
                  }
                />
              </div>
            </section>

            {/* Payment */}

            <section
              className="
                rounded-2xl
                border
                border-[#E3DBD0]
                bg-white
                p-5
                sm:p-7
              "
            >
              <CheckoutSectionHeader
                number="03"
                title="Payment Method"
                description="Choose your preferred payment method."
              />

              <div className="mt-7 space-y-3">
                <PaymentOption
                  selected={
                    paymentMethod ===
                    "cod"
                  }
                  title="Cash on Delivery"
                  description="Pay when your order arrives."
                  onClick={() =>
                    setPaymentMethod(
                      "cod",
                    )
                  }
                />

                <PaymentOption
                  selected={
                    paymentMethod ===
                    "online"
                  }
                  title="Online Payment"
                  description="UPI, cards and other secure payment methods."
                  onClick={() =>
                    setPaymentMethod(
                      "online",
                    )
                  }
                />
              </div>
            </section>
          </div>

          {/* RIGHT — ORDER SUMMARY */}

          <aside
            className="
              lg:sticky
              lg:top-24
            "
          >
            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-[#E3DBD0]
                bg-white
              "
            >
              <div className="p-5 sm:p-6">
                <h2
                  className="
                    font-serif
                    text-[24px]
                    text-[#302B25]
                  "
                >
                  Order Summary
                </h2>

                <div
                  className="
                    mt-6
                    space-y-5
                  "
                >
                  {items.map(
                    (item) => (
                      <div
                        key={item.id}
                        className="
                          flex
                          gap-3
                        "
                      >
                        <div
                          className="
                            h-16
                            w-16
                            shrink-0
                            overflow-hidden
                            rounded-lg
                            bg-[#F1ECE4]
                          "
                        >
                          <img
                            src={
                              item.variant
                                ?.images?.[0] ||
                              item.product
                                .image
                            }
                            alt={
                              item.product
                                .name
                            }
                            className="
                              h-full
                              w-full
                              object-contain
                              p-1.5
                            "
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className="
                              truncate
                              text-[12px]
                              font-medium
                              text-[#302B25]
                            "
                          >
                            {
                              item.product
                                .name
                            }
                          </p>

                          <p
                            className="
                              mt-1
                              text-[10px]
                              text-[#8A8178]
                            "
                          >
                            Qty:{" "}
                            {
                              item.quantity
                            }
                          </p>

                          {item.variant && (
                            <p
                              className="
                                mt-1
                                text-[9px]
                                text-[#A4773E]
                              "
                            >
                              {item.variant
                                .color ||
                                item.variant
                                  .material ||
                                "Variant"}
                            </p>
                          )}
                        </div>

                        <p
                          className="
                            shrink-0
                            text-[12px]
                            font-semibold
                            text-[#302B25]
                          "
                        >
                          ₹
                          {(
                            item.price *
                            item.quantity
                          ).toLocaleString(
                            "en-IN",
                          )}
                        </p>
                      </div>
                    ),
                  )}
                </div>

                <div
                  className="
                    my-6
                    h-px
                    bg-[#E9E2D9]
                  "
                />

                <div className="space-y-3">
                  <SummaryRow
                    label="Subtotal"
                    value={`₹${subtotal.toLocaleString(
                      "en-IN",
                    )}`}
                  />

                  <SummaryRow
                    label="Shipping"
                    value={
                      shippingCost === 0
                        ? "FREE"
                        : `₹${shippingCost.toLocaleString(
                            "en-IN",
                          )}`
                    }
                  />

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      justify-between
                      border-t
                      border-[#E9E2D9]
                      pt-4
                    "
                  >
                    <span
                      className="
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-widest
                        text-[#5F564D]
                      "
                    >
                      Total
                    </span>

                    <span
                      className="
                        font-serif
                        text-[24px]
                        text-[#302B25]
                      "
                    >
                      ₹
                      {total.toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    handlePlaceOrder
                  }
                  className="
                    mt-7
                    flex
                    h-12
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#29251F]
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-white
                    transition-all
                    hover:bg-[#3A342D]
                    active:scale-[0.985]
                  "
                >
                  Place Order

                  <ChevronRight
                    size={15}
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
                    text-center
                    text-[9px]
                    text-[#8A8178]
                  "
                >
                  <ShieldCheck
                    size={14}
                    strokeWidth={1.4}
                  />

                  Secure & protected
                  checkout
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

/*
 * ========================================
 * Reusable Components
 * ========================================
 */

interface InputFieldProps {
  label: string;
  value: string;
  error?: string;
  type?: string;
  onChange: (
    value: string,
  ) => void;
}

const InputField = ({
  label,
  value,
  error,
  type = "text",
  onChange,
}: InputFieldProps) => {
  return (
    <div>
      <label
        className="
          mb-2
          block
          text-[9px]
          font-semibold
          uppercase
          tracking-[0.12em]
          text-[#71675D]
        "
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className={`
          h-11
          w-full
          rounded-lg
          border
          bg-[#FCFAF7]
          px-3.5
          text-[12px]
          text-[#302B25]
          outline-none
          transition-all
          placeholder:text-[#B2A89D]
          focus:bg-white
          ${
            error
              ? "border-[#B66B5E] focus:border-[#B66B5E]"
              : "border-[#E2D9CE] focus:border-[#B99A6B]"
          }
        `}
      />

      {error && (
        <p
          className="
            mt-1.5
            text-[9px]
            text-[#B66B5E]
          "
        >
          {error}
        </p>
      )}
    </div>
  );
};

interface CheckoutSectionHeaderProps {
  number: string;
  title: string;
  description: string;
}

const CheckoutSectionHeader = ({
  number,
  title,
  description,
}: CheckoutSectionHeaderProps) => {
  return (
    <div className="flex items-start gap-4">
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-[#F3ECE3]
          text-[#9A7138]
        "
      >
        <span
          className="
            text-[11px]
            font-semibold
          "
        >
          {number}
        </span>
      </div>

      <div>
        <h2
          className="
            font-serif
            text-[22px]
            text-[#302B25]
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-1
            text-[11px]
            text-[#8A8178]
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
};

interface ShippingOptionProps {
  selected: boolean;
  title: string;
  description: string;
  price: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const ShippingOption = ({
  selected,
  title,
  description,
  price,
  icon,
  onClick,
}: ShippingOptionProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        w-full
        items-center
        gap-4
        rounded-xl
        border
        p-4
        text-left
        transition-all
        ${
          selected
            ? "border-[#B99A6B] bg-[#FAF5ED]"
            : "border-[#E4DCD2] bg-white hover:bg-[#FCFAF7]"
        }
      `}
    >
      <div
        className={`
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-full
          ${
            selected
              ? "bg-[#EADCC8] text-[#9A7138]"
              : "bg-[#F4F0EB] text-[#81776C]"
          }
        `}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="
            text-[11px]
            font-semibold
            text-[#302B25]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            text-[9px]
            text-[#8A8178]
          "
        >
          {description}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span
          className="
            text-[10px]
            font-semibold
            text-[#302B25]
          "
        >
          {price}
        </span>

        <div
          className={`
            flex
            h-4
            w-4
            items-center
            justify-center
            rounded-full
            border
            ${
              selected
                ? "border-[#9A7138] bg-[#9A7138]"
                : "border-[#CFC5B9]"
            }
          `}
        >
          {selected && (
            <Check
              size={10}
              strokeWidth={2.5}
              className="text-white"
            />
          )}
        </div>
      </div>
    </button>
  );
};

interface PaymentOptionProps {
  selected: boolean;
  title: string;
  description: string;
  onClick: () => void;
}

const PaymentOption = ({
  selected,
  title,
  description,
  onClick,
}: PaymentOptionProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        w-full
        items-center
        gap-4
        rounded-xl
        border
        p-4
        text-left
        transition-all
        ${
          selected
            ? "border-[#B99A6B] bg-[#FAF5ED]"
            : "border-[#E4DCD2] bg-white hover:bg-[#FCFAF7]"
        }
      `}
    >
      <div
        className={`
          flex
          h-4
          w-4
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          ${
            selected
              ? "border-[#9A7138] bg-[#9A7138]"
              : "border-[#CFC5B9]"
          }
        `}
      >
        {selected && (
          <div className="h-1.5 w-1.5 rounded-full bg-white" />
        )}
      </div>

      <div>
        <p
          className="
            text-[11px]
            font-semibold
            text-[#302B25]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            text-[9px]
            text-[#8A8178]
          "
        >
          {description}
        </p>
      </div>
    </button>
  );
};

interface SummaryRowProps {
  label: string;
  value: string;
}

const SummaryRow = ({
  label,
  value,
}: SummaryRowProps) => {
  return (
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
          text-[#81776C]
        "
      >
        {label}
      </span>

      <span
        className="
          text-[11px]
          font-medium
          text-[#403A33]
        "
      >
        {value}
      </span>
    </div>
  );
};

export default Checkout;