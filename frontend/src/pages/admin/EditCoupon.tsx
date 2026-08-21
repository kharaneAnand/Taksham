import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  Gift,
  Loader2,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import type {
  CouponDiscountType,
  UpdateCouponPayload,
} from "../../types/coupon";

import {
  getCouponById,
  updateCoupon,
} from "../../api/coupon.api";

/* ========================================
 * HELPERS
 * ======================================== */

const formatDateTimeLocal = (
  dateValue: string | Date,
) => {
  const date =
    new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

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

/* ========================================
 * COMPONENT
 * ======================================== */

const EditCoupon = () => {
  const navigate =
    useNavigate();

  const { id } =
    useParams<{
      id: string;
    }>();

  /* ========================================
   * LOADING
   * ======================================== */

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

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
  ] = useState("");

  const [
    endDate,
    setEndDate,
  ] = useState("");

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
   * FETCH COUPON
   * ======================================== */

  useEffect(() => {
    if (!id) {
      toast.error(
        "Coupon ID is missing",
      );

      navigate(
        "/admin/offers",
      );

      return;
    }

    const fetchCoupon =
      async () => {
        try {
          setLoading(true);

          const coupon =
            await getCouponById(
              id,
            );

          setCode(
            coupon.code || "",
          );

          setDescription(
            coupon.description || "",
          );

          setDiscountType(
            coupon.discountType,
          );

          setDiscountValue(
            String(
              coupon.discountValue,
            ),
          );

          setMinimumOrderAmount(
            String(
              coupon.minimumOrderAmount ??
                0,
            ),
          );

          setMaximumDiscountAmount(
            coupon.maximumDiscountAmount !==
              undefined
              ? String(
                  coupon.maximumDiscountAmount,
                )
              : "",
          );

          setStartDate(
            formatDateTimeLocal(
              coupon.startDate,
            ),
          );

          setEndDate(
            formatDateTimeLocal(
              coupon.endDate,
            ),
          );

          setUsageLimit(
            coupon.usageLimit !==
              undefined
              ? String(
                  coupon.usageLimit,
                )
              : "",
          );

          setIsActive(
            coupon.isActive,
          );
        } catch (error) {
          console.error(
            "Failed to load coupon:",
            error,
          );

          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load coupon",
          );

          navigate(
            "/admin/offers",
          );
        } finally {
          setLoading(false);
        }
      };

    void fetchCoupon();
  }, [
    id,
    navigate,
  ]);

  /* ========================================
   * SUBMIT
   * ======================================== */

  const handleSubmit = async (
    event: React.FormEvent<
      HTMLFormElement
    >,
  ) => {
    event.preventDefault();

    if (!id) {
      toast.error(
        "Coupon ID is missing",
      );

      return;
    }

    const normalizedCode =
      code
        .trim()
        .toUpperCase();

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
      Number(
        minimumOrderAmount || 0,
      );

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

    let parsedMaximumDiscountAmount:
      | number
      | undefined;

    if (
      discountType ===
        "percentage" &&
      maximumDiscountAmount.trim()
    ) {
      const value =
        Number(
          maximumDiscountAmount,
        );

      if (
        !Number.isFinite(value) ||
        value <= 0
      ) {
        toast.error(
          "Enter a valid maximum discount amount",
        );

        return;
      }

      parsedMaximumDiscountAmount =
        value;
    }

    let parsedUsageLimit:
      | number
      | undefined;

    if (
      usageLimit.trim()
    ) {
      const value =
        Number(usageLimit);

      if (
        !Number.isInteger(value) ||
        value < 1
      ) {
        toast.error(
          "Usage limit must be at least 1",
        );

        return;
      }

      parsedUsageLimit =
        value;
    }

    if (
      !startDate ||
      !endDate
    ) {
      toast.error(
        "Start and end dates are required",
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
      ) ||
      Number.isNaN(
        parsedEndDate.getTime(),
      )
    ) {
      toast.error(
        "Enter valid dates",
      );

      return;
    }

    if (
      parsedEndDate <=
      parsedStartDate
    ) {
      toast.error(
        "End date must be after start date",
      );

      return;
    }

    const payload:
      UpdateCouponPayload = {
        code:
          normalizedCode,

        description:
          description.trim() ||
          undefined,

        discountType,

        discountValue:
          parsedDiscountValue,

        minimumOrderAmount:
          parsedMinimumOrderAmount,

        maximumDiscountAmount:
          parsedMaximumDiscountAmount,

        startDate:
          parsedStartDate.toISOString(),

        endDate:
          parsedEndDate.toISOString(),

        usageLimit:
          parsedUsageLimit,

        isActive,
      };

    try {
      setSubmitting(true);

      await updateCoupon(
        id,
        payload,
      );

      toast.success(
        "Coupon updated successfully",
      );

      navigate(
        "/admin/offers",
      );
    } catch (error) {
      console.error(
        "Failed to update coupon:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update coupon",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ========================================
   * LOADING STATE
   * ======================================== */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <Loader2
            size={20}
            className="animate-spin"
          />

          Loading coupon...
        </div>
      </div>
    );
  }

  /* ========================================
   * UI
   * ======================================== */

  return (
    <div className="mx-auto max-w-7xl">

      {/* ========================================
       * HEADER
       * ======================================== */}

      <div className="mb-8 flex flex-col gap-5 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/admin/offers",
              )
            }
            className="mb-5 inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-neutral-900"
          >
            <ArrowLeft size={17} />

            Back to Offers & Coupons
          </button>

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-neutral-900 text-white">
              <Gift size={20} />
            </div>

            <div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Marketing
              </p>

              <h1 className="mt-1 text-3xl font-semibold text-neutral-900">
                Edit Coupon
              </h1>

            </div>

          </div>

        </div>

        <p className="max-w-md text-sm leading-6 text-neutral-500">
          Update coupon details, discount rules,
          validity period, usage limits and status.
        </p>

      </div>

      {/* ========================================
       * FORM
       * ======================================== */}

      <form
        onSubmit={
          handleSubmit
        }
        className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
      >

        {/* ========================================
         * LEFT
         * ======================================== */}

        <div className="space-y-6">

          {/* ========================================
           * BASIC DETAILS
           * ======================================== */}

          <section className="rounded-xl border border-neutral-200 bg-white p-6">

            <div>

              <h2 className="text-lg font-semibold text-neutral-900">
                Basic Details
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Set the coupon code and optional description.
              </p>

            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div>

                <label
                  htmlFor="code"
                  className="mb-2 block text-sm font-medium text-neutral-700"
                >
                  Coupon Code
                </label>

                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(event) =>
                    setCode(
                      event.target.value
                        .toUpperCase(),
                    )
                  }
                  placeholder="SUMMER20"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm font-medium tracking-wide text-neutral-900 outline-none transition focus:border-neutral-900"
                />

              </div>

              <div className="flex items-end">

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">

                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(event) =>
                      setIsActive(
                        event.target.checked,
                      )
                    }
                    className="h-4 w-4 rounded border-neutral-300"
                  />

                  <span>
                    Coupon is active
                  </span>

                </label>

              </div>

            </div>

            <div className="mt-5">

              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value,
                  )
                }
                rows={4}
                placeholder="Optional description for this coupon"
                className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
              />

            </div>

          </section>

          {/* ========================================
           * DISCOUNT
           * ======================================== */}

          <section className="rounded-xl border border-neutral-200 bg-white p-6">

            <div>

              <h2 className="text-lg font-semibold text-neutral-900">
                Discount Rules
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Configure how the coupon discount is calculated.
              </p>

            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Discount Type
                </label>

                <select
                  value={discountType}
                  onChange={(event) => {
                    const value =
                      event.target
                        .value as CouponDiscountType;

                    setDiscountType(
                      value,
                    );

                    if (
                      value === "fixed"
                    ) {
                      setMaximumDiscountAmount(
                        "",
                      );
                    }
                  }}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
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

                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Discount Value
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  max={
                    discountType ===
                    "percentage"
                      ? 100
                      : undefined
                  }
                  value={discountValue}
                  onChange={(event) =>
                    setDiscountValue(
                      event.target.value,
                    )
                  }
                  placeholder={
                    discountType ===
                    "percentage"
                      ? "20"
                      : "500"
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Minimum Order Amount
                </label>

                <input
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
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
                />

              </div>

              {discountType ===
                "percentage" && (
                  <div>

                    <label className="mb-2 block text-sm font-medium text-neutral-700">
                      Maximum Discount Amount
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        maximumDiscountAmount
                      }
                      onChange={(event) =>
                        setMaximumDiscountAmount(
                          event.target.value,
                        )
                      }
                      placeholder="Optional"
                      className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
                    />

                  </div>
                )}

            </div>

          </section>

          {/* ========================================
           * VALIDITY
           * ======================================== */}

          <section className="rounded-xl border border-neutral-200 bg-white p-6">

            <div>

              <h2 className="text-lg font-semibold text-neutral-900">
                Validity Period
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Choose when customers can use this coupon.
              </p>

            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Start Date
                </label>

                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(event) =>
                    setStartDate(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  End Date
                </label>

                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(event) =>
                    setEndDate(
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
                />

              </div>

            </div>

          </section>

          {/* ========================================
           * USAGE
           * ======================================== */}

          <section className="rounded-xl border border-neutral-200 bg-white p-6">

            <h2 className="text-lg font-semibold text-neutral-900">
              Usage Limit
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Leave empty if the coupon can be used unlimited times.
            </p>

            <div className="mt-6 max-w-md">

              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Maximum Uses
              </label>

              <input
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
                className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
              />

            </div>

          </section>

        </div>

        {/* ========================================
         * RIGHT
         * ======================================== */}

        <div className="space-y-6">

          {/* ========================================
           * PREVIEW
           * ======================================== */}

          <section className="rounded-xl border border-neutral-200 bg-white p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-900">
                <Gift size={18} />
              </div>

              <div>

                <p className="text-sm font-semibold text-neutral-900">
                  Coupon Preview
                </p>

                <p className="mt-0.5 text-xs text-neutral-500">
                  How this coupon is configured
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

              <div className="flex items-center justify-between gap-4 text-sm">

                <span className="text-neutral-500">
                  Status
                </span>

                <span
                  className={
                    isActive
                      ? "font-medium text-emerald-600"
                      : "font-medium text-red-500"
                  }
                >
                  {isActive
                    ? "Active"
                    : "Inactive"}
                </span>

              </div>

            </div>

          </section>

          {/* ========================================
           * SAVE
           * ======================================== */}

          <section className="rounded-xl border border-neutral-200 bg-white p-6">

            <button
              type="submit"
              disabled={
                submitting
              }
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {submitting && (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              )}

              {submitting
                ? "Updating Coupon..."
                : "Update Coupon"}

            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/offers",
                )
              }
              disabled={
                submitting
              }
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

export default EditCoupon;