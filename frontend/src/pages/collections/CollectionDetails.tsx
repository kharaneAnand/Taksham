import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  FolderOpen,
  Loader2,
  PackageOpen,
  Sparkles,
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

import {
  getCollectionBySlug,
} from "../../api/collectionApi";

const CollectionDetails = () => {
  const navigate = useNavigate();

  const { slug } = useParams<{
    slug: string;
  }>();

  const [
    collection,
    setCollection,
  ] = useState<Collection | null>(
    null,
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /* ========================================
   * FETCH COLLECTION
   * ======================================== */

  useEffect(() => {
    const fetchCollection = async () => {
      if (!slug) {
        setError(
          "Collection not found",
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getCollectionBySlug(
            slug,
          );

        setCollection(
          response,
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

    fetchCollection();
  }, [
    slug,
  ]);

  /* ========================================
   * POPULATED PRODUCTS ONLY
   * ======================================== */

  const products = useMemo(() => {
    if (!collection) {
      return [];
    }

    return collection.products.filter(
      (
        product,
      ): product is Product =>
        typeof product !==
        "string",
    );
  }, [
    collection,
  ]);

  /* ========================================
   * LOADING
   * ======================================== */

  if (loading) {
    return (
      <main
        className="
          flex
          min-h-[70vh]
          items-center
          justify-center
          bg-[#FAF8F5]
          px-5
        "
      >
        <div className="flex flex-col items-center text-center">

          <Loader2
            size={30}
            className="
              animate-spin
              text-[#A4773E]
            "
          />

          <p
            className="
              mt-4
              text-sm
              text-[#756B60]
            "
          >
            Loading collection...
          </p>

        </div>
      </main>
    );
  }

  /* ========================================
   * ERROR / NOT FOUND
   * ======================================== */

  if (error || !collection) {
    return (
      <main
        className="
          flex
          min-h-[70vh]
          items-center
          justify-center
          bg-[#FAF8F5]
          px-5
        "
      >
        <div className="max-w-md text-center">

          <div
            className="
              mx-auto
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-[#F1E8DD]
            "
          >
            <FolderOpen
              size={25}
              className="
                text-[#A4773E]
              "
            />
          </div>

          <h1
            className="
              mt-5
              font-serif
              text-3xl
              text-[#302B25]
            "
          >
            Collection not found
          </h1>

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-[#756B60]
            "
          >
            {error ||
              "The collection you are looking for does not exist."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/collections",
              )
            }
            className="
              mt-7
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-[#8F6B3F]
              px-5
              py-3
              text-xs
              font-semibold
              text-white
              transition
              hover:bg-[#795832]
            "
          >
            <ArrowLeft size={15} />

            Back to Collections
          </button>

        </div>
      </main>
    );
  }

  return (
    <main
      className="
        min-h-screen
        overflow-hidden
        bg-[#FAF8F5]
        text-[#302B25]
      "
    >
      {/* ====================================
       * HERO
       * ==================================== */}

      <section
        className="
          relative
          overflow-hidden
          border-b
          border-[#E4DCD2]
          bg-[#F4EEE6]
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -right-32
            -top-32
            h-120
            w-120
            rounded-full
            bg-[#CBAE7D]/20
            blur-[110px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-40
            -left-32
            h-100
            w-100
            rounded-full
            bg-[#DCC6A5]/25
            blur-[100px]
          "
        />

        <div
          className="
            relative
            mx-auto
            max-w-375
            px-5
            pb-14
            pt-6
            sm:px-8
            sm:pb-20
            sm:pt-9
            lg:px-12
            lg:pb-24
            xl:px-16
          "
        >
          {/* BREADCRUMB */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/collections",
              )
            }
            className="
              group
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#D9CDBD]
              bg-white/40
              px-3
              py-2
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[#82766A]
              transition
              hover:border-[#B99A6B]
              hover:bg-white/70
              hover:text-[#8C6535]
            "
          >
            <ArrowLeft
              size={11}
              className="
                transition-transform
                group-hover:-translate-x-0.5
              "
            />

            All Collections
          </button>

          <div
            className="
              mt-10
              grid
              gap-10
              lg:mt-14
              lg:grid-cols-[1fr_0.9fr]
              lg:items-center
              lg:gap-16
            "
          >
            {/* TEXT */}

            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#D7C6AD]
                  bg-white/40
                  px-3
                  py-2
                "
              >
                <Sparkles
                  size={13}
                  strokeWidth={1.5}
                  className="text-[#A4773E]"
                />

                <span
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.28em]
                    text-[#967143]
                  "
                >
                  Curated collection
                </span>
              </div>

              <h1
                className="
                  mt-5
                  max-w-4xl
                  font-serif
                  text-[46px]
                  font-medium
                  leading-[0.92]
                  tracking-[-0.055em]
                  text-[#29241F]
                  sm:text-[68px]
                  lg:text-[82px]
                  xl:text-[94px]
                "
              >
                {collection.name}
                <span className="text-[#A4773E]">
                  .
                </span>
              </h1>

              <div
                className="
                  mt-6
                  h-px
                  w-20
                  bg-[#B7894A]
                "
              />

              {collection.description && (
                <p
                  className="
                    mt-6
                    max-w-xl
                    text-[13px]
                    leading-6.5
                    text-[#756B60]
                    sm:text-[15px]
                    sm:leading-7.5
                  "
                >
                  {collection.description}
                </p>
              )}

              <div
                className="
                  mt-7
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#D8CCBD]
                  bg-white/45
                  px-4
                  py-2.5
                "
              >
                <PackageOpen
                  size={14}
                  className="
                    text-[#A4773E]
                  "
                />

                <span
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-[#756B60]
                  "
                >
                  {products.length}{" "}
                  {products.length === 1
                    ? "piece"
                    : "pieces"}{" "}
                  in this collection
                </span>
              </div>
            </div>

            {/* IMAGE */}

            <div
              className="
                relative
                overflow-hidden
                rounded-3xl
                border
                border-[#DED4C8]
                bg-[#EDE5DB]
                shadow-[0_18px_50px_rgba(55,43,31,0.09)]
              "
            >
              {collection.image?.url ? (
                <img
                  src={
                    collection.image.url
                  }
                  alt={
                    collection.name
                  }
                  className="
                    aspect-[1.15]
                    w-full
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    aspect-[1.15]
                    items-center
                    justify-center
                  "
                >
                  <FolderOpen
                    size={48}
                    className="
                      text-[#B9AA99]
                    "
                  />
                </div>
              )}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-linear-to-t
                  from-black/25
                  via-transparent
                  to-transparent
                "
              />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================
       * PRODUCTS
       * ==================================== */}

      <section
        className="
          relative
          mx-auto
          max-w-375
          px-5
          py-15
          sm:px-8
          sm:py-20
          lg:px-12
          lg:py-24
          xl:px-16
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            left-0
            top-24
            h-60
            w-60
            rounded-full
            bg-[#E8DAC5]/25
            blur-[100px]
          "
        />

        {/* HEADING */}

        <div
          className="
            relative
            mb-9
            flex
            flex-col
            gap-4
            sm:mb-12
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <span className="h-px w-6 bg-[#B7894A]" />

              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  text-[#A4773E]
                "
              >
                Explore the collection
              </p>
            </div>

            <h2
              className="
                mt-3
                font-serif
                text-[34px]
                leading-none
                tracking-[-0.045em]
                text-[#302B25]
                sm:text-[46px]
              "
            >
              Selected for your space
            </h2>
          </div>

          <span
            className="
              w-fit
              rounded-full
              border
              border-[#DDD1C2]
              bg-[#F7F1E9]
              px-3
              py-2
              text-[8px]
              font-medium
              uppercase
              tracking-[0.16em]
              text-[#9A9186]
            "
          >
            {products.length}{" "}
            {products.length === 1
              ? "product"
              : "products"}
          </span>
        </div>

        {/* EMPTY STATE */}

        {products.length === 0 && (
          <div
            className="
              relative
              rounded-[22px]
              border
              border-dashed
              border-[#D8CCBD]
              bg-[#F7F1E9]
              px-6
              py-20
              text-center
            "
          >
            <PackageOpen
              size={36}
              className="
                mx-auto
                text-[#B9AA99]
              "
            />

            <h3
              className="
                mt-5
                font-serif
                text-2xl
                text-[#302B25]
              "
            >
              Products coming soon
            </h3>

            <p
              className="
                mx-auto
                mt-3
                max-w-md
                text-sm
                leading-6
                text-[#756B60]
              "
            >
              Our team is currently curating
              this collection. Please check back soon.
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
                rounded-xl
                bg-[#8F6B3F]
                px-5
                py-3
                text-xs
                font-semibold
                text-white
                transition
                hover:bg-[#795832]
              "
            >
              Explore all products

              <ArrowRight size={14} />
            </button>
          </div>
        )}

        {/* PRODUCT GRID */}

        {products.length > 0 && (
          <div
            className="
              relative
              grid
              grid-cols-2
              gap-x-3
              gap-y-7
              sm:grid-cols-3
              sm:gap-x-5
              sm:gap-y-9
              lg:grid-cols-4
              lg:gap-x-6
              lg:gap-y-10
            "
          >
            {products.map(
              (product) => (
                <button
                  key={product._id}
                  type="button"
                  onClick={() =>
                    navigate(
                      `/products/${encodeURIComponent(
                        product.slug,
                      )}`,
                    )
                  }
                  className="
                    group
                    min-w-0
                    text-left
                  "
                >
                  {/* IMAGE */}

                  <div
                    className="
                      relative
                      overflow-hidden
                      rounded-[18px]
                      border
                      border-[#E4DCD2]
                      bg-[#F1EBE3]
                      shadow-[0_8px_25px_rgba(55,43,31,0.04)]
                      transition-all
                      duration-500
                      group-hover:-translate-y-1
                      group-hover:border-[#D0B68E]
                      group-hover:shadow-[0_18px_35px_rgba(55,43,31,0.1)]
                    "
                  >
                    {product.image?.url ? (
                      <img
                        src={
                          product.image.url
                        }
                        alt={
                          product.name
                        }
                        loading="lazy"
                        className="
                          aspect-[0.9]
                          w-full
                          object-cover
                          transition-transform
                          duration-700
                          ease-out
                          group-hover:scale-[1.045]
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          aspect-[0.9]
                          items-center
                          justify-center
                        "
                      >
                        <PackageOpen
                          size={30}
                          className="
                            text-[#B9AA99]
                          "
                        />
                      </div>
                    )}
                  </div>

                  {/* DETAILS */}

                  <div className="pt-4">

                    <p
                      className="
                        truncate
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        text-[#A4773E]
                      "
                    >
                      {product.category ||
                        "Furniture"}
                    </p>

                    <h3
                      className="
                        mt-1.5
                        line-clamp-2
                        font-serif
                        text-[18px]
                        leading-tight
                        text-[#302B25]
                        sm:text-[21px]
                      "
                    >
                      {product.name}
                    </h3>

                    <div
                      className="
                        mt-2.5
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                    >
                      <p
                        className="
                          text-sm
                          font-medium
                          text-[#554A3E]
                        "
                      >
                        ₹
                        {product.price.toLocaleString(
                          "en-IN",
                        )}
                      </p>

                      <span
                        className="
                          flex
                          h-7
                          w-7
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-[#DDD1C2]
                          bg-white
                          text-[#76562F]
                          transition-all
                          duration-300
                          group-hover:border-[#B7894A]
                          group-hover:bg-[#8F6B3F]
                          group-hover:text-white
                        "
                      >
                        <ArrowRight
                          size={11}
                          strokeWidth={1.5}
                          className="
                            transition-transform
                            duration-300
                            group-hover:translate-x-0.5
                          "
                        />
                      </span>
                    </div>

                  </div>
                </button>
              ),
            )}
          </div>
        )}
      </section>

      {/* ====================================
       * BOTTOM CTA
       * ==================================== */}

      <section
        className="
          border-t
          border-[#E4DCD2]
          bg-[#F4EEE6]
        "
      >
        <div
          className="
            mx-auto
            max-w-375
            px-5
            py-14
            text-center
            sm:px-8
            sm:py-18
          "
        >
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.3em]
              text-[#A4773E]
            "
          >
            Keep exploring
          </p>

          <h2
            className="
              mt-4
              font-serif
              text-[34px]
              leading-none
              tracking-[-0.04em]
              text-[#302B25]
              sm:text-[46px]
            "
          >
            Discover more for your home.
          </h2>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/products",
              )
            }
            className="
              group
              mx-auto
              mt-7
              inline-flex
              items-center
              gap-3
              rounded-xl
              bg-[#8F6B3F]
              px-6
              py-3.5
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.15em]
              text-white
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#795832]
            "
          >
            Explore all products

            <ArrowRight
              size={13}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </button>
        </div>
      </section>
    </main>
  );
};

export default CollectionDetails;