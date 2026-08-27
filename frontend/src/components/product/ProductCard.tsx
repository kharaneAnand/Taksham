import {
  useMemo,
  useState,
} from "react";

import {
  ArrowUpRight,
  Heart,
  ShoppingBag,
  Star,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import type {
  Product,
  ProductImage,
} from "../../types/product";

import {
  useWishlist,
} from "../../context/WishlistContext";

import type {
  ProductOfferResult,
} from "../../utils/offer";

interface ProductCardProps {
  product: Product;

  offerResult?: ProductOfferResult;

  onAddToCart?: (
    product: Product,
  ) => void;
}


/*
 * ========================================
 * IMAGE HELPER
 * ========================================
 */

const getImageUrl = (
  image?: ProductImage | string,
): string => {
  if (!image) {
    return "/placeholder-product.png";
  }

  const imageUrl =
    typeof image === "string"
      ? image
      : image.url;

  if (!imageUrl) {
    return "/placeholder-product.png";
  }

  /*
   * ========================================
   * CLOUDINARY OPTIMIZATION
   * ========================================
   */

  if (
    imageUrl.includes(
      "res.cloudinary.com",
    )
  ) {
    return imageUrl.replace(
      "/upload/",
      "/upload/f_auto,q_auto,w_600/",
    );
  }

  return imageUrl;
};


const ProductCard = ({
  product,
  offerResult,
  onAddToCart,
}: ProductCardProps) => {
  const navigate = useNavigate();


  /*
   * ========================================
   * SELECTED COLOR
   * ========================================
   */

  const [
    selectedColor,
    setSelectedColor,
  ] = useState<string | null>(
    null,
  );


  /*
   * ========================================
   * LOADED IMAGE
   *
   * Tracks the exact image URL that has
   * successfully finished loading.
   * This avoids the useEffect loading-state race.
   * ========================================
   */

  const [
    loadedImage,
    setLoadedImage,
  ] = useState<string | null>(
    null,
  );


  const {
    isWishlisted,
    toggleWishlist,
  } = useWishlist();


  const wishlisted = isWishlisted(
    product._id,
  );


  /*
   * ========================================
   * CATEGORY
   * ========================================
   */

  const category =
    product.subcategory ||
    product.category ||
    "Furniture";


  /*
   * ========================================
   * AVAILABLE COLORS
   * ========================================
   */

  const availableColors = useMemo(() => {
    const variantColors =
      product.variants
        ?.map(
          (variant) =>
            variant.color?.trim(),
        )
        .filter(
          (
            color,
          ): color is string =>
            Boolean(color),
        ) ?? [];


    const productColors =
      product.colors
        ?.map(
          (color) =>
            color.trim(),
        )
        .filter(
          Boolean,
        ) ?? [];


    return Array.from(
      new Set([
        ...variantColors,
        ...productColors,
      ]),
    );
  }, [
    product.colors,
    product.variants,
  ]);


  /*
   * ========================================
   * SELECTED VARIANT
   * ========================================
   */

  const selectedVariant =
    product.variants?.find(
      (variant) =>
        variant.color?.toLowerCase() ===
        selectedColor?.toLowerCase(),
    );


  /*
   * ========================================
   * DISPLAY PRICE
   * ========================================
   */

  const displayPrice =
    selectedVariant?.price ??
    product.price;


  /*
   * ========================================
   * OFFER
   * ========================================
   */

  const hasOffer =
    offerResult?.offer !== null &&
    offerResult?.offer !== undefined;


  /*
   * ========================================
   * FINAL PRICE
   * ========================================
   */

  const finalPrice =
    hasOffer && offerResult
      ? Math.max(
          0,
          displayPrice *
            (
              1 -
              offerResult.discountPercentage /
                100
            ),
        )
      : displayPrice;


  /*
   * ========================================
   * DISPLAY IMAGE
   * ========================================
   */

  const productImage = useMemo(() => {
    if (
      selectedColor &&
      selectedVariant?.images?.[0]
    ) {
      return getImageUrl(
        selectedVariant.images[0],
      );
    }


    if (product.image) {
      return getImageUrl(
        product.image,
      );
    }


    if (product.images?.[0]) {
      return getImageUrl(
        product.images[0],
      );
    }


    return "/placeholder-product.png";
  }, [
    selectedColor,
    selectedVariant,
    product.image,
    product.images,
  ]);


  /*
   * ========================================
   * IMAGE LOADING STATE
   *
   * Loading is true until the CURRENT
   * productImage has finished loading.
   * ========================================
   */

  const imageLoading =
    loadedImage !== productImage;


  /*
   * ========================================
   * NAVIGATION
   * ========================================
   */

  const handleProductClick = () => {
    navigate(
      `/products/${product.slug}`,
    );
  };


  return (
    <article
      className="
        group
        min-w-0
        w-full
        overflow-hidden
      "
    >
      <div
        onClick={handleProductClick}
        role="link"
        tabIndex={0}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            event.preventDefault();

            handleProductClick();
          }
        }}
        className="
          relative
          isolate
          aspect-[4/4.7]
          w-full
          min-w-0
          cursor-pointer
          overflow-hidden
          rounded-[15px]
          border
          border-[#E3DBD0]
          bg-[#F1ECE4]
          shadow-[0_4px_18px_rgba(55,43,31,0.035)]
          transition-all
          duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]
          sm:rounded-[17px]
          lg:group-hover:-translate-y-1
          lg:group-hover:border-[#D5C1A4]
          lg:group-hover:shadow-[0_18px_45px_rgba(55,43,31,0.09)]
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            z-0
            h-[72%]
            w-[72%]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#D9C6A9]/20
            blur-[45px]
          "
        />


        {/* ========================================
            PRODUCT IMAGE
        ======================================== */}

        <div
          className="
            absolute
            inset-0
            z-10
            flex
            items-center
            justify-center
            overflow-hidden
          "
        >
          <div
            className="
              relative
              flex
              h-[88%]
              w-[88%]
              items-center
              justify-center
              overflow-hidden
            "
          >
            {imageLoading && (
              <div
                className="
                  absolute
                  left-1/2
                  top-1/2
                  h-[55%]
                  w-[55%]
                  -translate-x-1/2
                  -translate-y-1/2
                  animate-pulse
                  rounded-full
                  bg-[#E2D8CB]/70
                "
              />
            )}


            <img
              key={productImage}
              src={productImage}
              alt={product.name}
              loading="lazy"
              draggable={false}
              onLoad={() =>
                setLoadedImage(
                  productImage,
                )
              }
              onError={() =>
                setLoadedImage(
                  productImage,
                )
              }
              className={`
                relative
                z-10
                block
                h-full
                w-full
                min-h-0
                min-w-0
                max-h-full
                max-w-full
                object-contain
                object-center
                select-none
                transition-all
                duration-700
                ease-[cubic-bezier(0.22,1,0.36,1)]
                lg:group-hover:scale-[1.025]

                ${
                  imageLoading
                    ? "opacity-0 scale-[0.98]"
                    : "opacity-100 scale-100"
                }
              `}
            />
          </div>
        </div>


        <div
          className="
            pointer-events-none
            absolute
            inset-0
            z-20
            bg-linear-to-t
            from-[#3A2D21]/5.5
            via-transparent
            to-white/8
          "
        />


        {/* ========================================
            BADGES
        ======================================== */}

        <div
          className="
            absolute
            left-2.5
            top-2.5
            z-30
            flex
            flex-col
            items-start
            gap-1.5
            sm:left-3
            sm:top-3
          "
        >
          {product.isNewProduct && (
            <div
              className="
                rounded-[5px]
                border
                border-[#D6B77F]/60
                bg-[#F4E4C8]
                px-2.5
                py-1.5
                shadow-[0_4px_12px_rgba(60,45,30,0.08)]
              "
            >
              <span
                className="
                  text-[6px]
                  font-semibold
                  uppercase
                  tracking-[0.13em]
                  text-[#70512E]
                  sm:text-[7px]
                "
              >
                New
              </span>
            </div>
          )}


          {hasOffer && offerResult && (
            <div
              className="
                rounded-[5px]
                border
                border-[#B66F37]/35
                bg-[#8F6B3F]
                px-2.5
                py-1.5
                shadow-[0_4px_12px_rgba(60,45,30,0.12)]
              "
            >
              <span
                className="
                  text-[6px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-white
                  sm:text-[7px]
                "
              >
                {offerResult.discountPercentage}
                % OFF
              </span>
            </div>
          )}
        </div>


        {/* ========================================
            WISHLIST
        ======================================== */}

        <button
          type="button"
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          onClick={async (event) => {
            event.stopPropagation();

            await toggleWishlist(
              product,
            );
          }}
          className="
            absolute
            right-2.5
            top-2.5
            z-30
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            border
            border-white/70
            bg-white/80
            text-[#403A33]
            shadow-[0_5px_18px_rgba(45,35,25,0.08)]
            backdrop-blur-md
            transition-all
            duration-300
            hover:scale-105
            hover:bg-white
            active:scale-95
            sm:right-3
            sm:top-3
            sm:h-9
            sm:w-9
          "
        >
          <Heart
            size={14}
            strokeWidth={1.45}
            fill={
              wishlisted
                ? "currentColor"
                : "none"
            }
            className={
              wishlisted
                ? "text-[#9A7138]"
                : "text-[#403A33]"
            }
          />
        </button>


        {/* ========================================
            VIEW PRODUCT
        ======================================== */}

        <button
          type="button"
          aria-label={`View ${product.name}`}
          onClick={(event) => {
            event.stopPropagation();

            handleProductClick();
          }}
          className="
            absolute
            bottom-3
            right-3
            z-30
            hidden
            h-8
            w-8
            translate-y-2
            items-center
            justify-center
            rounded-full
            border
            border-[#E3D3BC]
            bg-[#F7EFE2]/95
            text-[#765B37]
            opacity-0
            shadow-[0_8px_22px_rgba(55,40,25,0.14)]
            backdrop-blur-md
            transition-all
            duration-300
            lg:flex
            lg:group-hover:translate-y-0
            lg:group-hover:opacity-100
            hover:bg-[#EFE1CC]
            active:scale-95
          "
        >
          <ArrowUpRight
            size={14}
            strokeWidth={1.45}
          />
        </button>
      </div>


      {/* ========================================
          PRODUCT DETAILS
      ======================================== */}

      <div
        className="
          min-w-0
          px-0.5
          pt-3
          sm:pt-3.5
        "
      >
        <div
          className="
            flex
            min-w-0
            items-start
            justify-between
            gap-3
          "
        >
          <button
            type="button"
            onClick={handleProductClick}
            className="
              min-w-0
              flex-1
              text-left
            "
          >
            <h3
              className="
                line-clamp-2
                min-h-9
                font-serif
                text-[15px]
                font-medium
                leading-[1.1]
                tracking-[-0.015em]
                text-[#292520]
                transition-colors
                hover:text-[#8A6436]
                sm:min-h-10
                sm:text-[17px]
              "
            >
              {product.name}
            </h3>

            <p
              className="
                mt-1.5
                truncate
                text-[7px]
                font-medium
                uppercase
                tracking-[0.13em]
                text-[#8E8478]
                sm:text-[8px]
              "
            >
              {category}
            </p>
          </button>


          <div
            className="
              shrink-0
              pt-0.5
              text-right
            "
          >
            {hasOffer ? (
              <>
                <div
                  className="
                    whitespace-nowrap
                    text-[11px]
                    font-semibold
                    tracking-[-0.01em]
                    text-[#8A6436]
                    sm:text-[13px]
                  "
                >
                  ₹
                  {Math.round(
                    finalPrice,
                  ).toLocaleString(
                    "en-IN",
                  )}
                </div>

                <div
                  className="
                    mt-0.5
                    whitespace-nowrap
                    text-[7px]
                    text-[#9C9287]
                    line-through
                    sm:text-[8px]
                  "
                >
                  ₹
                  {Math.round(
                    displayPrice,
                  ).toLocaleString(
                    "en-IN",
                  )}
                </div>
              </>
            ) : (
              <span
                className="
                  whitespace-nowrap
                  text-[11px]
                  font-semibold
                  tracking-[-0.01em]
                  text-[#29241F]
                  sm:text-[13px]
                "
              >
                ₹
                {displayPrice.toLocaleString(
                  "en-IN",
                )}
              </span>
            )}
          </div>
        </div>


        {/* ========================================
            COLORS
        ======================================== */}

        {availableColors.length > 0 && (
          <div
            className="
              mt-2
              flex
              flex-wrap
              items-center
              gap-1.5
            "
          >
            {availableColors.map(
              (color) => {
                const isSelected =
                  selectedColor?.toLowerCase() ===
                  color.toLowerCase();

                return (
                  <button
                    key={color}
                    type="button"
                    aria-label={`Select ${color}`}
                    title={color}
                    onClick={() =>
                      setSelectedColor(
                        color,
                      )
                    }
                    className={`
                      h-3
                      w-3
                      rounded-full
                      border
                      transition-all
                      duration-200
                      ${
                        isSelected
                          ? "scale-125 border-[#6A5134] ring-1 ring-[#D7C1A0]"
                          : "border-[#CFC4B7] hover:scale-110"
                      }
                    `}
                    style={{
                      backgroundColor:
                        color.toLowerCase(),
                    }}
                  />
                );
              },
            )}
          </div>
        )}


        {/* ========================================
            RATING
        ======================================== */}

        <div
          className="
            mt-2
            flex
            min-w-0
            items-center
            gap-1.5
          "
        >
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(
              (star) => (
                <Star
                  key={star}
                  size={9}
                  strokeWidth={1.5}
                  className={
                    star <= 4
                      ? "fill-[#C98A24] text-[#C98A24]"
                      : "text-[#D8CEC0]"
                  }
                />
              ),
            )}
          </div>
        </div>


        {/* ========================================
            ADD TO CART
        ======================================== */}

        <button
          type="button"
          onClick={() =>
            onAddToCart?.(
              product,
            )
          }
          className="
            group/cart
            mt-3
            flex
            h-9
            w-full
            items-center
            justify-center
            gap-2
            rounded-lg
            border
            border-[#D6C8B7]
            bg-[#F7F0E6]
            text-[7px]
            font-semibold
            uppercase
            tracking-[0.15em]
            text-[#6A5134]
            transition-all
            duration-300
            hover:border-[#B99A6B]
            hover:bg-[#EDE0CD]
            hover:text-[#76572F]
            active:scale-[0.985]
            sm:h-10
            sm:text-[8px]
          "
        >
          <ShoppingBag
            size={12}
            strokeWidth={1.45}
            className="
              transition-transform
              duration-300
              group-hover/cart:-translate-y-0.5
            "
          />

          <span>
            Add to Cart
          </span>

          <ArrowUpRight
            size={10}
            strokeWidth={1.45}
            className="
              -translate-x-1
              opacity-0
              transition-all
              duration-300
              group-hover/cart:translate-x-0
              group-hover/cart:opacity-100
            "
          />
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
