import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  Check,
  Gift,
  Loader2,
  Search,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import type {
  Product,
} from "../../types/product";

import type {
  Collection,
} from "../../types/collection";

import type {
  AppliesTo,
  DiscountType,
  Offer,
} from "../../types/offer";

import {
  getOfferById,
  updateOffer,
} from "../../api/offer.api";

import {
  getProducts,
} from "../../api/product.api";

import {
  getCollections,
} from "../../api/collectionApi";

/* ========================================
 * HELPERS
 * ======================================== */

const createSlug = (
  value: string,
): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const formatDateTimeLocal = (
  value: string | Date,
): string => {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "";
  }

  const pad = (
    number: number,
  ) =>
    String(number).padStart(
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

const EditOffer = () => {
  const navigate =
    useNavigate();

  const { id } =
    useParams();

  /* ========================================
   * BASIC DETAILS
   * ======================================== */

  const [
    name,
    setName,
  ] = useState("");

  const [
    slug,
    setSlug,
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
  ] = useState<DiscountType>(
    "percentage",
  );

  const [
    discountValue,
    setDiscountValue,
  ] = useState("");

  /* ========================================
   * APPLIES TO
   * ======================================== */

  const [
    appliesTo,
    setAppliesTo,
  ] = useState<AppliesTo>(
    "all",
  );

  /* ========================================
   * PRODUCTS
   * ======================================== */

  const [
    products,
    setProducts,
  ] = useState<Product[]>([]);

  const [
    selectedProductIds,
    setSelectedProductIds,
  ] = useState<string[]>([]);

  const [
    loadingProducts,
    setLoadingProducts,
  ] = useState(false);

  const [
    productSearch,
    setProductSearch,
  ] = useState("");

  /* ========================================
   * COLLECTIONS
   * ======================================== */

  const [
    collections,
    setCollections,
  ] = useState<Collection[]>([]);

  const [
    selectedCollectionIds,
    setSelectedCollectionIds,
  ] = useState<string[]>([]);

  const [
    loadingCollections,
    setLoadingCollections,
  ] = useState(false);

  const [
    collectionSearch,
    setCollectionSearch,
  ] = useState("");

  /* ========================================
   * SCHEDULE
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
   * STATUS
   * ======================================== */

  const [
    isActive,
    setIsActive,
  ] = useState(true);

  /* ========================================
   * PAGE STATE
   * ======================================== */

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  /* ========================================
   * FETCH OFFER + PRODUCTS + COLLECTIONS
   * ======================================== */

  useEffect(() => {
    if (!id) {
      setError(
        "Offer ID is missing",
      );

      setLoading(false);

      return;
    }

    const fetchData =
      async () => {
        try {
          setLoading(true);
          setError("");

          setLoadingProducts(true);
          setLoadingCollections(true);

          const [
            offer,
            productsResponse,
            collectionsResponse,
          ] =
            await Promise.all([
              getOfferById(id),

              getProducts({
                page: 1,
                limit: 50,
              }),

              getCollections(),
            ]);

          const typedOffer =
            offer as Offer;

          setName(
            typedOffer.name || "",
          );

          setSlug(
            typedOffer.slug || "",
          );

          setDescription(
            typedOffer.description || "",
          );

          setDiscountType(
            typedOffer.discountType,
          );

          setDiscountValue(
            String(
              typedOffer.discountValue,
            ),
          );

          setAppliesTo(
            typedOffer.appliesTo,
          );

          setSelectedProductIds(
            offer.productIds.map(
                (product) =>
                typeof product === "string"
                    ? product
                    : product._id,
            ),
            );

            setSelectedCollectionIds(
            offer.collectionIds.map(
                (collection) =>
                typeof collection === "string"
                    ? collection
                    : collection._id,
            ),
            );

          setStartDate(
            formatDateTimeLocal(
              typedOffer.startDate,
            ),
          );

          setEndDate(
            formatDateTimeLocal(
              typedOffer.endDate,
            ),
          );

          setIsActive(
            typedOffer.isActive,
          );

          setProducts(
            productsResponse.products,
          );

          setCollections(
            collectionsResponse,
          );
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load offer",
          );
        } finally {
          setLoading(false);

          setLoadingProducts(false);

          setLoadingCollections(false);
        }
      };

    fetchData();
  }, [id]);

  /* ========================================
   * FILTER PRODUCTS
   * ======================================== */

  const filteredProducts =
    useMemo(() => {
      const query =
        productSearch
          .trim()
          .toLowerCase();

      if (!query) {
        return products;
      }

      return products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(query) ||
          product.category
            ?.toLowerCase()
            .includes(query),
      );
    }, [
      products,
      productSearch,
    ]);

  /* ========================================
   * FILTER COLLECTIONS
   * ======================================== */

  const filteredCollections =
    useMemo(() => {
      const query =
        collectionSearch
          .trim()
          .toLowerCase();

      if (!query) {
        return collections;
      }

      return collections.filter(
        (collection) =>
          collection.name
            .toLowerCase()
            .includes(query) ||
          collection.slug
            .toLowerCase()
            .includes(query),
      );
    }, [
      collections,
      collectionSearch,
    ]);

  /* ========================================
   * TOGGLE PRODUCT
   * ======================================== */

  const toggleProduct = (
    productId: string,
  ) => {
    setSelectedProductIds(
      (currentIds) => {
        if (
          currentIds.includes(
            productId,
          )
        ) {
          return currentIds.filter(
            (currentId) =>
              currentId !==
              productId,
          );
        }

        return [
          ...currentIds,
          productId,
        ];
      },
    );
  };

  /* ========================================
   * TOGGLE COLLECTION
   * ======================================== */

  const toggleCollection = (
    collectionId: string,
  ) => {
    setSelectedCollectionIds(
      (currentIds) => {
        if (
          currentIds.includes(
            collectionId,
          )
        ) {
          return currentIds.filter(
            (currentId) =>
              currentId !==
              collectionId,
          );
        }

        return [
          ...currentIds,
          collectionId,
        ];
      },
    );
  };

  /* ========================================
   * CHANGE APPLIES TO
   * ======================================== */

  const handleAppliesToChange = (
    value: AppliesTo,
  ) => {
    setAppliesTo(value);

    if (value === "all") {
      setSelectedProductIds([]);
      setSelectedCollectionIds([]);
    }

    if (value === "products") {
      setSelectedCollectionIds([]);
    }

    if (
      value === "collections"
    ) {
      setSelectedProductIds([]);
    }
  };

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
      setError(
        "Offer ID is missing",
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");

      if (
        name.trim().length < 2
      ) {
        throw new Error(
          "Offer name must contain at least 2 characters",
        );
      }

      if (
        slug.trim().length < 2
      ) {
        throw new Error(
          "Offer slug is required",
        );
      }

      if (
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
          slug.trim(),
        )
      ) {
        throw new Error(
          "Slug must contain only lowercase letters, numbers and hyphens",
        );
      }

      const parsedDiscountValue =
        Number(discountValue);

      if (
        Number.isNaN(
          parsedDiscountValue,
        ) ||
        parsedDiscountValue <= 0
      ) {
        throw new Error(
          "Discount value must be greater than 0",
        );
      }

      if (
        discountType ===
          "percentage" &&
        parsedDiscountValue > 100
      ) {
        throw new Error(
          "Percentage discount cannot exceed 100%",
        );
      }

      if (
        appliesTo ===
          "products" &&
        selectedProductIds.length ===
          0
      ) {
        throw new Error(
          "Select at least one product",
        );
      }

      if (
        appliesTo ===
          "collections" &&
        selectedCollectionIds.length ===
          0
      ) {
        throw new Error(
          "Select at least one collection",
        );
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
        throw new Error(
          "Enter a valid start date",
        );
      }

      if (
        Number.isNaN(
          parsedEndDate.getTime(),
        )
      ) {
        throw new Error(
          "Enter a valid end date",
        );
      }

      if (
        parsedEndDate <=
        parsedStartDate
      ) {
        throw new Error(
          "End date must be after start date",
        );
      }

      await updateOffer(
        id,
        {
          name:
            name.trim(),

          slug:
            slug.trim(),

          description:
            description.trim() ||
            undefined,

          discountType,

          discountValue:
            parsedDiscountValue,

          appliesTo,

          productIds:
            appliesTo ===
            "products"
              ? selectedProductIds
              : [],

          collectionIds:
            appliesTo ===
            "collections"
              ? selectedCollectionIds
              : [],

          startDate,

          endDate,

          isActive,
        },
      );

      navigate(
        "/admin/offers",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update offer",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ========================================
   * LOADING
   * ======================================== */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2
            size={30}
            className="mx-auto animate-spin text-neutral-500"
          />

          <p className="mt-4 text-sm text-neutral-500">
            Loading offer...
          </p>
        </div>
      </div>
    );
  }

  /* ========================================
   * PAGE
   * ======================================== */

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* HEADER */}

      <div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/offers",
            )
          }
          className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-neutral-900"
        >
          <ArrowLeft size={17} />

          Back to Offers
        </button>

        <div className="mt-5">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Marketing
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-neutral-900">
            Edit Offer
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Update your discount and offer settings.
          </p>

        </div>

      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]"
      >

        {/* LEFT SIDE */}

        <div className="space-y-8">

          {/* BASIC INFORMATION */}

          <section className="rounded-xl border border-neutral-200 bg-white p-6">

            <h2 className="text-base font-semibold text-neutral-900">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Update the details of this offer.
            </p>

            <div className="mt-6 space-y-5">

              <div>

                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Offer Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => {
                    const value =
                      event.target.value;

                    setName(value);
                    setSlug(
                      createSlug(value),
                    );
                  }}
                  placeholder="Summer Sale"
                  className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-500"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Slug
                </label>

                <input
                  type="text"
                  value={slug}
                  onChange={(event) =>
                    setSlug(
                      createSlug(
                        event.target.value,
                      ),
                    )
                  }
                  placeholder="summer-sale"
                  className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-500"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  rows={4}
                  placeholder="Describe this offer..."
                  className="w-full resize-none rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-500"
                />

              </div>

            </div>

          </section>

          {/* DISCOUNT */}

          <section className="rounded-xl border border-neutral-200 bg-white p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                <Gift
                  size={18}
                  className="text-neutral-700"
                />
              </div>

              <div>

                <h2 className="text-base font-semibold text-neutral-900">
                  Discount
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Configure the discount customers receive.
                </p>

              </div>

            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Discount Type
                </label>

                <select
                  value={discountType}
                  onChange={(event) =>
                    setDiscountType(
                      event.target
                        .value as DiscountType,
                    )
                  }
                  className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-500"
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
                  className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-500"
                />

              </div>

            </div>

          </section>

          {/* APPLIES TO */}

          <section className="rounded-xl border border-neutral-200 bg-white p-6">

            <h2 className="text-base font-semibold text-neutral-900">
              Applies To
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Choose where this offer should be available.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">

              {(
                [
                  {
                    value: "all",
                    label: "All Products",
                  },
                  {
                    value: "products",
                    label: "Specific Products",
                  },
                  {
                    value: "collections",
                    label: "Collections",
                  },
                ] as const
              ).map(
                (option) => {
                  const active =
                    appliesTo ===
                    option.value;

                  return (
                    <button
                      key={
                        option.value
                      }
                      type="button"
                      onClick={() =>
                        handleAppliesToChange(
                          option.value,
                        )
                      }
                      className={`rounded-lg border p-4 text-left transition ${
                        active
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                      }`}
                    >

                      <p className="text-sm font-medium">
                        {option.label}
                      </p>

                    </button>
                  );
                },
              )}

            </div>

          </section>

          {/* PRODUCTS */}

          {appliesTo ===
            "products" && (
            <section className="rounded-xl border border-neutral-200 bg-white p-6">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <h2 className="text-base font-semibold text-neutral-900">
                    Select Products
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500">
                    {
                      selectedProductIds.length
                    } product
                    {
                      selectedProductIds.length !==
                      1
                        ? "s"
                        : ""
                    }{" "}
                    selected.
                  </p>

                </div>

              </div>

              <div className="relative mt-5">

                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />

                <input
                  type="text"
                  value={productSearch}
                  onChange={(event) =>
                    setProductSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search products..."
                  className="w-full rounded-lg border border-neutral-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-neutral-500"
                />

              </div>

              <div className="mt-5 max-h-100 space-y-2 overflow-y-auto pr-1">

                {loadingProducts ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-neutral-400" />
                  </div>
                ) : filteredProducts.length ===
                  0 ? (
                  <p className="py-8 text-center text-sm text-neutral-500">
                    No products found.
                  </p>
                ) : (
                  filteredProducts.map(
                    (product) => {
                      const selected =
                        selectedProductIds.includes(
                          product._id,
                        );

                      return (
                        <button
                          key={
                            product._id
                          }
                          type="button"
                          onClick={() =>
                            toggleProduct(
                              product._id,
                            )
                          }
                          className={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition ${
                            selected
                              ? "border-neutral-900 bg-neutral-50"
                              : "border-neutral-200 hover:border-neutral-400"
                          }`}
                        >

                          <div className="min-w-0">

                            <p className="truncate text-sm font-medium text-neutral-900">
                              {
                                product.name
                              }
                            </p>

                            <p className="mt-1 text-xs text-neutral-500">
                              {
                                product.category ||
                                "Uncategorized"
                              }
                            </p>

                          </div>

                          <div
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                              selected
                                ? "border-neutral-900 bg-neutral-900 text-white"
                                : "border-neutral-300"
                            }`}
                          >
                            {selected && (
                              <Check
                                size={14}
                              />
                            )}
                          </div>

                        </button>
                      );
                    },
                  )
                )}

              </div>

            </section>
          )}

          {/* COLLECTIONS */}

          {appliesTo ===
            "collections" && (
            <section className="rounded-xl border border-neutral-200 bg-white p-6">

              <div>

                <h2 className="text-base font-semibold text-neutral-900">
                  Select Collections
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  {
                    selectedCollectionIds.length
                  } collection
                  {
                    selectedCollectionIds.length !==
                    1
                      ? "s"
                      : ""
                  }{" "}
                  selected.
                </p>

              </div>

              <div className="relative mt-5">

                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />

                <input
                  type="text"
                  value={collectionSearch}
                  onChange={(event) =>
                    setCollectionSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search collections..."
                  className="w-full rounded-lg border border-neutral-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-neutral-500"
                />

              </div>

              <div className="mt-5 max-h-100 space-y-2 overflow-y-auto pr-1">

                {loadingCollections ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-neutral-400" />
                  </div>
                ) : filteredCollections.length ===
                  0 ? (
                  <p className="py-8 text-center text-sm text-neutral-500">
                    No collections found.
                  </p>
                ) : (
                  filteredCollections.map(
                    (collection) => {
                      const selected =
                        selectedCollectionIds.includes(
                          collection._id,
                        );

                      return (
                        <button
                          key={
                            collection._id
                          }
                          type="button"
                          onClick={() =>
                            toggleCollection(
                              collection._id,
                            )
                          }
                          className={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition ${
                            selected
                              ? "border-neutral-900 bg-neutral-50"
                              : "border-neutral-200 hover:border-neutral-400"
                          }`}
                        >

                          <div className="min-w-0">

                            <p className="truncate text-sm font-medium text-neutral-900">
                              {
                                collection.name
                              }
                            </p>

                            {collection.description && (
                              <p className="mt-1 truncate text-xs text-neutral-500">
                                {
                                  collection.description
                                }
                              </p>
                            )}

                          </div>

                          <div
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                              selected
                                ? "border-neutral-900 bg-neutral-900 text-white"
                                : "border-neutral-300"
                            }`}
                          >
                            {selected && (
                              <Check
                                size={14}
                              />
                            )}
                          </div>

                        </button>
                      );
                    },
                  )
                )}

              </div>

            </section>
          )}

        </div>

        {/* RIGHT SIDE */}

        <div className="space-y-8">

          {/* SCHEDULE */}

          <section className="rounded-xl border border-neutral-200 bg-white p-6">

            <h2 className="text-base font-semibold text-neutral-900">
              Offer Schedule
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Decide when this offer is available.
            </p>

            <div className="mt-6 space-y-5">

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
                  className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-500"
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
                  className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-neutral-500"
                />

              </div>

            </div>

          </section>

          {/* STATUS */}

          <section className="rounded-xl border border-neutral-200 bg-white p-6">

            <h2 className="text-base font-semibold text-neutral-900">
              Status
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Control whether this offer is currently active.
            </p>

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
                  Active Offer
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  Available to customers.
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

          {/* SAVE */}

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
                ? "Updating Offer..."
                : "Update Offer"}

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

export default EditOffer;