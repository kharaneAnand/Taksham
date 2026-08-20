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

interface ProductCardProps {
  product: Product;

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

  if (typeof image === "string") {
    return image;
  }

  return (
    image.url ||
    "/placeholder-product.png"
  );
};

const ProductCard = ({
  product,
  onAddToCart,
}: ProductCardProps) => {
  const navigate = useNavigate();

  const [selectedColor, setSelectedColor] =
    useState<string | null>(
      product.variants?.find(
        (variant) => variant.color,
      )?.color ?? null,
    );

  const rating =
    product.rating ?? 0;

  const reviews =
    product.reviews ?? 0;

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
   *
   * Prefer variant colors.
   * Fall back to product.colors.
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
        ?.map((color) =>
          color.trim(),
        )
        .filter(Boolean) ?? [];

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
   * DISPLAY IMAGE
   * ========================================
   *
   * Priority:
   *
   * 1. Selected color variant image
   * 2. Main product image
   * 3. First common gallery image
   * 4. Placeholder
   */

  const productImage = useMemo(() => {
    const variantImage =
      selectedVariant?.images?.[0];

    if (variantImage) {
      return getImageUrl(
        variantImage,
      );
    }

    if (product.image) {
      return getImageUrl(
        product.image,
      );
    }

    const galleryImage =
      product.images?.[0];

    if (galleryImage) {
      return getImageUrl(
        galleryImage,
      );
    }

    return "/placeholder-product.png";
  }, [
    product.image,
    product.images,
    selectedVariant,
  ]);

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
      {/* =====================================================
          PRODUCT IMAGE
      ===================================================== */}

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
        {/* Background glow */}

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

        {/* Product Image */}

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
              flex
              h-[88%]
              w-[88%]
              items-center
              justify-center
              overflow-hidden
            "
          >
            <img
              key={productImage}
              src={productImage}
              alt={product.name}
              loading="lazy"
              draggable={false}
              className="
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
                transition-transform
                duration-700
                ease-[cubic-bezier(0.22,1,0.36,1)]
                lg:group-hover:scale-[1.025]
              "
            />
          </div>
        </div>

        {/* Image atmosphere */}

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

        {/* =====================================================
            NEW BADGE
        ===================================================== */}

        {product.isNewProduct && (
          <div
            className="
              absolute
              left-2.5
              top-2.5
              z-30
              rounded-[5px]
              border
              border-[#D6B77F]/60
              bg-[#F4E4C8]
              px-2.5
              py-1.5
              shadow-[0_4px_12px_rgba(60,45,30,0.08)]
              sm:left-3
              sm:top-3
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

        {/* =====================================================
            WISHLIST
        ===================================================== */}

        <button
          type="button"
          aria-label={
            wishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          onClick={async (event) => {
            event.stopPropagation();

            await toggleWishlist(product);
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

        {/* =====================================================
            VIEW PRODUCT
        ===================================================== */}

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

      {/* =====================================================
          PRODUCT INFORMATION
      ===================================================== */}

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

          <span
            className="
              shrink-0
              whitespace-nowrap
              pt-0.5
              text-[11px]
              font-semibold
              tracking-[-0.01em]
              text-[#29241F]
              sm:text-[13px]
            "
          >
            ₹
            {(
              selectedVariant?.price ??
              product.price
            ).toLocaleString(
              "en-IN",
            )}
          </span>
        </div>

        {/* =====================================================
            COLOR OPTIONS
        ===================================================== */}

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
                      setSelectedColor(color)
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

        {/* =====================================================
            RATING
        ===================================================== */}

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
                    star <= rating
                      ? "fill-[#C98A24] text-[#C98A24]"
                      : "text-[#D8CEC0]"
                  }
                />
              ),
            )}
          </div>

          <span
            className="
              text-[7px]
              text-[#91877B]
              sm:text-[8px]
            "
          >
            {rating > 0
              ? rating.toFixed(1)
              : "New"}
          </span>

          {reviews > 0 && (
            <span
              className="
                text-[7px]
                text-[#A39A90]
                sm:text-[8px]
              "
            >
              ({reviews})
            </span>
          )}
        </div>

        {/* =====================================================
            ADD TO CART
        ===================================================== */}

        <button
          type="button"
          onClick={() =>
            onAddToCart?.(product)
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