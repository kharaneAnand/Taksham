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
  Trash2,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import type {
  Offer,
} from "../../types/offer";

import {
  deleteOffer,
  getOffers,
  updateOffer,
} from "../../api/offer.api";

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

const getAppliesToLabel = (
  offer: Offer,
) => {
  switch (
    offer.appliesTo
  ) {
    case "all":
      return "All Products";

    case "products":
      return `${offer.productIds.length} Product${
        offer.productIds.length !== 1
          ? "s"
          : ""
      }`;

    case "collections":
      return `${offer.collectionIds.length} Collection${
        offer.collectionIds.length !== 1
          ? "s"
          : ""
      }`;

    default:
      return offer.appliesTo;
  }
};

const Offers = () => {
  const navigate =
    useNavigate();

  const [
    offers,
    setOffers,
  ] = useState<Offer[]>([]);

  const [
    loading,
    setLoading,
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
        setLoading(true);
        setError("");

        const response =
          await getOffers();

        setOffers(response);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load offers",
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchOffers();
  }, []);

  /* ========================================
   * TOGGLE STATUS
   * ======================================== */

  const handleToggleStatus =
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

  const handleDelete =
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
            Offers
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Create and manage discounts across
            products and collections.
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/offers/add",
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          <Plus size={18} />

          Create Offer
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
       * STATS
       * ==================================== */}

      {!loading && (
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
       * LOADING
       * ==================================== */}

      {loading && (
        <div className="flex min-h-100 items-center justify-center">

          <div className="flex items-center gap-3 text-sm text-neutral-500">

            <Loader2
              size={20}
              className="animate-spin"
            />

            Loading offers...

          </div>

        </div>
      )}

      {/* ====================================
       * EMPTY STATE
       * ==================================== */}

      {!loading &&
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
       * OFFERS LIST
       * ==================================== */}

      {!loading &&
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

                      {/* OFFER INFO */}

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

                      {/* ACTIONS */}

                      <div className="flex shrink-0 items-center gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleToggleStatus(
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
                            handleDelete(
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

    </div>
  );
};

export default Offers;