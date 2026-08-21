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
} from "../../types/offer";

import {
  createOffer,
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

const AddOffer = () => {
  const navigate =
    useNavigate();

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
   * DATES
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
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  /* ========================================
   * FETCH PRODUCTS
   * ======================================== */

  useEffect(() => {
    if (
      appliesTo !== "products"
    ) {
      return;
    }

    const fetchProducts =
      async () => {
        try {
          setLoadingProducts(
            true,
          );

          setError("");

          const response =
            await getProducts({
              page: 1,
              limit: 100,
            });

          setProducts(
            response.products,
          );
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load products",
          );
        } finally {
          setLoadingProducts(
            false,
          );
        }
      };

    fetchProducts();
  }, [
    appliesTo,
  ]);

  /* ========================================
   * FETCH COLLECTIONS
   * ======================================== */

  useEffect(() => {
    if (
      appliesTo !== "collections"
    ) {
      return;
    }

    const fetchCollections =
      async () => {
        try {
          setLoadingCollections(
            true,
          );

          setError("");

          const response =
            await getCollections();

          setCollections(
            response,
          );
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load collections",
          );
        } finally {
          setLoadingCollections(
            false,
          );
        }
      };

    fetchCollections();
  }, [
    appliesTo,
  ]);

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
            (id) =>
              id !== productId,
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
            (id) =>
              id !== collectionId,
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
   * SELECT ALL PRODUCTS
   * ======================================== */

  const handleSelectAllProducts =
    () => {
      const ids =
        filteredProducts.map(
          (product) =>
            product._id,
        );

      const allSelected =
        ids.length > 0 &&
        ids.every(
          (id) =>
            selectedProductIds.includes(
              id,
            ),
        );

      if (allSelected) {
        setSelectedProductIds(
          (currentIds) =>
            currentIds.filter(
              (id) =>
                !ids.includes(
                  id,
                ),
            ),
        );

        return;
      }

      setSelectedProductIds(
        (currentIds) =>
          Array.from(
            new Set([
              ...currentIds,
              ...ids,
            ]),
          ),
      );
    };

  /* ========================================
   * SELECT ALL COLLECTIONS
   * ======================================== */

  const handleSelectAllCollections =
    () => {
      const ids =
        filteredCollections.map(
          (collection) =>
            collection._id,
        );

      const allSelected =
        ids.length > 0 &&
        ids.every(
          (id) =>
            selectedCollectionIds.includes(
              id,
            ),
        );

      if (allSelected) {
        setSelectedCollectionIds(
          (currentIds) =>
            currentIds.filter(
              (id) =>
                !ids.includes(
                  id,
                ),
            ),
        );

        return;
      }

      setSelectedCollectionIds(
        (currentIds) =>
          Array.from(
            new Set([
              ...currentIds,
              ...ids,
            ]),
          ),
      );
    };

  /* ========================================
   * CHANGE APPLIES TO
   * ======================================== */

  const handleAppliesToChange = (
    value: AppliesTo,
  ) => {
    setAppliesTo(
      value,
    );

    setError("");
  };

  /* ========================================
   * SUBMIT
   * ======================================== */

  const handleSubmit =
    async (
      event: React.FormEvent,
    ) => {
      event.preventDefault();

      try {
        setSubmitting(
          true,
        );

        setError("");

        const parsedDiscountValue =
          Number(
            discountValue,
          );

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
          !Number.isFinite(
            parsedDiscountValue,
          ) ||
          parsedDiscountValue <= 0
        ) {
          throw new Error(
            "Enter a valid discount value",
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
          new Date(
            startDate,
          );

        const parsedEndDate =
          new Date(
            endDate,
          );

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

        await createOffer({
            name: name.trim(),

            slug: slug.trim(),

            description:
                description.trim() || undefined,

            discountType,

            discountValue:
                Number(discountValue),

            appliesTo,

            productIds:
                selectedProductIds,

            collectionIds:
                selectedCollectionIds,

            startDate:
                startDate,

            endDate:
                endDate,

            isActive,
        });

        navigate(
          "/admin/offers",
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to create offer",
        );
      } finally {
        setSubmitting(
          false,
        );
      }
    };

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* ====================================
       * HEADER
       * ==================================== */}

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
            Create Offer
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Create a discount for products or
            collections.
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

        {/* ==================================
         * LEFT SIDE
         * ================================== */}

        <div className="space-y-8">

          {/* BASIC INFORMATION */}

          <section className="rounded-xl border border-neutral-200 bg-white p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">

                <Gift
                  size={20}
                  className="text-neutral-600"
                />

              </div>

              <div>

                <h2 className="text-base font-semibold text-neutral-900">
                  Offer Information
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Basic details for this offer.
                </p>

              </div>

            </div>

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

                    setName(
                      value,
                    );

                    setSlug(
                      createSlug(
                        value,
                      ),
                    );
                  }}
                  placeholder="Example: Diwali Sale 2026"
                  className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-500"
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
                  placeholder="diwali-sale-2026"
                  className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-500"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Description

                  <span className="ml-1 text-neutral-400">
                    (Optional)
                  </span>
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
                  className="w-full resize-none rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-500"
                />

              </div>

            </div>

          </section>

          {/* DISCOUNT */}

          <section className="rounded-xl border border-neutral-200 bg-white p-6">

            <h2 className="text-base font-semibold text-neutral-900">
              Discount
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Choose how this discount will be
              calculated.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              <button
                type="button"
                onClick={() =>
                  setDiscountType(
                    "percentage",
                  )
                }
                className={`rounded-lg border p-4 text-left transition ${
                  discountType ===
                  "percentage"
                    ? "border-neutral-900 bg-neutral-50"
                    : "border-neutral-200 hover:bg-neutral-50"
                }`}
              >

                <p className="text-sm font-medium text-neutral-900">
                  Percentage
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  Example: 20% OFF
                </p>

              </button>

              <button
                type="button"
                onClick={() =>
                  setDiscountType(
                    "fixed",
                  )
                }
                className={`rounded-lg border p-4 text-left transition ${
                  discountType ===
                  "fixed"
                    ? "border-neutral-900 bg-neutral-50"
                    : "border-neutral-200 hover:bg-neutral-50"
                }`}
              >

                <p className="text-sm font-medium text-neutral-900">
                  Fixed Amount
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  Example: ₹500 OFF
                </p>

              </button>

            </div>

            <div className="mt-5">

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
                    ? "Example: 20"
                    : "Example: 500"
                }
                className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-neutral-500"
              />

            </div>

          </section>

          {/* APPLIES TO */}

          <section className="rounded-xl border border-neutral-200 bg-white p-6">

            <h2 className="text-base font-semibold text-neutral-900">
              Applies To
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Choose which products should receive
              this offer.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-3">

              {[
                {
                  value: "all",
                  title: "All Products",
                  description:
                    "Apply this offer to every product.",
                },
                {
                  value: "products",
                  title: "Specific Products",
                  description:
                    "Choose individual products.",
                },
                {
                  value: "collections",
                  title: "Collections",
                  description:
                    "Apply to products inside collections.",
                },
              ].map(
                (option) => (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() =>
                      handleAppliesToChange(
                        option.value as AppliesTo,
                      )
                    }
                    className={`rounded-lg border p-4 text-left transition ${
                      appliesTo ===
                      option.value
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:bg-neutral-50"
                    }`}
                  >

                    <p className="text-sm font-medium text-neutral-900">
                      {
                        option.title
                      }
                    </p>

                    <p className="mt-1 text-xs leading-5 text-neutral-500">
                      {
                        option.description
                      }
                    </p>

                  </button>
                ),
              )}

            </div>

            {/* PRODUCT SELECTOR */}

            {appliesTo ===
              "products" && (
              <div className="mt-6 border-t border-neutral-100 pt-6">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <h3 className="text-sm font-medium text-neutral-900">
                      Select Products
                    </h3>

                    <p className="mt-1 text-xs text-neutral-500">
                      {
                        selectedProductIds.length
                      }{" "}
                      selected
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={
                      handleSelectAllProducts
                    }
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50"
                  >
                    Select All
                  </button>

                </div>

                <div className="relative mt-5">

                  <Search
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                  />

                  <input
                    type="text"
                    value={
                      productSearch
                    }
                    onChange={(event) =>
                      setProductSearch(
                        event.target.value,
                      )
                    }
                    placeholder="Search products..."
                    className="w-full rounded-lg border border-neutral-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-neutral-500"
                  />

                </div>

                <div className="mt-4 max-h-110 divide-y divide-neutral-100 overflow-y-auto rounded-lg border border-neutral-200">

                  {loadingProducts && (
                    <div className="flex items-center justify-center gap-3 p-10 text-sm text-neutral-500">

                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Loading products...

                    </div>
                  )}

                  {!loadingProducts &&
                    filteredProducts.map(
                      (
                        product,
                      ) => {
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
                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-neutral-50"
                          >

                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                                selected
                                  ? "border-neutral-900 bg-neutral-900 text-white"
                                  : "border-neutral-300"
                              }`}
                            >
                              {selected && (
                                <Check
                                  size={13}
                                />
                              )}
                            </div>

                            <div className="min-w-0">

                              <p className="truncate text-sm font-medium text-neutral-900">
                                {
                                  product.name
                                }
                              </p>

                              <p className="mt-1 text-xs text-neutral-500">
                                ₹
                                {product.price.toLocaleString(
                                  "en-IN",
                                )}
                              </p>

                            </div>

                          </button>
                        );
                      },
                    )}

                </div>

              </div>
            )}

            {/* COLLECTION SELECTOR */}

            {appliesTo ===
              "collections" && (
              <div className="mt-6 border-t border-neutral-100 pt-6">

                <div className="flex items-center justify-between gap-4">

                  <div>

                    <h3 className="text-sm font-medium text-neutral-900">
                      Select Collections
                    </h3>

                    <p className="mt-1 text-xs text-neutral-500">
                      {
                        selectedCollectionIds.length
                      }{" "}
                      selected
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={
                      handleSelectAllCollections
                    }
                    className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50"
                  >
                    Select All
                  </button>

                </div>

                <div className="relative mt-5">

                  <Search
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                  />

                  <input
                    type="text"
                    value={
                      collectionSearch
                    }
                    onChange={(event) =>
                      setCollectionSearch(
                        event.target.value,
                      )
                    }
                    placeholder="Search collections..."
                    className="w-full rounded-lg border border-neutral-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-neutral-500"
                  />

                </div>

                <div className="mt-4 max-h-110 divide-y divide-neutral-100 overflow-y-auto rounded-lg border border-neutral-200">

                  {loadingCollections && (
                    <div className="flex items-center justify-center gap-3 p-10 text-sm text-neutral-500">

                      <Loader2
                        size={18}
                        className="animate-spin"
                      />

                      Loading collections...

                    </div>
                  )}

                  {!loadingCollections &&
                    filteredCollections.map(
                      (
                        collection,
                      ) => {
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
                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-neutral-50"
                          >

                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                                selected
                                  ? "border-neutral-900 bg-neutral-900 text-white"
                                  : "border-neutral-300"
                              }`}
                            >
                              {selected && (
                                <Check
                                  size={13}
                                />
                              )}
                            </div>

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

                          </button>
                        );
                      },
                    )}

                </div>

              </div>
            )}

          </section>

        </div>

        {/* ==================================
         * RIGHT SIDE
         * ================================== */}

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
              Control whether this offer is active
              after creation.
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
                ? "Creating Offer..."
                : "Create Offer"}

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

export default AddOffer;