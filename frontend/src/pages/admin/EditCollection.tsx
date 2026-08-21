import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  Check,
  FolderOpen,
  Image as ImageIcon,
  Loader2,
  Save,
  Search,
  X,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import type {
  Product,
  ProductImage,
} from "../../types/product";

import {
  getCollectionById,
  updateCollection,
} from "../../api/collectionApi";

import {
  getProducts,
} from "../../api/product.api";

import {
  uploadProductImage,
} from "../../api/media.api";

const createSlug = (
  value: string,
): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const EditCollection = () => {
  const navigate = useNavigate();

  const { id } = useParams();

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

  const [
    image,
    setImage,
  ] = useState<ProductImage | undefined>(
    undefined,
  );

  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false);

  const [
    isActive,
    setIsActive,
  ] = useState(true);

  const [
    products,
    setProducts,
  ] = useState<Product[]>([]);

  const [
    selectedProductIds,
    setSelectedProductIds,
  ] = useState<string[]>([]);

  const [
    search,
    setSearch,
  ] = useState("");

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

  /*
   * ========================================
   * FETCH COLLECTION + PRODUCTS
   * ========================================
   */

  useEffect(() => {
    if (!id) {
      setError("Collection ID is missing");
      setLoading(false);

      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          collection,
          productsResponse,
        ] = await Promise.all([
          getCollectionById(id),

          getProducts({
            page: 1,
            limit: 50,
          }),
        ]);

        setName(
          collection.name,
        );

        setSlug(
          collection.slug,
        );

        setDescription(
          collection.description || "",
        );

        setImage(
          collection.image,
        );

        setIsActive(
          collection.isActive,
        );

        setProducts(
          productsResponse.products,
        );

        /*
         * Collection products can be:
         *
         * 1. Product IDs
         * 2. Populated Product objects
         */

        setSelectedProductIds(
          collection.products.map(
            (product) =>
              typeof product === "string"
                ? product
                : product._id,
          ),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load collection",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    id,
  ]);

  /*
   * ========================================
   * FILTER PRODUCTS
   * ========================================
   */

  const filteredProducts =
    useMemo(() => {
      const query =
        search
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
      search,
    ]);

  /*
   * ========================================
   * TOGGLE PRODUCT
   * ========================================
   */

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
              currentId !== productId,
          );
        }

        return [
          ...currentIds,
          productId,
        ];
      },
    );
  };

  /*
   * ========================================
   * SELECT ALL FILTERED PRODUCTS
   * ========================================
   */

  const handleSelectAll = () => {
    const filteredIds =
      filteredProducts.map(
        (product) =>
          product._id,
      );

    const allSelected =
      filteredIds.length > 0 &&
      filteredIds.every(
        (productId) =>
          selectedProductIds.includes(
            productId,
          ),
      );

    if (allSelected) {
      setSelectedProductIds(
        (currentIds) =>
          currentIds.filter(
            (productId) =>
              !filteredIds.includes(
                productId,
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
            ...filteredIds,
          ]),
        ),
    );
  };

  /*
   * ========================================
   * UPLOAD IMAGE
   * ========================================
   */

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploadingImage(true);
      setError("");

      const uploadedImage =
        await uploadProductImage(
          file,
        );

      setImage(
        uploadedImage,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload image",
      );
    } finally {
      setUploadingImage(false);

      event.target.value = "";
    }
  };

  /*
   * ========================================
   * SUBMIT
   * ========================================
   */

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    if (!id) {
      setError(
        "Collection ID is missing",
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
          "Collection name must contain at least 2 characters",
        );
      }

      if (
        slug.trim().length < 2
      ) {
        throw new Error(
          "Collection slug is required",
        );
      }

      if (uploadingImage) {
        throw new Error(
          "Please wait for the image upload to finish",
        );
      }

      await updateCollection(
        id,
        {
          name:
            name.trim(),

          slug:
            slug.trim(),

          description:
            description.trim() ||
            undefined,

          image,

          products:
            selectedProductIds,

          isActive,
        },
      );

      navigate(
        "/admin/collections",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update collection",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * ========================================
   * LOADING
   * ========================================
   */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">

          <Loader2
            size={32}
            className="mx-auto animate-spin text-neutral-500"
          />

          <p className="mt-4 text-sm text-neutral-500">
            Loading collection...
          </p>

        </div>
      </div>
    );
  }

  /*
   * ========================================
   * PAGE
   * ========================================
   */

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      {/* HEADER */}

      <div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/collections",
            )
          }
          className="inline-flex items-center gap-2 text-sm text-neutral-500 transition hover:text-neutral-900"
        >
          <ArrowLeft size={17} />

          Back to Collections
        </button>

        <div className="mt-5">

          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Product Management
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-neutral-900">
            Edit Collection
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Update collection details and manage its products.
          </p>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]"
      >

        {/* LEFT SIDE */}

        <div className="space-y-8">

          {/* COLLECTION INFORMATION */}

          <section className="rounded-xl border border-neutral-200 bg-white p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">

                <FolderOpen
                  size={20}
                  className="text-neutral-600"
                />

              </div>

              <div>

                <h2 className="text-base font-semibold text-neutral-900">
                  Collection Information
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Update the basic collection details.
                </p>

              </div>

            </div>

            <div className="mt-6 space-y-5">

              {/* NAME */}

              <div>

                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Collection Name
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
                  className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-neutral-500"
                />

              </div>

              {/* SLUG */}

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
                  className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-neutral-500"
                />

                <p className="mt-2 text-xs text-neutral-500">
                  URL: /collections/
                  {slug || "collection-slug"}
                </p>

              </div>

              {/* DESCRIPTION */}

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
                  rows={5}
                  maxLength={2000}
                  className="w-full resize-none rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-neutral-500"
                />

                <p className="mt-2 text-right text-xs text-neutral-400">
                  {description.length}
                  /2000
                </p>

              </div>

            </div>

          </section>

          {/* PRODUCTS */}

          <section className="rounded-xl border border-neutral-200 bg-white p-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-base font-semibold text-neutral-900">
                  Select Products
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  {selectedProductIds.length} product
                  {selectedProductIds.length !==
                  1
                    ? "s"
                    : ""}{" "}
                  selected.
                </p>

              </div>

              <button
                type="button"
                onClick={handleSelectAll}
                disabled={
                  filteredProducts.length === 0
                }
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Select All
              </button>

            </div>

            {/* SEARCH */}

            <div className="relative mt-6">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value,
                  )
                }
                placeholder="Search products..."
                className="w-full rounded-lg border border-neutral-200 py-3 pl-11 pr-10 text-sm outline-none transition focus:border-neutral-500"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  <X size={17} />
                </button>
              )}

            </div>

            {/* PRODUCT LIST */}

            <div className="mt-5 max-h-163 divide-y divide-neutral-100 overflow-y-auto rounded-lg border border-neutral-200">

              {filteredProducts.length === 0 && (
                <div className="px-5 py-16 text-center">

                  <FolderOpen
                    size={28}
                    className="mx-auto text-neutral-300"
                  />

                  <p className="mt-3 text-sm text-neutral-500">
                    No products found.
                  </p>

                </div>
              )}

              {filteredProducts.map(
                (product) => {
                  const selected =
                    selectedProductIds.includes(
                      product._id,
                    );

                  return (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() =>
                        toggleProduct(
                          product._id,
                        )
                      }
                      className={`flex w-full items-center gap-4 px-4 py-4 text-left transition ${
                        selected
                          ? "bg-neutral-50"
                          : "hover:bg-neutral-50"
                      }`}
                    >

                      {/* CHECKBOX */}

                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                          selected
                            ? "border-neutral-900 bg-neutral-900 text-white"
                            : "border-neutral-300 bg-white"
                        }`}
                      >
                        {selected && (
                          <Check size={14} />
                        )}
                      </div>

                      {/* IMAGE */}

                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">

                        {product.image?.url ? (
                          <img
                            src={product.image.url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">

                            <ImageIcon
                              size={20}
                              className="text-neutral-400"
                            />

                          </div>
                        )}

                      </div>

                      {/* DETAILS */}

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-medium text-neutral-900">
                          {product.name}
                        </p>

                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">

                          {product.category && (
                            <span className="text-xs text-neutral-500">
                              {product.category}
                            </span>
                          )}

                          <span className="text-xs text-neutral-500">
                            ₹
                            {product.price.toLocaleString(
                              "en-IN",
                            )}
                          </span>

                        </div>

                      </div>

                    </button>
                  );
                },
              )}

            </div>

          </section>

        </div>

        {/* RIGHT SIDE */}

        <div className="space-y-8">

          {/* COLLECTION IMAGE */}

          <section className="rounded-xl border border-neutral-200 bg-white p-6">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">

                <ImageIcon
                  size={20}
                  className="text-neutral-600"
                />

              </div>

              <div>

                <h2 className="text-base font-semibold text-neutral-900">
                  Collection Image
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Update the cover image for this collection.
                </p>

              </div>

            </div>

            <div className="mt-6">

              {image ? (
                <div className="overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">

                  <img
                    src={image.url}
                    alt="Collection preview"
                    className="aspect-16/10 w-full object-cover"
                  />

                  <div className="flex items-center justify-between gap-3 border-t border-neutral-200 bg-white p-3">

                    <p className="truncate text-xs text-neutral-500">
                      Collection image uploaded
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setImage(undefined)
                      }
                      disabled={uploadingImage}
                      className="shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Remove
                    </button>

                  </div>

                </div>
              ) : (
                <label className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-200 bg-neutral-50 px-6 text-center transition hover:border-neutral-400 hover:bg-neutral-100">

                  {uploadingImage ? (
                    <>

                      <Loader2
                        size={28}
                        className="animate-spin text-neutral-500"
                      />

                      <p className="mt-3 text-sm font-medium text-neutral-700">
                        Uploading image...
                      </p>

                    </>
                  ) : (
                    <>

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">

                        <ImageIcon
                          size={22}
                          className="text-neutral-500"
                        />

                      </div>

                      <p className="mt-4 text-sm font-medium text-neutral-800">
                        Click to upload collection image
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        Choose an image from your device
                      </p>

                    </>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />

                </label>
              )}

            </div>

          </section>

          {/* STATUS */}

          <section className="rounded-xl border border-neutral-200 bg-white p-6">

            <h2 className="text-base font-semibold text-neutral-900">
              Status
            </h2>

            <p className="mt-1 text-sm text-neutral-500">
              Control whether customers can see this collection.
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
                  Active Collection
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  Visible to customers.
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
                submitting ||
                uploadingImage
              }
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {(submitting ||
                uploadingImage) && (
                <Loader2
                  size={18}
                  className="animate-spin"
                />
              )}

              {!submitting &&
                !uploadingImage && (
                  <Save size={18} />
                )}

              {uploadingImage
                ? "Uploading Image..."
                : submitting
                  ? "Saving Changes..."
                  : "Save Changes"}

            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/collections",
                )
              }
              disabled={
                submitting ||
                uploadingImage
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

export default EditCollection;