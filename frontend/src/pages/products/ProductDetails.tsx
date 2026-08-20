import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import Breadcrumbs from "../../components/product/Breadcrumbs";
import ProductGrid from "../../components/product/ProductGrid";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

import {
  getProductBySlug,
  getProducts,
} from "../../api/product.api";

import type {
  Product,
  ProductImage,
} from "../../types/product";

const ProductDetails = () => {
  const { addToCart } = useCart();

  const {
    isWishlisted,
    toggleWishlist,
  } = useWishlist();

  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] =
    useState<Product | null>(null);

  const [relatedProducts, setRelatedProducts] =
    useState<Product[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);

  const [selectedColor, setSelectedColor] =
    useState("");

  const [
    selectedImageIndex,
    setSelectedImageIndex,
  ] = useState(0);

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      setError("Product not found");
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await getProductBySlug(slug);

        setProduct(data);
        setSelectedColor(
          data.colors?.[0] ||
            data.variants?.[0]?.color ||
            "",
        );
      } catch (error) {
        console.error(
          "Failed to fetch product:",
          error,
        );

        setProduct(null);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load product",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (!product?.category) {
      setRelatedProducts([]);
      return;
    }

    const fetchRelatedProducts =
      async () => {
        try {
          const result =
            await getProducts({
              category: product.category,
              limit: 5,
            });

          const related =
            result.products
              .filter(
                (item) =>
                  item.slug !== product.slug,
              )
              .slice(0, 4);

          setRelatedProducts(related);
        } catch (error) {
          console.error(
            "Failed to fetch related products:",
            error,
          );

          setRelatedProducts([]);
        }
      };

    void fetchRelatedProducts();
  }, [product?.category, product?.slug]);

  const availableColors = useMemo(() => {
    if (!product) {
      return [];
    }

    const colors = new Set<string>();

    product.colors?.forEach((color) => {
      if (color) {
        colors.add(color);
      }
    });

    product.variants?.forEach((variant) => {
      if (variant.color) {
        colors.add(variant.color);
      }
    });

    return Array.from(colors);
  }, [product]);

  const activeVariant = useMemo(() => {
    if (!product?.variants?.length) {
      return undefined;
    }

    if (!selectedColor) {
      return product.variants[0];
    }

    return (
      product.variants.find(
        (variant) =>
          variant.color?.toLowerCase() ===
          selectedColor.toLowerCase(),
      ) || product.variants[0]
    );
  }, [product, selectedColor]);

  const activeImages = useMemo<ProductImage[]>(() => {
    if (activeVariant?.images?.length) {
      return activeVariant.images;
    }

    if (product?.images?.length) {
      return product.images;
    }

    if (product?.image) {
      return [product.image];
    }

    return [];
  }, [activeVariant, product]);

  const activeImage =
    activeImages[selectedImageIndex] ||
    activeImages[0] ||
    product?.image;

  const activeColor =
    activeVariant?.color ||
    selectedColor ||
    availableColors[0] ||
    "";

  const activePrice =
    activeVariant?.price ??
    product?.price ??
    0;

  const activeStock =
    activeVariant?.stock ??
    product?.stock ??
    0;

  const activeMaterial =
    activeVariant?.material ||
    product?.material ||
    "Premium finish";

  useEffect(() => {
    setSelectedImageIndex(0);
    setQuantity(1);
  }, [selectedColor, slug]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FAF8F5]">
        <div
          className="
            mx-auto
            flex
            min-h-[70vh]
            max-w-375
            flex-col
            items-center
            justify-center
            px-5
            text-center
          "
        >
          <div
            className="
              h-8
              w-8
              animate-spin
              rounded-full
              border-2
              border-[#DCCFC0]
              border-t-[#8F6B3F]
            "
          />

          <p
            className="
              mt-5
              text-[10px]
              font-medium
              uppercase
              tracking-[0.18em]
              text-[#81776C]
            "
          >
            Loading product
          </p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#FAF8F5]">
        <div
          className="
            mx-auto
            flex
            min-h-[70vh]
            max-w-375
            flex-col
            items-center
            justify-center
            px-5
            text-center
          "
        >
          <span
            className="
              font-serif
              text-[64px]
              leading-none
              text-[#B7894A]/25
            "
          >
            404
          </span>

          <h1
            className="
              mt-5
              font-serif
              text-[34px]
              tracking-[-0.035em]
              text-[#302B25]
            "
          >
            Product not found
          </h1>

          <p
            className="
              mt-3
              max-w-md
              text-[13px]
              leading-6
              text-[#81776C]
            "
          >
            {error ||
              "The product you're looking for may have been removed or is no longer available."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
            className="
              mt-7
              flex
              items-center
              gap-2
              rounded-xl
              bg-[#8F6B3F]
              px-6
              py-3.5
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-white
              shadow-[0_10px_25px_rgba(143,107,63,0.18)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#795832]
            "
          >
            <ArrowLeft size={14} />
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  const wishlisted =
    isWishlisted(product._id);

  const rating =
    product.rating ?? 0;

  const reviews =
    product.reviews ?? 0;

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1),
    );
  };

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(
        activeStock,
        current + 1,
      ),
    );
  };

  const handleColorChange = (
    color: string,
  ) => {
    setSelectedColor(color);
    setSelectedImageIndex(0);
    setQuantity(1);
  };

  const handleThumbnailChange = (
    index: number,
  ) => {
    setSelectedImageIndex(index);
  };

  const handleAddToCart = () => {
    if (activeStock <= 0) {
      return;
    }

    for (
      let i = 0;
      i < quantity;
      i++
    ) {
      addToCart(product, {
        variantId: activeVariant?._id,
      });
    }
  };

  const handleBuyNow = () => {
    if (activeStock <= 0) {
      return;
    }

    for (
      let i = 0;
      i < quantity;
      i++
    ) {
      addToCart(product, {
        variantId: activeVariant?._id,
      });
    }

    navigate("/checkout");
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <section>
        <div
          className="
            mx-auto
            max-w-375
            px-5
            pb-4
            pt-5
            sm:px-8
            sm:pb-5
            sm:pt-7
            lg:px-12
            lg:pt-8
            xl:px-16
          "
        >
          <Breadcrumbs />
        </div>
      </section>

      <section
        className="
          pb-16
          sm:pb-20
          lg:pb-24
        "
      >
        <div
          className="
            mx-auto
            grid
            max-w-375
            gap-8
            px-5
            sm:px-8
            lg:grid-cols-[1.02fr_0.98fr]
            lg:gap-10
            lg:px-12
            xl:gap-14
            xl:px-16
          "
        >
          <div>
            <div
              className="
                group
                relative
                aspect-[1/0.96]
                overflow-hidden
                rounded-[22px]
                border
                border-[#E3DBD0]
                bg-[#F1ECE4]
                shadow-[0_15px_45px_rgba(55,43,31,0.055)]
                sm:rounded-3xl
                lg:aspect-[1/0.93]
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  h-[58%]
                  w-[58%]
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-[#D9C6A9]/20
                  blur-[55px]
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  p-7
                  sm:p-10
                  lg:p-12
                  xl:p-14
                "
              >
                {activeImage?.url ? (
                  <img
                    key={
                      activeImage.publicId ||
                      activeImage.url
                    }
                    src={activeImage.url}
                    alt={product.name}
                    className="
                      h-full
                      w-full
                      object-contain
                      object-center
                      drop-shadow-[0_18px_22px_rgba(45,35,25,0.08)]
                      transition-all
                      duration-500
                      ease-out
                      group-hover:scale-[1.018]
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-full
                      w-full
                      items-center
                      justify-center
                      text-[11px]
                      uppercase
                      tracking-[0.18em]
                      text-[#A0988E]
                    "
                  >
                    Image unavailable
                  </div>
                )}
              </div>

              {product.isNewProduct && (
                <div
                  className="
                    absolute
                    left-4
                    top-4
                    rounded-full
                    border
                    border-[#D6B77F]/60
                    bg-[#F4E4C8]/95
                    px-3
                    py-1.5
                    shadow-sm
                    backdrop-blur-md
                    sm:left-5
                    sm:top-5
                  "
                >
                  <span
                    className="
                      text-[7px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-[#70512E]
                      sm:text-[8px]
                    "
                  >
                    New Arrival
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={async () => {
                  await toggleWishlist(product);
                }}
                aria-label="Add to wishlist"
                className="
                  absolute
                  right-4
                  top-4
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/70
                  bg-white/85
                  text-[#403A33]
                  shadow-[0_7px_22px_rgba(45,35,25,0.08)]
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:bg-white
                  sm:right-5
                  sm:top-5
                  sm:h-11
                  sm:w-11
                "
              >
                <Heart
                  size={18}
                  strokeWidth={1.4}
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
            </div>

            {activeImages.length > 0 && (
              <div
                className="
                  mt-3
                  grid
                  grid-cols-2
                  gap-2.5
                  sm:grid-cols-4
                  sm:gap-3
                "
              >
                {activeImages.map(
                  (image, index) => {
                    const isActive =
                      selectedImageIndex ===
                      index;

                    return (
                      <button
                        key={
                          image.publicId ||
                          image.url ||
                          index
                        }
                        type="button"
                        onClick={() =>
                          handleThumbnailChange(
                            index,
                          )
                        }
                        className={`
                          group
                          relative
                          aspect-square
                          overflow-hidden
                          rounded-[14px]
                          border
                          bg-[#F1ECE4]
                          transition-all
                          duration-300
                          ${
                            isActive
                              ? `
                                border-[#A4773E]
                                bg-[#EFE5D8]
                                shadow-[0_5px_18px_rgba(164,119,62,0.12)]
                                ring-1
                                ring-[#A4773E]/25
                              `
                              : `
                                border-[#E1D8CD]
                                hover:border-[#BDA47F]
                                hover:bg-[#F5EFE7]
                              `
                          }
                        `}
                      >
                        <img
                          src={image.url}
                          alt={`${product.name} preview ${
                            index + 1
                          }`}
                          loading="lazy"
                          className="
                            h-full
                            w-full
                            object-contain
                            p-2.5
                            transition-transform
                            duration-500
                            group-hover:scale-[1.045]
                          "
                        />
                      </button>
                    );
                  },
                )}
              </div>
            )}
          </div>

          <div
            className="
              lg:sticky
              lg:top-20
              lg:self-start
            "
          >
            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.3em]
                text-[#A4773E]
                sm:text-[9px]
              "
            >
              {product.subcategory ||
                product.category}
            </p>

            <h1
              className="
                mt-2.5
                max-w-163
                font-serif
                text-[38px]
                font-medium
                leading-[0.98]
                tracking-[-0.045em]
                text-[#25221E]
                sm:text-[46px]
                lg:text-[50px]
                xl:text-[56px]
              "
            >
              {product.name}
            </h1>

            <div
              className="
                mt-4
                flex
                items-center
                gap-3
              "
            >
              <div className="flex items-center gap-1">
                <Star
                  size={14}
                  strokeWidth={1.1}
                  fill="#C98A24"
                  className="text-[#C98A24]"
                />

                <span
                  className="
                    text-[11px]
                    font-semibold
                    text-[#403A33]
                  "
                >
                  {rating.toFixed(1)}
                </span>
              </div>

              <span
                className="
                  h-3.5
                  w-px
                  bg-[#DCD2C5]
                "
              />

              <span
                className="
                  text-[10px]
                  text-[#81776C]
                "
              >
                {reviews} reviews
              </span>
            </div>

            <div
              className="
                mt-5
                flex
                items-baseline
                gap-3
              "
            >
              <span
                className="
                  text-[26px]
                  font-semibold
                  tracking-tight
                  text-[#302B25]
                  sm:text-[29px]
                "
              >
                ₹
                {activePrice.toLocaleString(
                  "en-IN",
                )}
              </span>

              <span
                className="
                  text-[8px]
                  text-[#9A9186]
                  sm:text-[9px]
                "
              >
                Inclusive of all taxes
              </span>
            </div>

            <div className="my-5 h-px bg-[#E3DBD1]" />

            <p
              className="
                max-w-153
                text-[12px]
                leading-6
                text-[#71685E]
                sm:text-[13px]
                sm:leading-6
              "
            >
              {product.description}
            </p>

            <div
              className="
                mt-5
                flex
                items-center
                gap-4
              "
            >
              <span
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.17em]
                  text-[#958B80]
                "
              >
                Material
              </span>

              <span
                className="
                  text-[11px]
                  font-medium
                  text-[#403A33]
                "
              >
                {activeMaterial}
              </span>
            </div>

            {availableColors.length > 0 && (
              <div className="mt-6">
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span
                    className="
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-[#403A33]
                      sm:text-[9px]
                    "
                  >
                    Choose colour
                  </span>

                  <span
                    className="
                      text-[9px]
                      font-medium
                      text-[#8D8378]
                    "
                  >
                    {activeColor}
                  </span>
                </div>

                <div
                  className="
                    mt-3
                    flex
                    flex-wrap
                    gap-2
                  "
                >
                  {availableColors.map(
                    (color) => {
                      const isSelected =
                        activeColor.toLowerCase() ===
                        color.toLowerCase();

                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() =>
                            handleColorChange(color)
                          }
                          className={`
                            flex
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            px-3.5
                            py-2
                            text-[9px]
                            font-medium
                            transition-all
                            duration-300
                            ${
                              isSelected
                                ? `
                                  border-[#A4773E]
                                  bg-[#F0E5D6]
                                  text-[#76562F]
                                `
                                : `
                                  border-[#DDD4C9]
                                  bg-white
                                  text-[#62594F]
                                  hover:border-[#BDA47F]
                                `
                            }
                          `}
                        >
                          {isSelected && (
                            <Check
                              size={10}
                              strokeWidth={2}
                            />
                          )}

                          {color}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
            )}

            <div
              className="
                mt-5
                flex
                items-center
                gap-2
              "
            >
              {activeStock > 0 ? (
                <>
                  <span
                    className="
                      h-1.5
                      w-1.5
                      rounded-full
                      bg-[#6B7C59]
                    "
                  />

                  <span
                    className="
                      text-[9px]
                      font-medium
                      text-[#68745D]
                    "
                  >
                    In stock
                  </span>

                  <span
                    className="
                      text-[9px]
                      text-[#A0988E]
                    "
                  >
                    · {activeStock} available
                  </span>
                </>
              ) : (
                <span
                  className="
                    text-[9px]
                    text-red-700
                  "
                >
                  Currently unavailable
                </span>
              )}
            </div>

            <div
              className="
                mt-6
                flex
                gap-2.5
              "
            >
              <div
                className="
                  flex
                  h-12
                  shrink-0
                  items-center
                  rounded-xl
                  border
                  border-[#DCD2C5]
                  bg-white
                "
              >
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="
                    flex
                    h-full
                    w-9
                    items-center
                    justify-center
                    text-[#71675D]
                    disabled:opacity-30
                  "
                >
                  <Minus size={13} />
                </button>

                <span
                  className="
                    w-7
                    text-center
                    text-[11px]
                    font-semibold
                    text-[#302B25]
                  "
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={
                    quantity >= activeStock ||
                    activeStock === 0
                  }
                  className="
                    flex
                    h-full
                    w-9
                    items-center
                    justify-center
                    text-[#71675D]
                    disabled:opacity-30
                  "
                >
                  <Plus size={13} />
                </button>
              </div>

              <button
                type="button"
                disabled={activeStock === 0}
                onClick={handleAddToCart}
                className="
                  group
                  flex
                  h-12
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#8F6B3F]
                  px-4
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-white
                  transition-all
                  hover:bg-[#795832]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                <ShoppingBag
                  size={15}
                  strokeWidth={1.5}
                />

                Add to Cart

                <ArrowRight
                  size={13}
                  strokeWidth={1.5}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </button>
            </div>

            <button
              type="button"
              disabled={activeStock === 0}
              onClick={handleBuyNow}
              className="
                mt-2.5
                flex
                h-12
                w-full
                items-center
                justify-center
                rounded-xl
                border
                border-[#BDA47F]
                bg-[#F4E8D7]
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-[#654A2C]
                transition-all
                hover:bg-[#EFE0CC]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              Buy Now
            </button>

            <div
              className="
                mt-6
                grid
                grid-cols-3
                divide-x
                divide-[#E3DBD1]
                border-y
                border-[#E3DBD1]
                py-4
              "
            >
              <div className="px-2 first:pl-0">
                <Truck
                  size={15}
                  strokeWidth={1.3}
                  className="text-[#9A7138]"
                />

                <p
                  className="
                    mt-1.5
                    text-[8px]
                    font-semibold
                    text-[#403A33]
                  "
                >
                  Delivery
                </p>

                <p
                  className="
                    mt-0.5
                    text-[7px]
                    leading-3.5
                    text-[#91877C]
                  "
                >
                  Safe doorstep delivery
                </p>
              </div>

              <div className="px-3">
                <ShieldCheck
                  size={15}
                  strokeWidth={1.3}
                  className="text-[#9A7138]"
                />

                <p
                  className="
                    mt-1.5
                    text-[8px]
                    font-semibold
                    text-[#403A33]
                  "
                >
                  Secure Payment
                </p>

                <p
                  className="
                    mt-0.5
                    text-[7px]
                    leading-3.5
                    text-[#91877C]
                  "
                >
                  Safe checkout
                </p>
              </div>

              <div className="px-2 last:pr-0">
                <Heart
                  size={15}
                  strokeWidth={1.3}
                  className="text-[#9A7138]"
                />

                <p
                  className="
                    mt-1.5
                    text-[8px]
                    font-semibold
                    text-[#403A33]
                  "
                >
                  Expert Support
                </p>

                <p
                  className="
                    mt-0.5
                    text-[7px]
                    leading-3.5
                    text-[#91877C]
                  "
                >
                  Design assistance
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
              className="
                mt-5
                hidden
                items-center
                gap-2
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-[#80603A]
                transition
                hover:text-[#4E3922]
                lg:flex
              "
            >
              <ArrowLeft size={12} />
              Continue shopping
            </button>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section
          className="
            border-t
            border-[#E4DDD4]
            bg-[#F8F4EE]
            pb-20
            pt-14
            sm:pb-24
            sm:pt-16
            lg:pb-28
          "
        >
          <div
            className="
              mx-auto
              max-w-375
              px-5
              sm:px-8
              lg:px-12
              xl:px-16
            "
          >
            <div
              className="
                mb-8
                flex
                items-end
                justify-between
              "
            >
              <div>
                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.3em]
                    text-[#A4773E]
                  "
                >
                  You may also like
                </p>

                <h2
                  className="
                    mt-2
                    font-serif
                    text-[30px]
                    leading-none
                    tracking-[-0.04em]
                    text-[#302B25]
                    sm:text-[38px]
                  "
                >
                  More from the collection
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/products")
                }
                className="
                  hidden
                  items-center
                  gap-2
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-[#76562F]
                  transition
                  hover:text-[#4E3922]
                  sm:flex
                "
              >
                View all
                <ArrowRight size={13} />
              </button>
            </div>

            <ProductGrid
              products={relatedProducts}
              viewMode="grid"
            />
          </div>
        </section>
      )}
    </main>
  );
};

export default ProductDetails;