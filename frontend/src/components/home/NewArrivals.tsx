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

import {
  getActiveOffers,
} from "../../api/offer.api";

import type {
  Product,
} from "../../types/product";

import type {
  Offer,
} from "../../types/offer";

/*
 * ========================================
 * BENEFITS
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

/*
 * ========================================
 * PRODUCT IMAGE HELPER
 * ========================================
 */

const getProductImage = (
  product: Product,
): string => {
  if (product.image?.url) {
    return product.image.url;
  }

  const firstGalleryImage =
    product.images?.[0];

  if (firstGalleryImage?.url) {
    return firstGalleryImage.url;
  }

  const firstVariantImage =
    product.variants?.[0]?.images?.[0];

  if (firstVariantImage?.url) {
    return firstVariantImage.url;
  }

  return "/placeholder-product.png";
};

/*
 * ========================================
 * OFFER HELPERS
 * ========================================
 */

const getEntityId = (
  value: string | Product,
): string => {
  return typeof value === "string"
    ? value
    : value._id;
};

const getApplicableOffer = (
  product: Product,
  offers: Offer[],
): Offer | null => {
  const now = new Date();

  const applicableOffers =
    offers.filter((offer) => {
      if (!offer.isActive) {
        return false;
      }

      const startDate =
        new Date(offer.startDate);

      const endDate =
        new Date(offer.endDate);

      if (
        Number.isNaN(startDate.getTime()) ||
        Number.isNaN(endDate.getTime())
      ) {
        return false;
      }

      if (
        now < startDate ||
        now > endDate
      ) {
        return false;
      }

      /*
       * Offer applies to every product.
       */

      if (offer.appliesTo === "all") {
        return true;
      }

      /*
       * Offer applies to selected products.
       */

      if (
        offer.appliesTo === "products"
      ) {
        return offer.productIds.some(
          (productId) =>
            getEntityId(productId) ===
            product._id,
        );
      }

      /*
       * Collection offers are intentionally
       * not matched here because Product does
       * not currently contain collection IDs.
       */

      return false;
    });

  if (applicableOffers.length === 0) {
    return null;
  }

  /*
   * If multiple offers apply, use the one
   * giving the customer the lowest price.
   */

  return applicableOffers.reduce(
    (bestOffer, currentOffer) => {
      const getDiscountedPrice = (
        offer: Offer,
      ) => {
        if (
          offer.discountType ===
          "percentage"
        ) {
          return Math.max(
            0,
            product.price -
              (
                product.price *
                offer.discountValue
              ) /
                100,
          );
        }

        return Math.max(
          0,
          product.price -
            offer.discountValue,
        );
      };

      return getDiscountedPrice(
        currentOffer,
      ) <
        getDiscountedPrice(bestOffer)
        ? currentOffer
        : bestOffer;
    },
  );
};

const getDiscountedPrice = (
  price: number,
  offer: Offer | null,
): number => {
  if (!offer) {
    return price;
  }

  if (
    offer.discountType ===
    "percentage"
  ) {
    return Math.max(
      0,
      price -
        (price * offer.discountValue) /
          100,
    );
  }

  return Math.max(
    0,
    price - offer.discountValue,
  );
};

const getOfferLabel = (
  offer: Offer,
): string => {
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

/*
 * ========================================
 * PRODUCT CARD
 * ========================================
 */

type ProductCardProps = {
  product: Product;
  offers: Offer[];
  mobile?: boolean;
};

const ProductCard = ({
  product,
  offers,
  mobile = false,
}: ProductCardProps) => {
  const navigate = useNavigate();

  const productType =
    product.subcategory ||
    product.category ||
    "Furniture";

  const productImage =
    getProductImage(product);

  const applicableOffer =
    getApplicableOffer(
      product,
      offers,
    );

  const originalPrice =
    Number(product.price);

  const discountedPrice =
    getDiscountedPrice(
      originalPrice,
      applicableOffer,
    );

  const hasOffer =
    applicableOffer !== null &&
    discountedPrice < originalPrice;

  const handleProductClick = () => {
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
        rounded-2xl
        border
        border-[#E5DED4]
        bg-white
        shadow-[0_4px_18px_rgba(45,37,29,0.035)]
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-[#D3C0A5]
        hover:shadow-[0_18px_38px_rgba(54,43,31,0.09)]

        ${
          mobile
            ? `
              w-[72vw]
              max-w-73
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
              ? "aspect-[4/4.4]"
              : "aspect-square"
          }
        `}
      >
        <img
          src={productImage}
          alt={product.name}
          loading="lazy"
          className="
            h-full
            w-full
            object-contain
            object-center
            p-2
            transition-transform
            duration-700
            ease-out
            group-hover:scale-[1.035]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-linear-to-t
            from-black/5
            via-transparent
            to-white/10
          "
        />

        <div
          className="
            absolute
            left-3
            top-3
            flex
            flex-col
            items-start
            gap-1.5
          "
        >
          {product.isNewProduct && (
            <span
              className="
                rounded-full
                bg-[#B7894A]
                px-2.5
                py-1
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-white
                shadow-sm
              "
            >
              New
            </span>
          )}

          {hasOffer &&
            applicableOffer && (
              <span
                className="
                  rounded-full
                  bg-[#302B25]
                  px-2.5
                  py-1
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-white
                  shadow-sm
                "
              >
                {getOfferLabel(
                  applicableOffer,
                )}
              </span>
            )}
        </div>

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
            bg-white/90
            text-[#62584D]
            shadow-sm
            backdrop-blur-md
            transition-all
            duration-300
            hover:scale-105
            hover:border-[#CDB48F]
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
          px-4
          pb-4
          pt-3.5
          sm:px-4
          sm:pb-5
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
            text-[14px]
            font-semibold
            leading-tight
            tracking-[-0.01em]
            text-[#24221F]
            sm:text-[15px]
          "
        >
          {product.name}
        </h3>

        {hasOffer ? (
          <div className="mt-2.5">
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-x-2
                gap-y-1
              "
            >
              <p
                className="
                  text-[14px]
                  font-semibold
                  tracking-[-0.01em]
                  text-[#171614]
                  sm:text-[15px]
                "
              >
                ₹
                {discountedPrice.toLocaleString(
                  "en-IN",
                )}
              </p>

              <p
                className="
                  text-[10px]
                  text-[#9A8F82]
                  line-through
                  sm:text-[11px]
                "
              >
                ₹
                {originalPrice.toLocaleString(
                  "en-IN",
                )}
              </p>
            </div>

            {applicableOffer && (
              <p
                className="
                  mt-1
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.08em]
                  text-[#A4773E]
                "
              >
                {getOfferLabel(
                  applicableOffer,
                )}
              </p>
            )}
          </div>
        ) : (
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
            {originalPrice.toLocaleString(
              "en-IN",
            )}
          </p>
        )}
      </div>
    </article>
  );
};

/*
 * ========================================
 * NEW ARRIVALS
 * ========================================
 */

const NewArrivals = () => {
  const navigate = useNavigate();

  const [products, setProducts] =
    useState<Product[]>([]);

  const [offers, setOffers] =
    useState<Offer[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * ========================================
   * FETCH PRODUCTS + ACTIVE OFFERS
   * ========================================
   */

  useEffect(() => {
    let cancelled = false;

    const fetchNewArrivals =
      async () => {
        try {
          setIsLoading(true);
          setError(null);

          const [
            productResult,
            activeOffers,
          ] = await Promise.all([
            getProducts({
              page: 1,
              limit: 12,
              sort: "newest",
            }),
            getActiveOffers(),
          ]);

          if (cancelled) {
            return;
          }

          const newProducts =
            productResult.products.filter(
              (product) =>
                product.isNewProduct,
            );

          setProducts(
            (
              newProducts.length > 0
                ? newProducts
                : productResult.products
            ).slice(0, 6),
          );

          setOffers(activeOffers);
        } catch (error) {
          if (cancelled) {
            return;
          }

          console.error(
            "Failed to fetch new arrivals:",
            error,
          );

          setProducts([]);
          setOffers([]);

          setError(
            error instanceof Error
              ? error.message
              : "Failed to load new arrivals",
          );
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      };

    void fetchNewArrivals();

    return () => {
      cancelled = true;
    };
  }, []);

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
        py-10
        sm:py-14
        lg:py-16
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
            mb-7
            flex
            items-end
            justify-between
            gap-5
            sm:mb-9
          "
        >
          <div>
            <div
              className="
                mb-2.5
                flex
                items-center
                gap-2.5
              "
            >
              <span
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.28em]
                  text-[#A4773E]
                  sm:text-[10px]
                "
              >
                Just In
              </span>

              <span
                className="
                  h-px
                  w-7
                  bg-[#D2B27D]
                "
              />
            </div>

            <h2
              className="
                font-serif
                text-[31px]
                font-medium
                leading-none
                tracking-[-0.035em]
                text-[#1C1B19]
                sm:text-[40px]
                lg:text-[44px]
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
              text-[11px]
              font-medium
              text-[#37332E]
              transition-all
              duration-300
              hover:border-[#B58A4A]
              hover:text-[#9A7138]
              sm:flex
              lg:text-[12px]
            "
          >
            <span>
              View all new arrivals
            </span>

            <ArrowRight
              size={15}
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
              gap-3
              sm:grid-cols-3
              sm:gap-5
              lg:grid-cols-6
              lg:gap-4
              xl:gap-5
            "
          >
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#E5DED4]
                  bg-white
                "
              >
                <div
                  className="
                    aspect-square
                    animate-pulse
                    bg-[#F0ECE5]
                  "
                />

                <div className="p-4">
                  <div
                    className="
                      h-2
                      w-16
                      animate-pulse
                      rounded
                      bg-[#E8E0D5]
                    "
                  />

                  <div
                    className="
                      mt-3
                      h-3
                      w-4/5
                      animate-pulse
                      rounded
                      bg-[#E8E0D5]
                    "
                  />

                  <div
                    className="
                      mt-4
                      h-3
                      w-1/2
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
                min-h-48
                flex-col
                items-center
                justify-center
                rounded-2xl
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
                  text-[23px]
                  text-[#302B25]
                "
              >
                Unable to load new arrivals
              </p>

              <p
                className="
                  mt-2
                  max-w-md
                  text-[11px]
                  leading-5
                  text-[#81776C]
                "
              >
                {error}
              </p>

              <button
                type="button"
                onClick={() => {
                  window.location.reload();
                }}
                className="
                  mt-5
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
                min-h-48
                items-center
                justify-center
                rounded-2xl
                border
                border-[#E4DCCF]
                bg-white
                px-5
                text-center
              "
            >
              <p
                className="
                  text-[12px]
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
              <div className="sm:hidden">
                <div
                  className="
                    -mx-4
                    flex
                    gap-3
                    overflow-x-auto
                    px-4
                    pb-4
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
                        offers={offers}
                        mobile
                      />
                    ),
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleViewAll}
                  className="
                    mt-2
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    py-3
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-[#8F6B3F]
                  "
                >
                  View all new arrivals

                  <ArrowRight
                    size={13}
                    strokeWidth={1.5}
                  />
                </button>
              </div>

              <div
                className="
                  hidden
                  grid-cols-3
                  gap-5
                  sm:grid
                  lg:hidden
                "
              >
                {products.map(
                  (product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      offers={offers}
                    />
                  ),
                )}
              </div>

              <div
                className="
                  hidden
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
                      offers={offers}
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
          mt-12
          w-full
          max-w-350
          px-4
          sm:mt-16
          sm:px-6
          lg:mt-18
          lg:px-8
        "
      >
        <div
          className="
            -mx-4
            flex
            gap-2.5
            overflow-x-auto
            px-4
            pb-2
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
                    min-w-53
                    items-center
                    gap-3
                    rounded-xl
                    border
                    border-[#E2D8CB]
                    bg-[#F4EEE5]
                    px-4
                    py-3.5
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
                      border-[#D5C5AF]
                      bg-[#FBF8F3]
                      text-[#A4773E]
                    "
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.5}
                    />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        text-[#302C27]
                      "
                    >
                      {benefit.title}
                    </p>

                    <p
                      className="
                        mt-1
                        truncate
                        text-[8px]
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
            overflow-hidden
            rounded-2xl
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
              grid-cols-2
              divide-y
              divide-[#DDD2C4]
              lg:grid-cols-5
              lg:divide-x
              lg:divide-y-0
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
                      py-5
                      transition-colors
                      duration-300
                      hover:bg-[#F8F4ED]
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

export default NewArrivals;