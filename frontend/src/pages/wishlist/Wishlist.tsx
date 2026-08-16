import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import type { Product } from "../../types/product";

import {
  getProductById,
} from "../../api/product.api";

import { useCart } from "../../context/CartContext";
import {
  useWishlist,
} from "../../context/WishlistContext";

const Wishlist = () => {
  const navigate = useNavigate();

  const {
    productIds,
    totalItems,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  /*
   * ----------------------------------------
   * Load Wishlist Products
   * ----------------------------------------
   */

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      if (productIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const results =
          await Promise.allSettled(
            productIds.map(
              (productId) =>
                getProductById(
                  productId,
                ),
            ),
          );

        if (cancelled) {
          return;
        }

        const validProducts =
          results
            .filter(
              (
                result,
              ): result is PromiseFulfilledResult<Product> =>
                result.status ===
                "fulfilled",
            )
            .map(
              (result) =>
                result.value,
            );

        setProducts(
          validProducts,
        );
      } catch (error) {
        console.error(
          "Failed to load wishlist products:",
          error,
        );

        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [productIds]);

  /*
   * ----------------------------------------
   * Add To Cart
   * ----------------------------------------
   */

  const handleAddToCart = (
    product: Product,
  ) => {
    addToCart(product);
  };

  /*
   * ----------------------------------------
   * Loading State
   * ----------------------------------------
   */

  if (loading) {
    return (
      <main
        className="
          min-h-screen
          bg-[#FAF8F5]
          px-5
          py-14
          sm:px-8
          lg:px-12
        "
      >
        <div className="mx-auto max-w-7xl">
          <div
            className="
              h-3
              w-24
              animate-pulse
              rounded
              bg-[#E5DDD2]
            "
          />

          <div
            className="
              mt-4
              h-12
              w-64
              animate-pulse
              rounded
              bg-[#E5DDD2]
            "
          />

          <div
            className="
              mt-12
              grid
              grid-cols-2
              gap-4
              sm:grid-cols-3
              lg:grid-cols-4
            "
          >
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="
                    aspect-[4/4.8]
                    animate-pulse
                    rounded-2xl
                    bg-[#EEE8DF]
                  "
                />
              ),
            )}
          </div>
        </div>
      </main>
    );
  }

  /*
   * ----------------------------------------
   * Empty Wishlist
   * ----------------------------------------
   */

  if (productIds.length === 0) {
    return (
      <main
        className="
          min-h-screen
          bg-[#FAF8F5]
          px-5
          py-14
          sm:px-8
          lg:px-12
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[65vh]
            max-w-7xl
            flex-col
            items-center
            justify-center
            text-center
          "
        >
          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              border
              border-[#DCCDBA]
              bg-[#F3ECE3]
              text-[#9A7138]
            "
          >
            <Heart
              size={30}
              strokeWidth={1.25}
            />
          </div>

          <p
            className="
              mt-7
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.22em]
              text-[#A4773E]
            "
          >
            Saved Pieces
          </p>

          <h1
            className="
              mt-3
              font-serif
              text-[38px]
              tracking-tight
              text-[#302B25]
              sm:text-[48px]
            "
          >
            Nothing saved yet.
          </h1>

          <p
            className="
              mt-4
              max-w-md
              text-[13px]
              leading-6
              text-[#81776C]
            "
          >
            Save pieces you love
            and come back to them
            whenever you're ready.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
            className="
              mt-8
              flex
              items-center
              gap-2
              rounded-xl
              bg-[#29251F]
              px-6
              py-3.5
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-white
              transition-all
              hover:bg-[#3A342D]
              active:scale-[0.98]
            "
          >
            Explore Products

            <ArrowRight
              size={14}
              strokeWidth={1.5}
            />
          </button>
        </div>
      </main>
    );
  }

  /*
   * ----------------------------------------
   * Wishlist Page
   * ----------------------------------------
   */

  return (
    <main
      className="
        min-h-screen
        bg-[#FAF8F5]
        px-5
        py-12
        sm:px-8
        sm:py-16
        lg:px-12
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div
          className="
            flex
            flex-col
            gap-6
            border-b
            border-[#E3DBD0]
            pb-7
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-[#A4773E]
              "
            >
              Your saved collection
            </p>

            <h1
              className="
                mt-2
                font-serif
                text-[38px]
                tracking-tight
                text-[#302B25]
                sm:text-[48px]
              "
            >
              My Wishlist
            </h1>

            <p
              className="
                mt-2
                text-[12px]
                text-[#81776C]
              "
            >
              {totalItems}{" "}
              {totalItems === 1
                ? "piece"
                : "pieces"}{" "}
              saved
            </p>
          </div>

          <button
            type="button"
            onClick={clearWishlist}
            className="
              flex
              w-fit
              items-center
              gap-2
              rounded-lg
              border
              border-[#DCCFC0]
              px-4
              py-2.5
              text-[9px]
              font-semibold
              uppercase
              tracking-[0.12em]
              text-[#766B60]
              transition-all
              hover:border-[#B99A6B]
              hover:bg-[#F2EADF]
              hover:text-[#8A6436]
            "
          >
            <Trash2
              size={13}
              strokeWidth={1.5}
            />

            Clear Wishlist
          </button>
        </div>

        {/* Product Grid */}

        <div
          className="
            mt-10
            grid
            grid-cols-2
            gap-x-4
            gap-y-10
            sm:gap-x-6
            lg:grid-cols-3
            lg:gap-x-7
            lg:gap-y-14
            xl:grid-cols-4
          "
        >
          {products.map(
            (product) => (
              <article
                key={product._id}
                className="group min-w-0"
              >
                {/* Image */}

                <div
                  onClick={() =>
                    navigate(
                      `/products/${product.slug}`,
                    )
                  }
                  className="
                    relative
                    aspect-[4/4.7]
                    cursor-pointer
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[#E3DBD0]
                    bg-[#F1ECE4]
                  "
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="
                      h-full
                      w-full
                      object-contain
                      p-5
                      transition-transform
                      duration-500
                      group-hover:scale-[1.025]
                    "
                  />

                  {/* Remove */}

                  <button
                    type="button"
                    aria-label={`Remove ${product.name} from wishlist`}
                    onClick={(event) => {
                      event.stopPropagation();

                      void removeFromWishlist(
                        product._id,
                      );
                    }}
                    className="
                      absolute
                      right-3
                      top-3
                      z-10
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-white/90
                      text-[#9A7138]
                      shadow-sm
                      backdrop-blur-md
                      transition-all
                      hover:scale-105
                      hover:bg-white
                    "
                  >
                    <Heart
                      size={16}
                      fill="currentColor"
                      strokeWidth={1.4}
                    />
                  </button>
                </div>

                {/* Product Information */}

                <div className="pt-4">
                  <p
                    className="
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.15em]
                      text-[#A4773E]
                    "
                  >
                    {product.subcategory ||
                      product.category ||
                      "Furniture"}
                  </p>

                  <h2
                    className="
                      mt-1.5
                      truncate
                      font-serif
                      text-[17px]
                      text-[#302B25]
                    "
                  >
                    {product.name}
                  </h2>

                  <p
                    className="
                      mt-1.5
                      text-[13px]
                      font-semibold
                      text-[#302B25]
                    "
                  >
                    ₹
                    {product.price.toLocaleString(
                      "en-IN",
                    )}
                  </p>

                  {/* Add To Cart */}

                  <button
                    type="button"
                    onClick={() =>
                      handleAddToCart(
                        product,
                      )
                    }
                    className="
                      mt-4
                      flex
                      h-10
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      bg-[#29251F]
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.14em]
                      text-white
                      transition-all
                      hover:bg-[#3A342D]
                      active:scale-[0.985]
                    "
                  >
                    <ShoppingBag
                      size={13}
                      strokeWidth={1.5}
                    />

                    Add to Cart
                  </button>
                </div>
              </article>
            ),
          )}
        </div>
      </div>
    </main>
  );
};

export default Wishlist;