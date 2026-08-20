import {
  ArrowRight,
  Heart,
  Truck,
  ShieldCheck,
  LockKeyhole,
  UserRound,
  Headphones,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getProducts,
} from "../../api/product.api";

import type {
  Product,

} from "../../types/product";

/*
 * ========================================
 * Benefits
 * ========================================
 */

const benefits = [
  {
    title: "Free Delivery",
    description: "On orders above ₹15,000",
    icon: Truck,
  },
  {
    title: "Expert Support",
    description: "Help whenever you need",
    icon: Headphones,
  },
  {
    title: "Quality Assurance",
    description: "Premium selected products",
    icon: ShieldCheck,
  },
  {
    title: "Secure Payments",
    description: "100% secure checkout",
    icon: LockKeyhole,
  },
  {
    title: "Design Support",
    description: "Expert interior advice",
    icon: UserRound,
  },
];

const getProductImage = (
  product: Product,
): string => {
  if (typeof product.image === "string") {
    return product.image;
  }

  if (product.image?.url) {
    return product.image.url;
  }

  const firstGalleryImage =
    product.images?.[0];

  if (typeof firstGalleryImage === "string") {
    return firstGalleryImage;
  }

  if (firstGalleryImage?.url) {
    return firstGalleryImage.url;
  }

  const firstVariantImage =
    product.variants?.[0]?.images?.[0];

  if (typeof firstVariantImage === "string") {
    return firstVariantImage;
  }

  if (firstVariantImage?.url) {
    return firstVariantImage.url;
  }

  return "/placeholder-product.png";
};

/*
 * ========================================
 * Component
 * ========================================
 */

const NewArrivals = () => {
  const navigate = useNavigate();

  const [products, setProducts] =
    useState<Product[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * ========================================
   * Fetch New Arrivals
   * ========================================
   */

  useEffect(() => {
    const fetchNewArrivals =
      async () => {
        try {
          setIsLoading(true);
          setError(null);

          const result =
            await getProducts({
              limit: 6,
              sort: "newest",
            });

          setProducts(
            result.products.slice(0, 6),
          );
        } catch (error) {
          console.error(
            "Failed to fetch new arrivals:",
            error,
          );

          setProducts([]);

          setError(
            error instanceof Error
              ? error.message
              : "Failed to load new arrivals",
          );
        } finally {
          setIsLoading(false);
        }
      };

    void fetchNewArrivals();
  }, []);

  /*
   * ========================================
   * View All
   * ========================================
   */

  const handleViewAll = () => {
    navigate(
      "/products?sort=newest",
    );
  };

  return (
    <section
      className="
        w-full
        overflow-hidden
        bg-[#FAF8F5]
        py-4
        sm:py-5
        lg:py-5
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-350
          px-4
          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            mb-6
            flex
            items-end
            justify-between
            sm:mb-8
            lg:mb-9
          "
        >
          <div>
            <div
              className="
                mb-2
                flex
                items-center
                gap-2.5
              "
            >
              <span
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  text-[#A4773E]
                  sm:text-[10px]
                "
              >
                Just In
              </span>

              <span
                className="
                  h-px
                  w-6
                  bg-[#D2B27D]
                "
              />
            </div>

            <h2
              className="
                font-serif
                text-[29px]
                font-medium
                leading-none
                tracking-[-0.035em]
                text-[#1C1B19]
                sm:text-[37px]
                lg:text-[41px]
              "
            >
              New Arrivals
            </h2>
          </div>

          <button
            type="button"
            onClick={handleViewAll}
            className="
              group
              hidden
              items-center
              gap-2
              border-b
              border-transparent
              pb-1
              text-[10px]
              font-medium
              text-[#37332E]
              transition-all
              duration-300
              hover:border-[#B58A4A]
              hover:text-[#9A7138]
              sm:flex
              sm:text-[11px]
              lg:text-[12px]
            "
          >
            <span>
              View all new arrivals
            </span>

            <ArrowRight
              size={14}
              strokeWidth={1.5}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </button>
        </div>

        {isLoading && (
          <div
            className="
              grid
              grid-cols-2
              gap-4
              sm:grid-cols-2
              lg:grid-cols-6
            "
          >
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="
                  overflow-hidden
                  rounded-[14px]
                  border
                  border-[#E4DCCF]
                  bg-white
                "
              >
                <div
                  className="
                    h-52.5
                    animate-pulse
                    bg-[#F0ECE5]
                    sm:h-57.5
                    lg:h-52.5
                    xl:h-56.25
                  "
                />

                <div className="p-4">
                  <div
                    className="
                      h-2
                      w-20
                      animate-pulse
                      rounded
                      bg-[#E8E0D5]
                    "
                  />

                  <div
                    className="
                      mt-3
                      h-3
                      w-32
                      animate-pulse
                      rounded
                      bg-[#E8E0D5]
                    "
                  />

                  <div
                    className="
                      mt-4
                      h-3
                      w-20
                      animate-pulse
                      rounded
                      bg-[#E8E0D5]
                    "
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading &&
          error && (
            <div
              className="
                flex
                min-h-45
                flex-col
                items-center
                justify-center
                rounded-[14px]
                border
                border-[#E4DCCF]
                bg-white
                px-5
                text-center
              "
            >
              <p
                className="
                  font-serif
                  text-[22px]
                  text-[#302B25]
                "
              >
                Unable to load new arrivals
              </p>

              <p
                className="
                  mt-2
                  max-w-md
                  text-[10px]
                  leading-5
                  text-[#81776C]
                "
              >
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="
                  mt-4
                  rounded-lg
                  bg-[#8F6B3F]
                  px-5
                  py-2.5
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-white
                  transition
                  hover:bg-[#795832]
                "
              >
                Try Again
              </button>
            </div>
          )}

        {!isLoading &&
          !error &&
          products.length === 0 && (
            <div
              className="
                flex
                min-h-45
                items-center
                justify-center
                rounded-[14px]
                border
                border-[#E4DCCF]
                bg-white
                text-center
              "
            >
              <p
                className="
                  text-[11px]
                  text-[#81776C]
                "
              >
                No new arrivals available
                right now.
              </p>
            </div>
          )}

        {!isLoading &&
          !error &&
          products.length > 0 && (
            <>
              <div
                className="
                  relative
                  sm:hidden
                "
              >
                <div
                  className="
                    -mx-4
                    flex
                    gap-3
                    overflow-x-auto
                    px-4
                    pb-3
                    scrollbar-none
                    snap-x
                    snap-mandatory
                  "
                >
                  {products.map(
                    (product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        mobile
                      />
                    ),
                  )}
                </div>

                <div
                  className="
                    mt-1
                    flex
                    items-center
                    justify-end
                    gap-1.5
                  "
                >
                  <span
                    className="
                      text-[7px]
                      font-medium
                      uppercase
                      tracking-[0.14em]
                      text-[#A0988D]
                    "
                  >
                    Swipe to explore
                  </span>

                  <ArrowRight
                    size={9}
                    strokeWidth={1.5}
                    className="text-[#B7894A]"
                  />
                </div>
              </div>

              <div
                className="
                  hidden
                  w-full
                  min-w-0
                  grid-cols-2
                  gap-4
                  sm:grid
                  lg:hidden
                "
              >
                {products.map(
                  (product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  ),
                )}
              </div>

              <div
                className="
                  hidden
                  w-full
                  min-w-0
                  grid-cols-6
                  gap-4
                  lg:grid
                  xl:gap-5
                "
              >
                {products.map(
                  (product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  ),
                )}
              </div>
            </>
          )}
      </div>

      <div
        className="
          mx-auto
          mt-10
          w-full
          max-w-350
          px-4
          sm:mt-14
          sm:px-6
          lg:mt-16
          lg:px-8
        "
      >
        <div
          className="
            -mx-4
            flex
            gap-2
            overflow-x-auto
            px-4
            pb-1
            scrollbar-none
            sm:hidden
          "
        >
          {benefits.map(
            (benefit) => {
              const Icon =
                benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="
                    flex
                    min-w-48
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-[#E2D8CB]
                    bg-[#F4EEE5]
                    px-3.5
                    py-3
                    shadow-[0_3px_12px_rgba(58,46,34,0.035)]
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#D5C5AF]
                      bg-[#FBF8F3]
                      text-[#A4773E]
                    "
                  >
                    <Icon
                      size={17}
                      strokeWidth={1.5}
                    />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        text-[9px]
                        font-semibold
                        text-[#302C27]
                      "
                    >
                      {benefit.title}
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-[7px]
                        text-[#81776B]
                      "
                    >
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            },
          )}
        </div>

        <div
          className="
            hidden
            w-full
            overflow-hidden
            rounded-[14px]
            border
            border-[#E0D6C8]
            bg-[#F3EEE6]
            shadow-[0_8px_30px_rgba(56,44,31,0.035)]
            sm:block
          "
        >
          <div
            className="
              grid
              w-full
              grid-cols-2
              divide-y
              divide-[#DDD2C4]
              sm:grid-cols-2
              sm:divide-x
              sm:divide-y-0
              lg:grid-cols-5
            "
          >
            {benefits.map(
              (benefit) => {
                const Icon =
                  benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="
                      group
                      flex
                      min-w-0
                      items-center
                      gap-3
                      px-5
                      py-4
                      transition-colors
                      duration-300
                      hover:bg-[#F8F4ED]
                      sm:px-5
                      sm:py-5
                      lg:min-h-21
                      lg:px-5
                      xl:px-6
                    "
                  >
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#D7C9B8]
                        bg-[#FAF8F5]
                        text-[#62584D]
                        transition-all
                        duration-300
                        group-hover:border-[#C7A46B]
                        group-hover:bg-white
                        group-hover:text-[#A47D3C]
                      "
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.45}
                      />
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-[10px]
                          font-semibold
                          text-[#2C2925]
                          sm:text-[11px]
                        "
                      >
                        {benefit.title}
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          text-[8px]
                          leading-tight
                          text-[#83786C]
                          sm:text-[9px]
                        "
                      >
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

type ProductCardProps = {
  product: Product;
  mobile?: boolean;
};

const ProductCard = ({
  product,
  mobile = false,
}: ProductCardProps) => {
  const navigate = useNavigate();

  const productType =
    product.subcategory ||
    product.category ||
    "Furniture";

  const isNew =
    product.isNewProduct ?? false;

  const productImage =
    getProductImage(product);

  const handleProductClick =
    () => {
      navigate(
        `/products/${product.slug}`,
      );
    };

  return (
    <article
      onClick={handleProductClick}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          handleProductClick();
        }
      }}
      role="button"
      tabIndex={0}
      className={`
        group
        relative
        min-w-0
        cursor-pointer
        overflow-hidden
        rounded-[14px]
        border
        border-[#E4DCCF]
        bg-white
        shadow-[0_3px_12px_rgba(45,37,29,0.035)]
        transition-all
        duration-500
        ease-out
        hover:-translate-y-1
        hover:border-[#D4C2A7]
        hover:shadow-[0_16px_35px_rgba(54,43,31,0.09)]

        ${
          mobile
            ? `
              w-[79vw]
              max-w-78
              shrink-0
              snap-start
            `
            : "w-full"
        }
      `}
    >
      <div
        className={`
          relative
          w-full
          overflow-hidden
          bg-[#F4F0E9]

          ${
            mobile
              ? "h-59"
              : "h-52.5 sm:h-57.5 lg:h-52.5 xl:h-56.25"
          }
        `}
      >
        <img
          src={productImage}
          alt={product.name}
          loading="lazy"
          className="
            block
            h-full
            w-full
            object-contain
            object-center
            p-0
            transition-transform
            duration-700
            ease-out
            group-hover:scale-[1.025]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-linear-to-t
            from-[#6F5A43]/2.5
            via-transparent
            to-white/8
          "
        />

        {isNew && (
          <span
            className="
              absolute
              left-3
              top-3
              rounded-full
              border
              border-white/40
              bg-[#B7894A]
              px-2.5
              py-1.5
              text-[7px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-white
              shadow-[0_5px_14px_rgba(115,77,22,0.16)]
              sm:text-[8px]
            "
          >
            New
          </span>
        )}

        <button
          type="button"
          aria-label={`Add ${product.name} to wishlist`}
          onClick={(event) => {
            event.stopPropagation();
          }}
          className="
            absolute
            right-3
            top-3
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            border
            border-[#E4DBCF]
            bg-[#FAF8F5]/95
            text-[#62584D]
            shadow-[0_5px_16px_rgba(0,0,0,0.06)]
            backdrop-blur-md
            transition-all
            duration-300
            hover:scale-105
            hover:border-[#CDB48F]
            hover:bg-white
            hover:text-[#A47D3C]
          "
        >
          <Heart
            size={16}
            strokeWidth={1.6}
          />
        </button>
      </div>

      <div
        className="
          min-w-0
          bg-white
          px-4
          pb-4
          pt-4
          sm:px-4
          sm:pb-5
          sm:pt-4
        "
      >
        <p
          className="
            truncate
            text-[8px]
            font-medium
            uppercase
            tracking-[0.14em]
            text-[#9A8F82]
            sm:text-[9px]
          "
        >
          {productType}
        </p>

        <h3
          className="
            mt-1.5
            truncate
            text-[13px]
            font-semibold
            leading-tight
            tracking-[-0.01em]
            text-[#24221F]
            sm:text-[14px]
          "
        >
          {product.name}
        </h3>

        <p
          className="
            mt-2.5
            text-[14px]
            font-semibold
            tracking-[-0.01em]
            text-[#171614]
            sm:text-[15px]
          "
        >
          ₹
          {Number(
            product.price,
          ).toLocaleString("en-IN")}
        </p>
      </div>

      <span
        className="
          absolute
          bottom-0
          left-0
          h-0.5
          w-full
          bg-[#B99051]
          opacity-0
          transition-all
          duration-500
          group-hover:opacity-100
        "
      />
    </article>
  );
};

export default NewArrivals;