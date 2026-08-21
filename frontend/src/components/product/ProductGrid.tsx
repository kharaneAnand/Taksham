import {
  useEffect,
  useMemo,
  useState,
} from "react";

import ProductCard from "../product/ProductCard";

import type {
  Product,
} from "../../types/product";

import type {
  Offer,
} from "../../types/offer";

import type {
  Collection,
} from "../../types/collection";

import {
  getActiveOffers,
} from "../../api/offer.api";

import {
  getActiveCollections,
} from "../../api/collectionApi";

import {
  getProductOffer,
} from "../../utils/offer";

interface ProductGridProps {
  products: Product[];

  viewMode: "grid" | "list";

  onAddToCart?: (
    product: Product,
  ) => void;
}

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

const ProductGrid = ({
  products,
  viewMode,
  onAddToCart,
}: ProductGridProps) => {
  const [
    offers,
    setOffers,
  ] = useState<Offer[]>([]);

  const [
    collections,
    setCollections,
  ] = useState<Collection[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadOfferData =
      async (): Promise<void> => {
        try {
          const [
            activeOffers,
            activeCollections,
          ] = await Promise.all([
            getActiveOffers(),
            getActiveCollections(),
          ]);

          if (!isMounted) {
            return;
          }

          setOffers(activeOffers);
          setCollections(
            activeCollections,
          );
        } catch (error) {
          console.error(
            "Failed to load offer data",
            error,
          );
        }
      };

    void loadOfferData();

    return () => {
      isMounted = false;
    };
  }, []);

  const productOfferResults =
    useMemo(() => {
      return new Map(
        products.map((product) => [
          product._id,
          getProductOffer(
            product,
            offers,
            collections,
          ),
        ]),
      );
    }, [
      products,
      offers,
      collections,
    ]);

  if (products.length === 0) {
    return (
      <div
        className="
          flex
          min-h-90
          flex-col
          items-center
          justify-center
          rounded-[20px]
          border
          border-dashed
          border-[#DCCFC0]
          bg-[#F7F2EA]
          px-6
          text-center
        "
      >
        <span
          className="
            font-serif
            text-[42px]
            text-[#B7894A]/30
          "
        >
          00
        </span>

        <h2
          className="
            mt-3
            font-serif
            text-[28px]
            text-[#302B25]
          "
        >
          Nothing here yet.
        </h2>

        <p
          className="
            mt-2
            max-w-[320px]
            text-[13px]
            leading-5
            text-[#81776C]
          "
        >
          We're still curating this
          collection. Try another category.
        </p>
      </div>
    );
  }

  /*
   * ========================================
   * LIST VIEW
   * ========================================
   */

  if (viewMode === "list") {
    return (
      <div className="space-y-4 sm:space-y-5">
        {products.map((product) => {
          const productImage =
            getProductImage(product);

          const offerResult =
            productOfferResults.get(
              product._id,
            );

          const hasOffer =
            offerResult?.offer !== null &&
            offerResult?.offer !== undefined;

          const finalPrice =
            hasOffer && offerResult
              ? offerResult.finalPrice
              : product.price;

          return (
            <div
              key={product._id}
              className="
                grid
                grid-cols-[105px_1fr]
                gap-4
                rounded-2xl
                border
                border-[#E5DED4]
                bg-white/65
                p-3
                transition-all
                duration-300
                hover:border-[#D3C0A5]
                hover:shadow-[0_12px_30px_rgba(55,43,31,0.06)]
                sm:grid-cols-[160px_1fr]
                sm:gap-6
                sm:p-4
                lg:grid-cols-[180px_1fr]
              "
            >
              <div
                className="
                  aspect-square
                  overflow-hidden
                  rounded-xl
                  bg-[#F1ECE4]
                "
              >
                <img
                  src={productImage}
                  alt={product.name}
                  loading="lazy"
                  className="
                    h-full
                    w-full
                    object-contain
                    p-2
                    transition-transform
                    duration-500
                    hover:scale-[1.025]
                  "
                />
              </div>

              <div
                className="
                  flex
                  min-w-0
                  flex-col
                  justify-center
                "
              >
                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >
                  <div className="min-w-0">
                    <p
                      className="
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-widest
                        text-[#A4773E]
                      "
                    >
                      {product.category}
                    </p>

                    <h3
                      className="
                        mt-1.5
                        truncate
                        font-serif
                        text-[20px]
                        text-[#302B25]
                        sm:text-[24px]
                      "
                    >
                      {product.name}
                    </h3>
                  </div>

                  {hasOffer && offerResult && (
                    <span
                      className="
                        shrink-0
                        rounded-md
                        bg-[#F4E4C8]
                        px-2
                        py-1
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-wider
                        text-[#8A6436]
                      "
                    >
                      {offerResult.discountPercentage}% OFF
                    </span>
                  )}
                </div>

                {product.description && (
                  <p
                    className="
                      mt-2
                      hidden
                      max-w-41
                      text-[12px]
                      leading-5
                      text-[#81776C]
                      sm:block
                      sm:max-w-125
                      lg:text-[13px]
                    "
                  >
                    {product.description}
                  </p>
                )}

                <div
                  className="
                    mt-3
                    flex
                    flex-wrap
                    items-center
                    gap-3
                  "
                >
                  {hasOffer && offerResult ? (
                    <>
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >
                        <p
                          className="
                            text-[15px]
                            font-semibold
                            text-[#8A6436]
                            sm:text-[17px]
                          "
                        >
                          ₹
                          {Math.round(
                            finalPrice,
                          ).toLocaleString(
                            "en-IN",
                          )}
                        </p>

                        <p
                          className="
                            text-[11px]
                            text-[#9C9287]
                            line-through
                          "
                        >
                          ₹
                          {Math.round(
                            product.price,
                          ).toLocaleString(
                            "en-IN",
                          )}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p
                      className="
                        text-[15px]
                        font-semibold
                        text-[#302B25]
                        sm:text-[17px]
                      "
                    >
                      ₹
                      {product.price.toLocaleString(
                        "en-IN",
                      )}
                    </p>
                  )}

                  <span className="text-[#D1C7BC]">
                    •
                  </span>

                  <span
                    className="
                      text-[11px]
                      text-[#8D8378]
                    "
                  >
                    {product.material ??
                      "Premium finish"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onAddToCart?.(product)
                  }
                  className="
                    mt-4
                    w-fit
                    rounded-lg
                    bg-[#27231E]
                    px-5
                    py-2.5
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-white
                    transition-all
                    hover:bg-[#3A342D]
                    active:scale-[0.98]
                  "
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  /*
   * ========================================
   * GRID VIEW
   * ========================================
   */

  return (
    <div
      className="
        grid
        min-w-0
        grid-cols-2
        gap-x-3
        gap-y-9
        sm:gap-x-5
        sm:gap-y-11
        lg:grid-cols-3
        lg:gap-x-6
        lg:gap-y-14
        xl:grid-cols-4
        xl:gap-x-7
        xl:gap-y-16
      "
    >
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          offerResult={
            productOfferResults.get(
              product._id,
            )
          }
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;