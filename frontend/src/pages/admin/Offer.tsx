import {
  useEffect,
  useState,
} from "react";

import {
  Calendar,
  Edit3,
  Gift,
  Loader2,
  Plus,
  Power,
  Tag,
  Trash2,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import type {
  Offer,
} from "../../types/offer";

import type {
  Coupon,
} from "../../types/coupon";

import {
  deleteOffer,
  getOffers,
  updateOffer,
} from "../../api/offer.api";

import {
  deleteCoupon,
  getAllCoupons,
  updateCoupon,
} from "../../api/coupon.api";

const formatDate = (
  value: string | Date,
) => {
  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(
    new Date(value),
  );
};

const getDiscountLabel = (
  offer: Offer,
) => {
  if (
    offer.discountType ===
    "percentage"
  ) {
    return `${offer.discountValue}% OFF`;
  }

  return `₹${offer.discountValue.toLocaleString(
    "en-IN",
  )} OFF`;
};

const getCouponDiscountLabel = (
  coupon: Coupon,
) => {
  if (
    coupon.discountType ===
    "percentage"
  ) {
    return `${coupon.discountValue}% OFF`;
  }

  return `₹${coupon.discountValue.toLocaleString(
    "en-IN",
  )} OFF`;
};

const getAppliesToLabel = (
  offer: Offer,
) => {
  switch (
    offer.appliesTo
  ) {
    case "all":
      return "All Products";

    case "products":
      return `${
        offer.productIds?.length ?? 0
      } Product${
        (offer.productIds?.length ?? 0) !== 1
          ? "s"
          : ""
      }`;

    case "collections":
      return `${
        offer.collectionIds?.length ?? 0
      } Collection${
        (offer.collectionIds?.length ?? 0) !== 1
          ? "s"
          : ""
      }`;

    default:
      return offer.appliesTo;
  }
};

type ActiveTab =
  | "offers"
  | "coupons";

const Offers = () => {
  const navigate =
    useNavigate();

  const [
    activeTab,
    setActiveTab,
  ] = useState<ActiveTab>(
    "offers",
  );

  const [
    offers,
    setOffers,
  ] = useState<Offer[]>([]);

  const [
    coupons,
    setCoupons,
  ] = useState<Coupon[]>([]);

  const [
    loadingOffers,
    setLoadingOffers,
  ] = useState(true);

  const [
    loadingCoupons,
    setLoadingCoupons,
  ] = useState(true);

  const [
    actionLoadingId,
    setActionLoadingId,
  ] = useState<string | null>(
    null,
  );

  const [
    error,
    setError,
  ] = useState("");

  /* ========================================
   * FETCH OFFERS
   * ======================================== */

  const fetchOffers =
  async () => {
    try {
      setLoadingOffers(true);
      setError("");

      const response =
        await getOffers();

      setOffers(
        Array.isArray(response)
          ? response
          : [],
      );
    } catch (err) {
      setOffers([]);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load offers",
      );
    } finally {
      setLoadingOffers(false);
    }
  };

  /* ========================================
   * FETCH COUPONS
   * ======================================== */

  const fetchCoupons =
  async () => {
    try {
      setLoadingCoupons(true);
      setError("");

      const response =
        await getAllCoupons();

        console.log(
        "Coupons response:",
        response,
      );

      setCoupons(
        Array.isArray(response)
          ? response
          : [],
      );
    } catch (err) {
      setCoupons([]);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load coupons",
      );
    } finally {
      setLoadingCoupons(false);
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchCoupons();
  }, []);

  /* ========================================
   * TOGGLE OFFER STATUS
   * ======================================== */

  const handleToggleOfferStatus =
    async (
      offer: Offer,
    ) => {
      try {
        setActionLoadingId(
          offer._id,
        );

        setError("");

        const updatedOffer =
          await updateOffer(
            offer._id,
            {
              isActive:
                !offer.isActive,
            },
          );

        setOffers(
          (currentOffers) =>
            currentOffers.map(
              (currentOffer) =>
                currentOffer._id ===
                updatedOffer._id
                  ? updatedOffer
                  : currentOffer,
            ),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update offer status",
        );
      } finally {
        setActionLoadingId(
          null,
        );
      }
    };

  /* ========================================
   * DELETE OFFER
   * ======================================== */

  const handleDeleteOffer =
    async (
      offer: Offer,
    ) => {
      const confirmed =
        window.confirm(
          `Are you sure you want to delete "${offer.name}"?`,
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoadingId(
          offer._id,
        );

        setError("");

        await deleteOffer(
          offer._id,
        );

        setOffers(
          (currentOffers) =>
            currentOffers.filter(
              (currentOffer) =>
                currentOffer._id !==
                offer._id,
            ),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete offer",
        );
      } finally {
        setActionLoadingId(
          null,
        );
      }
    };

  /* ========================================
   * TOGGLE COUPON STATUS
   * ======================================== */

  const handleToggleCouponStatus =
    async (
      coupon: Coupon,
    ) => {
      try {
        setActionLoadingId(
          coupon._id,
        );

        setError("");

        const updatedCoupon =
          await updateCoupon(
            coupon._id,
            {
              isActive:
                !coupon.isActive,
            },
          );

        setCoupons(
          (currentCoupons) =>
            currentCoupons.map(
              (currentCoupon) =>
                currentCoupon._id ===
                updatedCoupon._id
                  ? updatedCoupon
                  : currentCoupon,
            ),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update coupon status",
        );
      } finally {
        setActionLoadingId(
          null,
        );
      }
    };

  /* ========================================
   * DELETE COUPON
   * ======================================== */

  const handleDeleteCoupon =
    async (
      coupon: Coupon,
    ) => {
      const confirmed =
        window.confirm(
          `Are you sure you want to delete coupon "${coupon.code}"?`,
        );

      if (!confirmed) {
        return;
      }

      try {
        setActionLoadingId(
          coupon._id,
        );

        setError("");

        await deleteCoupon(
          coupon._id,
        );

        setCoupons(
          (currentCoupons) =>
            currentCoupons.filter(
              (currentCoupon) =>
                currentCoupon._id !==
                coupon._id,
            ),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete coupon",
        );
      } finally {
        setActionLoadingId(
          null,
        );
      }
    };

  const loading =
    activeTab === "offers"
      ? loadingOffers
      : loadingCoupons;

  const handleCreate =
    () => {
      if (
        activeTab === "offers"
      ) {
        navigate(
          "/admin/offers/add",
        );

        return;
      }

      navigate(
        "/admin/coupons/add",
      );
    };

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* ====================================
       * HEADER
       * ==================================== */}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Marketing
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-neutral-900">
            Offers & Coupons
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Create and manage product offers
            and customer coupon codes.
          </p>

        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          <Plus size={18} />

          {activeTab === "offers"
            ? "Create Offer"
            : "Create Coupon"}
        </button>

      </div>

      {/* ====================================
       * TABS
       * ==================================== */}

      <div className="flex w-fit rounded-xl border border-neutral-200 bg-white p-1">

        <button
          type="button"
          onClick={() =>
            setActiveTab(
              "offers",
            )
          }
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
            activeTab === "offers"
              ? "bg-neutral-900 text-white"
              : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
          }`}
        >
          <Gift size={17} />

          Offers

          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              activeTab === "offers"
                ? "bg-white/15 text-white"
                : "bg-neutral-100 text-neutral-500"
            }`}
          >
            {offers.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab(
              "coupons",
            )
          }
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
            activeTab === "coupons"
              ? "bg-neutral-900 text-white"
              : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
          }`}
        >
          <Tag size={17} />

          Coupons

          <span
            className={`rounded-full px-2 py-0.5 text-xs ${
              activeTab === "coupons"
                ? "bg-white/15 text-white"
                : "bg-neutral-100 text-neutral-500"
            }`}
          >
            {coupons.length}
          </span>
        </button>

      </div>

      {/* ====================================
       * ERROR
       * ==================================== */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ====================================
       * OFFER STATS
       * ==================================== */}

      {activeTab === "offers" &&
        !loadingOffers && (
          <div className="grid gap-4 sm:grid-cols-3">

            <div className="rounded-xl border border-neutral-200 bg-white p-5">

              <p className="text-sm text-neutral-500">
                Total Offers
              </p>

              <p className="mt-2 text-2xl font-semibold text-neutral-900">
                {offers.length}
              </p>

            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-5">

              <p className="text-sm text-neutral-500">
                Active Offers
              </p>

              <p className="mt-2 text-2xl font-semibold text-neutral-900">
                {
                  offers.filter(
                    (offer) =>
                      offer.isActive,
                  ).length
                }
              </p>

            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-5">

              <p className="text-sm text-neutral-500">
                Inactive Offers
              </p>

              <p className="mt-2 text-2xl font-semibold text-neutral-900">
                {
                  offers.filter(
                    (offer) =>
                      !offer.isActive,
                  ).length
                }
              </p>

            </div>

          </div>
        )}

      {/* ====================================
       * COUPON STATS
       * ==================================== */}

      {activeTab === "coupons" &&
        !loadingCoupons && (
          <div className="grid gap-4 sm:grid-cols-3">

            <div className="rounded-xl border border-neutral-200 bg-white p-5">

              <p className="text-sm text-neutral-500">
                Total Coupons
              </p>

              <p className="mt-2 text-2xl font-semibold text-neutral-900">
                {coupons.length}
              </p>

            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-5">

              <p className="text-sm text-neutral-500">
                Active Coupons
              </p>

              <p className="mt-2 text-2xl font-semibold text-neutral-900">
                {
                  coupons.filter(
                    (coupon) =>
                      coupon.isActive,
                  ).length
                }
              </p>

            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-5">

              <p className="text-sm text-neutral-500">
                Total Uses
              </p>

              <p className="mt-2 text-2xl font-semibold text-neutral-900">
                {
                  coupons.reduce(
                    (
                      total,
                      coupon,
                    ) =>
                      total +
                      coupon.usedCount,
                    0,
                  )
                }
              </p>

            </div>

          </div>
        )}

      {/* ====================================
       * LOADING
       * ==================================== */}

      {loading && (
        <div className="flex min-h-100 items-center justify-center">

          <div className="flex items-center gap-3 text-sm text-neutral-500">

            <Loader2
              size={20}
              className="animate-spin"
            />

            {activeTab === "offers"
              ? "Loading offers..."
              : "Loading coupons..."}

          </div>

        </div>
      )}

      {/* ====================================
       * OFFERS EMPTY STATE
       * ==================================== */}

      {activeTab === "offers" &&
        !loadingOffers &&
        offers.length === 0 && (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-20 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">

              <Gift
                size={25}
                className="text-neutral-500"
              />

            </div>

            <h2 className="mt-5 text-lg font-semibold text-neutral-900">
              No offers yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
              Create your first offer and start
              giving discounts to your customers.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/offers/add",
                )
              }
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              <Plus size={17} />

              Create First Offer
            </button>

          </div>
        )}

      {/* ====================================
       * COUPONS EMPTY STATE
       * ==================================== */}

      {activeTab === "coupons" &&
        !loadingCoupons &&
        coupons.length === 0 && (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-white px-6 py-20 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">

              <Tag
                size={25}
                className="text-neutral-500"
              />

            </div>

            <h2 className="mt-5 text-lg font-semibold text-neutral-900">
              No coupons yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
              Create a coupon code that customers
              can apply during checkout.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/coupons/add",
                )
              }
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              <Plus size={17} />

              Create First Coupon
            </button>

          </div>
        )}

      {/* ====================================
       * OFFERS LIST
       * ==================================== */}

      {activeTab === "offers" &&
        !loadingOffers &&
        offers.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">

            <div className="divide-y divide-neutral-100">

              {offers.map(
                (offer) => {
                  const isActionLoading =
                    actionLoadingId ===
                    offer._id;

                  return (
                    <div
                      key={
                        offer._id
                      }
                      className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between lg:p-6"
                    >

                      <div className="flex min-w-0 items-start gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100">

                          <Gift
                            size={21}
                            className="text-neutral-600"
                          />

                        </div>

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h2 className="truncate text-base font-semibold text-neutral-900">
                              {
                                offer.name
                              }
                            </h2>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                offer.isActive
                                  ? "bg-green-50 text-green-700"
                                  : "bg-neutral-100 text-neutral-500"
                              }`}
                            >
                              {offer.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>

                          </div>

                          {offer.description && (
                            <p className="mt-1 max-w-xl truncate text-sm text-neutral-500">
                              {
                                offer.description
                              }
                            </p>
                          )}

                          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-neutral-500">

                            <span className="font-semibold text-neutral-900">
                              {getDiscountLabel(
                                offer,
                              )}
                            </span>

                            <span>
                              {
                                getAppliesToLabel(
                                  offer,
                                )
                              }
                            </span>

                            <span className="flex items-center gap-1.5">

                              <Calendar
                                size={13}
                              />

                              {formatDate(
                                offer.startDate,
                              )}

                              {" — "}

                              {formatDate(
                                offer.endDate,
                              )}

                            </span>

                          </div>

                        </div>

                      </div>

                      <div className="flex shrink-0 items-center gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleOfferStatus(
                              offer,
                            )
                          }
                          disabled={
                            isActionLoading
                          }
                          title={
                            offer.isActive
                              ? "Deactivate offer"
                              : "Activate offer"
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isActionLoading ? (
                            <Loader2
                              size={17}
                              className="animate-spin"
                            />
                          ) : (
                            <Power
                              size={17}
                            />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin/offers/${offer._id}/edit`,
                            )
                          }
                          disabled={
                            isActionLoading
                          }
                          title="Edit offer"
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Edit3
                            size={17}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteOffer(
                              offer,
                            )
                          }
                          disabled={
                            isActionLoading
                          }
                          title="Delete offer"
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-100 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2
                            size={17}
                          />
                        </button>

                      </div>

                    </div>
                  );
                },
              )}

            </div>

          </div>
        )}

      {/* ====================================
       * COUPONS LIST
       * ==================================== */}

      {activeTab === "coupons" &&
        !loadingCoupons &&
        coupons.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">

            <div className="divide-y divide-neutral-100">

              {coupons.map(
                (coupon) => {
                  const isActionLoading =
                    actionLoadingId ===
                    coupon._id;

                  return (
                    <div
                      key={
                        coupon._id
                      }
                      className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between lg:p-6"
                    >

                      <div className="flex min-w-0 items-start gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100">

                          <Tag
                            size={21}
                            className="text-neutral-600"
                          />

                        </div>

                        <div className="min-w-0">

                          <div className="flex flex-wrap items-center gap-2">

                            <h2 className="font-mono text-base font-semibold tracking-wide text-neutral-900">
                              {
                                coupon.code
                              }
                            </h2>

                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                coupon.isActive
                                  ? "bg-green-50 text-green-700"
                                  : "bg-neutral-100 text-neutral-500"
                              }`}
                            >
                              {coupon.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>

                          </div>

                          {coupon.description && (
                            <p className="mt-1 max-w-xl truncate text-sm text-neutral-500">
                              {
                                coupon.description
                              }
                            </p>
                          )}

                          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-neutral-500">

                            <span className="font-semibold text-neutral-900">
                              {getCouponDiscountLabel(
                                coupon,
                              )}
                            </span>

                            <span>
                              Min. order ₹
                              {coupon.minimumOrderAmount.toLocaleString(
                                "en-IN",
                              )}
                            </span>

                            {coupon.usageLimit !==
                              undefined && (
                              <span>
                                Used{" "}
                                {
                                  coupon.usedCount
                                }
                                {" / "}
                                {
                                  coupon.usageLimit
                                }
                              </span>
                            )}

                            <span className="flex items-center gap-1.5">

                              <Calendar
                                size={13}
                              />

                              {formatDate(
                                coupon.startDate,
                              )}

                              {" — "}

                              {formatDate(
                                coupon.endDate,
                              )}

                            </span>

                          </div>

                        </div>

                      </div>

                      <div className="flex shrink-0 items-center gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleCouponStatus(
                              coupon,
                            )
                          }
                          disabled={
                            isActionLoading
                          }
                          title={
                            coupon.isActive
                              ? "Deactivate coupon"
                              : "Activate coupon"
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isActionLoading ? (
                            <Loader2
                              size={17}
                              className="animate-spin"
                            />
                          ) : (
                            <Power
                              size={17}
                            />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin/coupons/${coupon._id}/edit`,
                            )
                          }
                          disabled={
                            isActionLoading
                          }
                          title="Edit coupon"
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Edit3
                            size={17}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteCoupon(
                              coupon,
                            )
                          }
                          disabled={
                            isActionLoading
                          }
                          title="Delete coupon"
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-100 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2
                            size={17}
                          />
                        </button>

                      </div>

                    </div>
                  );
                },
              )}

            </div>

          </div>
        )}

    </div>
  );
};

export default Offers;