import {
  useState,
} from "react";

import {
  ArrowLeft,
  Gift,
  Loader2,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import type {
  CreateCouponPayload,
  CouponDiscountType,
} from "../../types/coupon";

import {
  createCoupon,
} from "../../api/coupon.api";

/* ========================================
 * HELPERS
 * ======================================== */

const formatDateTimeLocal = (
  date: Date,
) => {
  const pad = (
    value: number,
  ) =>
    String(value).padStart(
      2,
      "0",
    );

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1,
  )}-${pad(
    date.getDate(),
  )}T${pad(
    date.getHours(),
  )}:${pad(
    date.getMinutes(),
  )}`;
};

const getDefaultEndDate = () => {
  const date = new Date();

  date.setDate(
    date.getDate() + 7,
  );

  return formatDateTimeLocal(
    date,
  );
};

/* ========================================
 * COMPONENT
 * ======================================== */

const AddCoupon = () => {
  const navigate =
    useNavigate();

  /* ========================================
   * BASIC DETAILS
   * ======================================== */

  const [
    code,
    setCode,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  /* ========================================
   * DISCOUNT
   * ======================================== */

  const [
    discountType,
    setDiscountType,
  ] = useState<CouponDiscountType>(
    "percentage",
  );

  const [
    discountValue,
    setDiscountValue,
  ] = useState("");

  const [
    minimumOrderAmount,
    setMinimumOrderAmount,
  ] = useState("");

  const [
    maximumDiscountAmount,
    setMaximumDiscountAmount,
  ] = useState("");

  /* ========================================
   * VALIDITY
   * ======================================== */

  const [
    startDate,
    setStartDate,
  ] = useState(
    formatDateTimeLocal(
      new Date(),
    ),
  );

  const [
    endDate,
    setEndDate,
  ] = useState(
    getDefaultEndDate(),
  );

  /* ========================================
   * USAGE
   * ======================================== */

  const [
    usageLimit,
    setUsageLimit,
  ] = useState("");

  /* ========================================
   * STATUS
   * ======================================== */

  const [
    isActive,
    setIsActive,
  ] = useState(true);

  /* ========================================
   * SUBMITTING
   * ======================================== */

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  /* ========================================
   * SUBMIT
   * ======================================== */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const normalizedCode =
      code.trim().toUpperCase();

    if (!normalizedCode) {
      toast.error(
        "Coupon code is required",
      );

      return;
    }

    const parsedDiscountValue =
      Number(discountValue);

    if (
      !Number.isFinite(
        parsedDiscountValue,
      ) ||
      parsedDiscountValue <= 0
    ) {
      toast.error(
        "Enter a valid discount value",
      );

      return;
    }

    if (
      discountType ===
        "percentage" &&
      parsedDiscountValue > 100
    ) {
      toast.error(
        "Percentage discount cannot exceed 100%",
      );

      return;
    }

    const parsedMinimumOrderAmount =
      minimumOrderAmount.trim()
        ? Number(minimumOrderAmount)
        : 0;

    if (
      !Number.isFinite(
        parsedMinimumOrderAmount,
      ) ||
      parsedMinimumOrderAmount < 0
    ) {
      toast.error(
        "Enter a valid minimum order amount",
      );

      return;
    }

    const parsedMaximumDiscountAmount =
      maximumDiscountAmount.trim()
        ? Number(maximumDiscountAmount)
        : undefined;

    if (
      parsedMaximumDiscountAmount !==
        undefined &&
      (
        !Number.isFinite(
          parsedMaximumDiscountAmount,
        ) ||
        parsedMaximumDiscountAmount <= 0
      )
    ) {
      toast.error(
        "Enter a valid maximum discount amount",
      );

      return;
    }

    if (
      discountType !==
        "percentage" &&
      parsedMaximumDiscountAmount !==
        undefined
    ) {
      toast.error(
        "Maximum discount is only available for percentage coupons",
      );

      return;
    }

    const parsedUsageLimit =
      usageLimit.trim()
        ? Number(usageLimit)
        : undefined;

    if (
      parsedUsageLimit !==
        undefined &&
      (
        !Number.isInteger(
          parsedUsageLimit,
        ) ||
        parsedUsageLimit < 1
      )
    ) {
      toast.error(
        "Usage limit must be at least 1",
      );

      return;
    }

    if (
      !startDate.trim() ||
      !endDate.trim()
    ) {
      toast.error(
        "Start date and end date are required",
      );

      return;
    }

    const parsedStartDate =
      new Date(startDate);

    const parsedEndDate =
      new Date(endDate);

    if (
      Number.isNaN(
        parsedStartDate.getTime(),
      )
    ) {
      toast.error(
        "Enter a valid start date",
      );

      return;
    }

    if (
      Number.isNaN(
        parsedEndDate.getTime(),
      )
    ) {
      toast.error(
        "Enter a valid end date",
      );

      return;
    }

    if (
      parsedEndDate.getTime() <=
      parsedStartDate.getTime()
    ) {
      toast.error(
        "End date must be after start date",
      );

      return;
    }

    const payload = {
      code: normalizedCode,

      name: normalizedCode,

      description:
        description.trim() ||
        undefined,

      discountType,

      discountValue:
        parsedDiscountValue,

      appliesTo: "all" as const,

      productIds: [],

      collectionIds: [],

      minimumOrderAmount:
        parsedMinimumOrderAmount,

      startDate:
        parsedStartDate.toISOString(),

      endDate:
        parsedEndDate.toISOString(),

      isActive,
    } as CreateCouponPayload & {
      name: string;

      appliesTo:
        | "all"
        | "products"
        | "collections";

      productIds: string[];

      collectionIds: string[];
    };

    if (
      discountType ===
        "percentage" &&
      parsedMaximumDiscountAmount !==
        undefined
    ) {
      payload.maximumDiscountAmount =
        parsedMaximumDiscountAmount;
    }

    if (
      parsedUsageLimit !==
      undefined
    ) {
      payload.usageLimit =
        parsedUsageLimit;
    }

    try {
      setSubmitting(true);

      console.log(
        "Creating coupon with payload:",
        payload,
      );

      await createCoupon(
        payload,
      );

      toast.success(
        "Coupon created successfully",
      );

      navigate(
        "/admin/offers",
      );
    } catch (error) {
      console.error(
        "Failed to create coupon:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create coupon",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-8 flex flex-col gap-5 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/offers",
              )
            }
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition hover:text-neutral-900"
          >
            <ArrowLeft
              size={17}
            />

            Back to Offers & Coupons
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 text-white">
              <Gift
                size={20}
              />
            </div>

            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
                Create Coupon
              </h1>

              <p className="mt-1 text-sm text-neutral-500">
                Create a discount code customers can use during checkout.
              </p>
            </div>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
      >
        <div className="space-y-6">
          <section className="rounded-xl border border-neutral-200 bg-white p-6">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">
                Basic Details
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Give your coupon a clear code and optional description.
              </p>
            </div>

            <div className="mt-6 grid gap-5">
              <div>
                <label
                  htmlFor="code"
                  className="text-sm font-medium text-neutral-800"
                >
                  Coupon Code
                </label>

                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(event) =>
                    setCode(
                      event.target.value.toUpperCase(),
                    )
                  }
                  placeholder="WELCOME10"
                  maxLength={50}
                  className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 font-medium uppercase text-neutral-900 outline-none transition placeholder:normal-case placeholder:font-normal placeholder:text-neutral-400 focus:border-neutral-900"
                />

                <p className="mt-2 text-xs text-neutral-500">
                  Customers will enter this code at checkout.
                </p>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-neutral-800"
                >
                  Description
                  <span className="ml-1 font-normal text-neutral-400">
                    Optional
                  </span>
                </label>

                <textarea
                  id="description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  placeholder="For example: 10% off on your first order."
                  rows={4}
                  maxLength={500}
                  className="mt-2 w-full resize-none rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-6">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">
                Discount
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Choose how much discount this coupon provides.
              </p>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="discountType"
                  className="text-sm font-medium text-neutral-800"
                >
                  Discount Type
                </label>

                <select
                  id="discountType"
                  value={discountType}
                  onChange={(event) => {
                    const value =
                      event.target
                        .value as CouponDiscountType;

                    setDiscountType(value);

                    if (
                      value !==
                      "percentage"
                    ) {
                      setMaximumDiscountAmount(
                        "",
                      );
                    }
                  }}
                  className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
                >
                  <option value="percentage">
                    Percentage
                  </option>

                  <option value="fixed">
                    Fixed Amount
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="discountValue"
                  className="text-sm font-medium text-neutral-800"
                >
                  Discount Value
                </label>

                <div className="relative mt-2">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                    {discountType ===
                    "percentage"
                      ? "%"
                      : "₹"}
                  </span>

                  <input
                    id="discountValue"
                    type="number"
                    min="0"
                    step="0.01"
                    value={discountValue}
                    onChange={(event) =>
                      setDiscountValue(
                        event.target.value,
                      )
                    }
                    placeholder={
                      discountType ===
                      "percentage"
                        ? "10"
                        : "500"
                    }
                    className="w-full rounded-lg border border-neutral-200 bg-white py-3 pl-9 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="minimumOrderAmount"
                  className="text-sm font-medium text-neutral-800"
                >
                  Minimum Order Amount
                </label>

                <div className="relative mt-2">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                    ₹
                  </span>

                  <input
                    id="minimumOrderAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={minimumOrderAmount}
                    onChange={(event) =>
                      setMinimumOrderAmount(
                        event.target.value,
                      )
                    }
                    placeholder="0"
                    className="w-full rounded-lg border border-neutral-200 bg-white py-3 pl-9 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
                  />
                </div>

                <p className="mt-2 text-xs text-neutral-500">
                  Leave as 0 to allow all order amounts.
                </p>
              </div>

              <div>
                <label
                  htmlFor="maximumDiscountAmount"
                  className="text-sm font-medium text-neutral-800"
                >
                  Maximum Discount
                  <span className="ml-1 font-normal text-neutral-400">
                    Optional
                  </span>
                </label>

                <div className="relative mt-2">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                    ₹
                  </span>

                  <input
                    id="maximumDiscountAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={maximumDiscountAmount}
                    onChange={(event) =>
                      setMaximumDiscountAmount(
                        event.target.value,
                      )
                    }
                    placeholder={
                      discountType ===
                      "percentage"
                        ? "1000"
                        : "Not applicable"
                    }
                    disabled={
                      discountType !==
                      "percentage"
                    }
                    className="w-full rounded-lg border border-neutral-200 bg-white py-3 pl-9 pr-4 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
                  />
                </div>

                <p className="mt-2 text-xs text-neutral-500">
                  Available only for percentage discounts.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-6">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">
                Validity Period
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Set when this coupon becomes available and expires.
              </p>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="startDate"
                  className="text-sm font-medium text-neutral-800"
                >
                  Start Date
                </label>

                <input
                  id="startDate"
                  type="datetime-local"
                  value={startDate}
                  onChange={(event) =>
                    setStartDate(
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
                />
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="text-sm font-medium text-neutral-800"
                >
                  End Date
                </label>

                <input
                  id="endDate"
                  type="datetime-local"
                  value={endDate}
                  onChange={(event) =>
                    setEndDate(
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-6">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">
                Usage Limit
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Optionally limit how many times this coupon can be used.
              </p>
            </div>

            <div className="mt-6">
              <label
                htmlFor="usageLimit"
                className="text-sm font-medium text-neutral-800"
              >
                Maximum Total Uses
                <span className="ml-1 font-normal text-neutral-400">
                  Optional
                </span>
              </label>

              <input
                id="usageLimit"
                type="number"
                min="1"
                step="1"
                value={usageLimit}
                onChange={(event) =>
                  setUsageLimit(
                    event.target.value,
                  )
                }
                placeholder="Unlimited"
                className="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900"
              />

              <p className="mt-2 text-xs text-neutral-500">
                Leave empty if the coupon should have no usage limit.
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-neutral-200 bg-white p-6">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">
                Coupon Status
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Control whether customers can use this coupon.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setIsActive(
                  (current) =>
                    !current,
                )
              }
              className="mt-5 flex w-full items-center justify-between rounded-lg border border-neutral-200 p-4 text-left transition hover:bg-neutral-50"
            >
              <div>
                <p className="text-sm font-medium text-neutral-900">
                  Active Coupon
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  {isActive
                    ? "Available to customers."
                    : "Not available to customers."}
                </p>
              </div>

              <div
                className={`relative h-6 w-11 rounded-full transition ${
                  isActive
                    ? "bg-neutral-900"
                    : "bg-neutral-200"
                }`}
              >
                <div
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                    isActive
                      ? "left-6"
                      : "left-1"
                  }`}
                />
              </div>
            </button>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                <Gift
                  size={18}
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-neutral-900">
                  Coupon Preview
                </p>

                <p className="mt-0.5 text-xs text-neutral-500">
                  Review before creating.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-lg bg-neutral-50 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-neutral-500">
                  Code
                </p>

                <p className="mt-1 text-lg font-semibold tracking-wide text-neutral-900">
                  {code.trim()
                    ? code
                        .trim()
                        .toUpperCase()
                    : "COUPONCODE"}
                </p>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-neutral-500">
                  Discount
                </span>

                <span className="font-medium text-neutral-900">
                  {discountValue || "0"}
                  {discountType ===
                  "percentage"
                    ? "%"
                    : " ₹ off"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-neutral-500">
                  Minimum order
                </span>

                <span className="font-medium text-neutral-900">
                  ₹
                  {(
                    Number(
                      minimumOrderAmount,
                    ) || 0
                  ).toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>

              {discountType ===
                "percentage" &&
                maximumDiscountAmount && (
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-neutral-500">
                      Maximum discount
                    </span>

                    <span className="font-medium text-neutral-900">
                      ₹
                      {(
                        Number(
                          maximumDiscountAmount,
                        ) || 0
                      ).toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>
                )}

              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-neutral-500">
                  Usage
                </span>

                <span className="font-medium text-neutral-900">
                  {usageLimit.trim()
                    ? `${usageLimit} uses`
                    : "Unlimited"}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-6">
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              )}

              {submitting
                ? "Creating Coupon..."
                : "Create Coupon"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/offers",
                )
              }
              disabled={submitting}
              className="mt-3 w-full rounded-lg border border-neutral-200 px-5 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </section>
        </div>
      </form>
    </div>
  );
};

export default AddCoupon;