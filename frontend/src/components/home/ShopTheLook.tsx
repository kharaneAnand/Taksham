import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  Check,
  Heart,
  ShoppingBag,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import lookImage from "../../assets/images/looks/living-room-look.png";

import {
  getProducts,
} from "../../api/product.api";

import type {
  Product,
} from "../../types/product";

import {
  useCart,
} from "../../context/CartContext";

import {
  useWishlist,
} from "../../context/WishlistContext";


/*
 * ========================================
 * Hotspot Positions
 * ========================================
 *
 * These positions belong to the curated
 * living-room image.
 *
 * Products themselves come from the
 * Product Service.
 * ========================================
 */

const HOTSPOT_POSITIONS = [
  "left-[45%] top-[49%]",
  "left-[48%] top-[85%]",
  "left-[23%] top-[18%]",
  "left-[7%] top-[70%]",
  "left-[80%] top-[80%]",
  "left-[15%] top-[40%]",
];


/*
 * ========================================
 * Component
 * ========================================
 */

const ShopTheLook = () => {
  const navigate = useNavigate();

  const {
    addToCart,
  } = useCart();

  const {
    isWishlisted,
    toggleWishlist,
  } = useWishlist();


  /*
   * ----------------------------------------
   * Products
   * ----------------------------------------
   */

  const [products, setProducts] =
    useState<Product[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  /*
   * ----------------------------------------
   * Active product
   * ----------------------------------------
   */

  const [activeProduct, setActiveProduct] =
    useState(0);

  const [isProductView, setIsProductView] =
    useState(false);


  /*
   * ========================================
   * Fetch Products
   * ========================================
   *
   * We intentionally fetch a small number
   * because Shop The Look is a curated
   * homepage section.
   *
   * The Admin Panel can later populate
   * the database with more products.
   * ========================================
   */

  useEffect(() => {
    const fetchLookProducts =
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
            "Failed to fetch Shop The Look products:",
            error,
          );

          setProducts([]);

          setError(
            error instanceof Error
              ? error.message
              : "Failed to load products",
          );
        } finally {
          setIsLoading(false);
        }
      };

    fetchLookProducts();
  }, []);


  /*
   * ========================================
   * Selected Product
   * ========================================
   */

  const selectedProduct =
    products[activeProduct] ??
    products[0];


  /*
   * ========================================
   * Remaining Products
   * ========================================
   */

  const remainingProducts =
    useMemo(() => {
      if (!selectedProduct) {
        return [];
      }

      return products.filter(
        (_, index) =>
          index !== activeProduct,
      );
    }, [
      products,
      activeProduct,
      selectedProduct,
    ]);


  /*
   * ========================================
   * Product Image
   * ========================================
   */

  const getProductImage = (
    product: Product,
  ) => {
    return (
      product.image ||
      product.images?.[0] ||
      ""
    );
  };


  /*
   * ========================================
   * Product Price
   * ========================================
   */

  const getProductPrice = (
    product: Product,
  ) => {
    return `₹${product.price.toLocaleString(
      "en-IN",
    )}`;
  };


  /*
   * ========================================
   * Select Product
   * ========================================
   */

  const handleSelectProduct = (
    index: number,
  ) => {
    setActiveProduct(index);
    setIsProductView(false);
  };


  /*
   * ========================================
   * View Product
   * ========================================
   */

  const handleViewProduct = () => {
    if (!selectedProduct) {
      return;
    }

    navigate(
      `/products/${selectedProduct.slug}`,
    );
  };





  /*
   * ========================================
   * Add All Products
   * ========================================
   */

  const handleAddAllToCart = () => {
    products.forEach((product) => {
      if (product.stock > 0) {
        addToCart(product);
      }
    });
  };


  /*
   * ========================================
   * Wishlist
   * ========================================
   */

  const handleWishlist = async (
    product: Product,
  ) => {
    try {
      await toggleWishlist(product);
    } catch (error) {
      console.error(
        "Failed to update wishlist:",
        error,
      );
    }
  };


  /*
   * ========================================
   * Loading
   * ========================================
   */

  if (isLoading) {
    return (
      <section
        className="
          w-full
          bg-[#FAF8F4]
          py-16
          lg:py-20
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-355
            flex-col
            items-center
            justify-center
            px-4
            text-center
            sm:px-6
            lg:px-8
            xl:px-10
          "
        >
          <div
            className="
              h-7
              w-7
              animate-spin
              rounded-full
              border-2
              border-[#DCCFC0]
              border-t-[#A4773E]
            "
          />

          <p
            className="
              mt-4
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.25em]
              text-[#83796D]
            "
          >
            Curating the look
          </p>
        </div>
      </section>
    );
  }


  /*
   * ========================================
   * Empty State
   * ========================================
   */

  if (!selectedProduct) {
    return (
      <section
        className="
          w-full
          bg-[#FAF8F4]
          py-14
          lg:py-20
        "
      >
        <div
          className="
            mx-auto
            max-w-355
            px-4
            text-center
            sm:px-6
            lg:px-8
            xl:px-10
          "
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#B7894A]" />

            <span
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.3em]
                text-[#A4773E]
              "
            >
              Curated Interior
            </span>

            <span className="h-px w-8 bg-[#B7894A]" />
          </div>

          <h2
            className="
              mt-3
              font-serif
              text-[32px]
              tracking-[-0.04em]
              text-[#211F1C]
            "
          >
            Shop the Look
          </h2>

          <p
            className="
              mx-auto
              mt-3
              max-w-md
              text-[11px]
              leading-5
              text-[#83796D]
            "
          >
            {error ||
              "Beautiful pieces for your space are coming soon."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#6B5138]
              px-5
              py-3
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-white
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#5A422E]
            "
          >
            Explore Products

            <ArrowRight size={12} />
          </button>
        </div>
      </section>
    );
  }


  /*
   * ========================================
   * Main Section
   * ========================================
   */

  return (
    <>
      {/* =================================================
          DESKTOP
      ================================================= */}

      <section
        className="
          relative
          hidden
          w-full
          overflow-hidden
          bg-[#FAF8F4]
          py-14
          sm:py-16
          lg:block
          lg:py-20
        "
      >
        {/* Background decoration */}

        <div
          className="
            pointer-events-none
            absolute
            -left-48
            top-16
            h-105
            w-105
            rounded-full
            bg-[#E8D7BC]/20
            blur-[120px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-25
            -right-48
            h-105
            w-105
            rounded-full
            bg-[#DCC6A4]/15
            blur-[120px]
          "
        />

        <div
          className="
            relative
            z-10
            mx-auto
            w-full
            max-w-355
            px-4
            sm:px-6
            lg:px-8
            xl:px-10
          "
        >

          {/* Header */}

          <div
            className="
              mb-7
              flex
              items-end
              justify-between
              gap-6
              sm:mb-8
              lg:mb-9
            "
          >
            <div>

              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#B7894A]" />

                <span
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.34em]
                    text-[#A4773E]
                    sm:text-[9px]
                  "
                >
                  Curated Interior
                </span>
              </div>

              <h2
                className="
                  mt-2.5
                  font-serif
                  text-[32px]
                  font-medium
                  leading-[0.95]
                  tracking-[-0.045em]
                  text-[#211F1C]
                  sm:text-[38px]
                  lg:text-[42px]
                "
              >
                Shop the Look
              </h2>

              <p
                className="
                  mt-2.5
                  max-w-130
                  text-[10px]
                  leading-5
                  text-[#83796D]
                  sm:text-[12px]
                "
              >
                A thoughtfully composed space,
                brought together piece by piece.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
              className="
                group
                hidden
                items-center
                gap-2
                border-b
                border-[#CDBA9E]
                pb-1
                text-[10px]
                font-medium
                text-[#423A31]
                transition-all
                duration-300
                hover:border-[#A4773E]
                hover:text-[#A4773E]
                sm:flex
              "
            >
              View all looks

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


          {/* Main card */}

          <div
            className="
              overflow-hidden
              rounded-[26px]
              border
              border-[#E3D8CA]
              bg-[#FFFCF8]
              shadow-[0_28px_90px_rgba(64,49,32,0.09)]
              lg:rounded-[30px]
            "
          >

            <div
              className="
                grid
                items-stretch
                lg:grid-cols-[minmax(0,1.55fr)_minmax(380px,0.65fr)]
              "
            >

              {/* =================================================
                  ROOM IMAGE
              ================================================= */}

              <div
                className="
                  relative
                  min-w-0
                  self-stretch
                  overflow-hidden
                  bg-[#EAE3D9]
                "
              >

                <div
                  className="
                    relative
                    aspect-3/2
                    w-full
                    overflow-hidden
                    sm:aspect-16/10
                    lg:aspect-3/2
                  "
                >

                  {/* ROOM */}

                  <div
                    className={`
                      absolute
                      inset-0
                      transition-all
                      duration-700
                      ease-[cubic-bezier(0.22,1,0.36,1)]
                      ${
                        isProductView
                          ? "scale-[0.96] opacity-0"
                          : "scale-100 opacity-100"
                      }
                    `}
                  >

                    <img
                      src={lookImage}
                      alt="Curated living room interior"
                      className="
                        absolute
                        inset-0
                        h-full
                        w-full
                        object-cover
                        object-center
                      "
                    />

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-linear-to-t
                        from-[#21180F]/25
                        via-transparent
                        to-[#FFF9F0]/5
                      "
                    />

                    {/* Collection badge */}

                    <div
                      className="
                        absolute
                        left-4
                        top-4
                        flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-white/65
                        bg-white/65
                        px-3.5
                        py-2
                        shadow-[0_8px_25px_rgba(40,30,20,0.10)]
                        backdrop-blur-xl
                        sm:left-5
                        sm:top-5
                      "
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#B7894A]" />

                      <span
                        className="
                          text-[7px]
                          font-semibold
                          uppercase
                          tracking-[0.24em]
                          text-[#5E5040]
                          sm:text-[8px]
                        "
                      >
                        Living Collection
                      </span>
                    </div>


                    {/* Counter */}

                    <div
                      className="
                        absolute
                        right-4
                        top-4
                        flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-white/55
                        bg-white/55
                        px-3
                        py-2
                        backdrop-blur-xl
                        sm:right-5
                        sm:top-5
                      "
                    >
                      <span className="text-[9px] font-semibold text-[#4E4438]">
                        {String(
                          activeProduct + 1,
                        ).padStart(2, "0")}
                      </span>

                      <span className="h-px w-5 bg-[#8C7A65]/50" />

                      <span className="text-[9px] text-[#8C7A65]">
                        {String(
                          products.length,
                        ).padStart(2, "0")}
                      </span>
                    </div>


                    {/* Hotspots */}

                    {products.map(
                      (
                        product,
                        index,
                      ) => {
                        const isActive =
                          index ===
                          activeProduct;

                        return (
                          <button
                            key={product._id}
                            type="button"
                            onClick={() =>
                              handleSelectProduct(
                                index,
                              )
                            }
                            aria-label={`View ${product.name}`}
                            className={`
                              absolute
                              ${
                                HOTSPOT_POSITIONS[
                                  index %
                                    HOTSPOT_POSITIONS.length
                                ]
                              }
                              z-30
                              -translate-x-1/2
                              -translate-y-1/2
                              outline-none
                            `}
                          >

                            <span
                              className={`
                                absolute
                                -inset-2.5
                                rounded-full
                                border
                                border-white
                                transition-all
                                duration-500
                                ${
                                  isActive
                                    ? "scale-100 opacity-100"
                                    : "scale-75 opacity-0"
                                }
                              `}
                            />

                            {isActive && (
                              <span
                                className="
                                  absolute
                                  -inset-1
                                  animate-ping
                                  rounded-full
                                  bg-[#B7894A]/20
                                "
                              />
                            )}

                            <span
                              className={`
                                relative
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-white
                                shadow-[0_7px_22px_rgba(64,43,20,0.28)]
                                transition-all
                                duration-300
                                sm:h-9
                                sm:w-9
                                ${
                                  isActive
                                    ? "scale-110 bg-[#B7894A]"
                                    : "bg-[#B7894A]/90 hover:scale-110 hover:bg-[#A4773E]"
                                }
                              `}
                            >
                              {isActive ? (
                                <Check
                                  size={13}
                                  strokeWidth={2}
                                  className="text-white"
                                />
                              ) : (
                                <span className="text-[8px] font-semibold text-white">
                                  {String(
                                    index + 1,
                                  ).padStart(
                                    2,
                                    "0",
                                  )}
                                </span>
                              )}
                            </span>

                            {/* Tooltip */}

                            <span
                              className={`
                                pointer-events-none
                                absolute
                                bottom-11
                                left-1/2
                                w-max
                                max-w-47.5
                                -translate-x-1/2
                                rounded-[13px]
                                border
                                border-white/70
                                bg-[#FFFCF7]/95
                                px-3
                                py-2.5
                                text-left
                                shadow-[0_15px_40px_rgba(45,34,23,0.17)]
                                backdrop-blur-xl
                                transition-all
                                duration-300
                                ${
                                  isActive
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-2 opacity-0"
                                }
                              `}
                            >
                              <span className="block text-[7px] uppercase tracking-[0.15em] text-[#A48662]">
                                {product.subcategory ||
                                  product.category}
                              </span>

                              <span className="mt-0.5 block text-[10px] font-semibold text-[#28241F]">
                                {product.name}
                              </span>

                              <span className="mt-0.5 block text-[9px] font-medium text-[#A4773E]">
                                {getProductPrice(
                                  product,
                                )}
                              </span>
                            </span>

                          </button>
                        );
                      },
                    )}


                    {/* Bottom controls */}

                    <div
                      className="
                        absolute
                        bottom-4
                        left-4
                        right-4
                        flex
                        items-center
                        justify-between
                        sm:bottom-5
                        sm:left-5
                        sm:right-5
                      "
                    >

                      <div
                        className="
                          flex
                          items-center
                          gap-1.5
                          rounded-full
                          border
                          border-white/55
                          bg-white/45
                          px-3
                          py-2
                          shadow-[0_5px_20px_rgba(40,30,20,0.08)]
                          backdrop-blur-md
                        "
                      >
                        {products.map(
                          (
                            product,
                            index,
                          ) => (
                            <button
                              key={product._id}
                              type="button"
                              onClick={() =>
                                handleSelectProduct(
                                  index,
                                )
                              }
                              aria-label={`Select ${product.name}`}
                              className={`
                                h-1.5
                                rounded-full
                                transition-all
                                duration-500
                                ${
                                  index ===
                                  activeProduct
                                    ? "w-5 bg-[#A4773E]"
                                    : "w-1.5 bg-[#6D5C49]/40 hover:bg-[#6D5C49]/70"
                                }
                              `}
                            />
                          ),
                        )}
                      </div>

                      <div
                        className="
                          hidden
                          items-center
                          gap-2
                          rounded-full
                          border
                          border-white/40
                          bg-black/10
                          px-3
                          py-2
                          text-[7px]
                          font-medium
                          uppercase
                          tracking-[0.16em]
                          text-white
                          backdrop-blur-md
                          sm:flex
                        "
                      >
                        <span className="h-1 w-1 rounded-full bg-white/80" />

                        Tap to explore
                      </div>

                    </div>

                  </div>


                  {/* =================================================
                      PRODUCT VIEW
                  ================================================= */}

                  <div
                    className={`
                      absolute
                      inset-0
                      flex
                      flex-col
                      items-center
                      justify-center
                      overflow-hidden
                      bg-[#F3EEE6]
                      px-8
                      transition-all
                      duration-700
                      ease-[cubic-bezier(0.22,1,0.36,1)]
                      ${
                        isProductView
                          ? "scale-100 opacity-100"
                          : "pointer-events-none scale-[1.04] opacity-0"
                      }
                    `}
                  >

                    <div
                      className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-1/2
                        h-[55%]
                        w-[55%]
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-[#D9C2A3]/20
                        blur-[70px]
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setIsProductView(false)
                      }
                      className="
                        absolute
                        left-5
                        top-5
                        z-30
                        flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-[#D8CCBD]
                        bg-white/75
                        px-3.5
                        py-2
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-[#5E5040]
                        shadow-[0_8px_25px_rgba(60,45,30,0.08)]
                        backdrop-blur-xl
                        transition-all
                        duration-300
                        hover:bg-white
                        hover:text-[#A4773E]
                      "
                    >
                      <ArrowRight
                        size={12}
                        strokeWidth={1.5}
                        className="rotate-180"
                      />

                      Back to room
                    </button>


                    <div
                      className="
                        absolute
                        right-5
                        top-5
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#D8CCBD]
                        bg-white/65
                        backdrop-blur-xl
                      "
                    >
                      <span className="font-serif text-[11px] text-[#A4773E]">
                        {String(
                          activeProduct + 1,
                        ).padStart(2, "0")}
                      </span>
                    </div>


                    <div
                      className="
                        relative
                        flex
                        h-[58%]
                        w-[86%]
                        items-center
                        justify-center
                        sm:h-[64%]
                        sm:w-[76%]
                      "
                    >
                      <div
                        className="
                          absolute
                          bottom-[8%]
                          h-7
                          w-[55%]
                          rounded-full
                          bg-[#6E5942]/15
                          blur-2xl
                        "
                      />

                      <img
                        src={getProductImage(
                          selectedProduct,
                        )}
                        alt={
                          selectedProduct.name
                        }
                        className="
                          relative
                          z-10
                          max-h-full
                          max-w-full
                          object-contain
                          drop-shadow-[0_25px_30px_rgba(62,45,29,0.14)]
                        "
                      />
                    </div>


                    <div className="relative z-20 mt-1 text-center">

                      <p
                        className="
                          text-[7px]
                          font-semibold
                          uppercase
                          tracking-[0.25em]
                          text-[#A4773E]
                        "
                      >
                        {selectedProduct.subcategory ||
                          selectedProduct.category}
                      </p>

                      <h3
                        className="
                          mt-1.5
                          font-serif
                          text-[22px]
                          tracking-[-0.035em]
                          text-[#29251F]
                          sm:text-[26px]
                        "
                      >
                        {selectedProduct.name}
                      </h3>

                      <p
                        className="
                          mt-1
                          text-[12px]
                          font-semibold
                          text-[#A4773E]
                        "
                      >
                        {getProductPrice(
                          selectedProduct,
                        )}
                      </p>

                      <button
                        type="button"
                        onClick={
                          handleViewProduct
                        }
                        className="
                          group
                          mx-auto
                          mt-3
                          flex
                          items-center
                          gap-2
                          rounded-full
                          border
                          border-[#CDBA9E]
                          bg-white/65
                          px-4
                          py-2
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-[0.12em]
                          text-[#5E5040]
                          backdrop-blur-md
                          transition-all
                          duration-300
                          hover:border-[#A4773E]
                          hover:bg-white
                          hover:text-[#A4773E]
                        "
                      >
                        View Details

                        <ArrowRight
                          size={11}
                          strokeWidth={1.5}
                          className="
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                          "
                        />
                      </button>

                    </div>

                  </div>

                </div>

              </div>


              {/* =================================================
                  RIGHT PANEL
              ================================================= */}

              <div
                className="
                  flex
                  min-w-0
                  min-h-full
                  flex-col
                  justify-center
                  bg-[#FDFBF8]
                  p-5
                  sm:p-6
                  lg:p-6
                  xl:p-7
                "
              >

                <div
                  className="
                    flex
                    items-start
                    justify-between
                    border-b
                    border-[#E8DED2]
                    pb-4
                  "
                >

                  <div>

                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#B7894A]" />

                      <p
                        className="
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-[0.22em]
                          text-[#A4773E]
                        "
                      >
                        Complete the room
                      </p>
                    </div>

                    <h3
                      className="
                        mt-2
                        font-serif
                        text-[21px]
                        font-medium
                        tracking-[-0.03em]
                        text-[#29251F]
                        sm:text-[22px]
                      "
                    >
                      Items in this look
                    </h3>

                    <p className="mt-1 text-[9px] text-[#968B7F]">
                      {products.length} pieces selected
                      for this space
                    </p>

                  </div>

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
                      border-[#DED0BD]
                      bg-[#F6EFE5]
                    "
                  >
                    <span className="font-serif text-[12px] text-[#A4773E]">
                      {String(
                        products.length,
                      ).padStart(2, "0")}
                    </span>
                  </div>

                </div>


                {/* Selected product */}

                <div
                  className="
                    relative
                    mt-4
                    overflow-hidden
                    rounded-[18px]
                    border
                    border-[#E5D8C8]
                    bg-[#F7F1E8]
                    p-2.5
                  "
                >

                  <div className="relative flex items-center gap-3">

                    <div
                      className="
                        h-15.5
                        w-15.5
                        shrink-0
                        overflow-hidden
                        rounded-[13px]
                        border
                        border-[#E0D3C3]
                        bg-[#EEE8DF]
                      "
                    >
                      <img
                        src={getProductImage(
                          selectedProduct,
                        )}
                        alt={
                          selectedProduct.name
                        }
                        className="
                          h-full
                          w-full
                          object-contain
                          p-1.5
                        "
                      />
                    </div>


                    <div className="min-w-0 flex-1">

                      <div
                        className="
                          flex
                          items-center
                          gap-1.5
                          text-[7px]
                          font-semibold
                          uppercase
                          tracking-[0.18em]
                          text-[#A4773E]
                        "
                      >
                        <span className="h-1 w-1 rounded-full bg-[#B7894A]" />

                        Selected piece
                      </div>

                      <p
                        className="
                          mt-1
                          truncate
                          font-serif
                          text-[13px]
                          text-[#29251F]
                        "
                      >
                        {selectedProduct.name}
                      </p>

                      <p className="mt-1 text-[10px] font-semibold text-[#A4773E]">
                        {getProductPrice(
                          selectedProduct,
                        )}
                      </p>

                      <button
                        type="button"
                        onClick={
                          handleViewProduct
                        }
                        className="
                          group
                          mt-2
                          flex
                          items-center
                          gap-1.5
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-widest
                          text-[#6B5138]
                          transition-colors
                          duration-300
                          hover:text-[#A4773E]
                        "
                      >
                        View product

                        <ArrowRight
                          size={11}
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
                      aria-label="Add selected product to wishlist"
                      onClick={() =>
                        handleWishlist(
                          selectedProduct,
                        )
                      }
                      className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#DCCDBA]
                        bg-white/70
                        text-[#806F5D]
                        transition-all
                        duration-300
                        hover:border-[#B7894A]
                        hover:bg-[#B7894A]
                        hover:text-white
                      "
                    >
                      <Heart
                        size={14}
                        strokeWidth={1.5}
                        fill={
                          isWishlisted(
                            selectedProduct._id,
                          )
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                  </div>

                </div>


                {/* Remaining products */}

                <div className="mt-3">

                  {remainingProducts.map(
                    (product) => {
                      const originalIndex =
                        products.findIndex(
                          (item) =>
                            item._id ===
                            product._id,
                        );

                      return (
                        <div
                          key={product._id}
                          className="
                            group
                            flex
                            w-full
                            items-center
                            gap-2.5
                            border-b
                            border-[#E9E0D5]
                            py-2.5
                            text-left
                            last:border-b-0
                          "
                        >

                          <button
                            type="button"
                            onClick={() =>
                              handleSelectProduct(
                                originalIndex,
                              )
                            }
                            className="
                              flex
                              min-w-0
                              flex-1
                              items-center
                              gap-2.5
                              text-left
                            "
                          >

                            <span
                              className="
                                flex
                                h-6
                                w-6
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-[#EEE7DE]
                                text-[7px]
                                font-semibold
                                text-[#877A6B]
                              "
                            >
                              {String(
                                originalIndex +
                                  1,
                              ).padStart(
                                2,
                                "0",
                              )}
                            </span>

                            <div
                              className="
                                h-10
                                w-10
                                shrink-0
                                overflow-hidden
                                rounded-[9px]
                                border
                                border-[#E4DBD0]
                                bg-[#F1ECE5]
                              "
                            >
                              <img
                                src={getProductImage(
                                  product,
                                )}
                                alt={
                                  product.name
                                }
                                loading="lazy"
                                className="
                                  h-full
                                  w-full
                                  object-contain
                                  p-1
                                  transition-transform
                                  duration-500
                                  group-hover:scale-110
                                "
                              />
                            </div>

                            <div className="min-w-0 flex-1">

                              <p
                                className="
                                  truncate
                                  text-[9px]
                                  font-semibold
                                  text-[#292622]
                                  transition-colors
                                  duration-300
                                  group-hover:text-[#9A703A]
                                  sm:text-[10px]
                                "
                              >
                                {product.name}
                              </p>

                              <p className="mt-0.5 text-[8px] text-[#978C80]">
                                {product.subcategory ||
                                  product.category}
                              </p>

                              <p className="mt-0.5 text-[9px] font-semibold text-[#A4773E]">
                                {getProductPrice(
                                  product,
                                )}
                              </p>

                            </div>

                          </button>


                          <button
                            type="button"
                            aria-label={`Add ${product.name} to wishlist`}
                            onClick={() =>
                              handleWishlist(
                                product,
                              )
                            }
                            className="
                              flex
                              h-7
                              w-7
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              text-[#887B6D]
                              transition-all
                              duration-300
                              hover:bg-[#F0E7DB]
                              hover:text-[#A4773E]
                            "
                          >
                            <Heart
                              size={13}
                              strokeWidth={1.5}
                              fill={
                                isWishlisted(
                                  product._id,
                                )
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          </button>

                        </div>
                      );
                    },
                  )}

                </div>


                {/* Collection total */}

                <div
                  className="
                    mt-4
                    border-t
                    border-[#E4DACD]
                    pt-4
                  "
                >

                  <div className="mb-3 flex items-end justify-between">

                    <div>
                      <p
                        className="
                          text-[7px]
                          uppercase
                          tracking-[0.17em]
                          text-[#968B7F]
                        "
                      >
                        Complete collection
                      </p>

                      <p className="mt-1 text-[9px] text-[#6F665C]">
                        {products.length} pieces · One
                        cohesive space
                      </p>
                    </div>

                    <p
                      className="
                        font-serif
                        text-[18px]
                        font-medium
                        text-[#29251F]
                      "
                    >
                      ₹
                      {products
                        .reduce(
                          (
                            total,
                            product,
                          ) =>
                            total +
                            product.price,
                          0,
                        )
                        .toLocaleString(
                          "en-IN",
                        )}
                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={
                      handleAddAllToCart
                    }
                    className="
                      group
                      relative
                      flex
                      h-12
                      w-full
                      items-center
                      justify-center
                      gap-2
                      overflow-hidden
                      rounded-xl
                      bg-[#6B5138]
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.08em]
                      text-white
                      shadow-[0_10px_26px_rgba(91,67,43,0.17)]
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:bg-[#5A422E]
                      hover:shadow-[0_15px_35px_rgba(91,67,43,0.23)]
                      active:translate-y-0
                    "
                  >

                    <ShoppingBag
                      size={14}
                      strokeWidth={1.6}
                    />

                    <span>
                      Add All to Cart
                    </span>

                    <span className="text-white/35">
                      •
                    </span>

                    <span>
                      {products.length} Items
                    </span>

                    <ArrowRight
                      size={13}
                      className="
                        ml-0.5
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    />

                  </button>

                  <p
                    className="
                      mt-2.5
                      text-center
                      text-[7px]
                      tracking-[0.04em]
                      text-[#9A9085]
                    "
                  >
                    Thoughtfully selected for a
                    beautifully balanced home.
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* Mobile link */}

          <div className="mt-4 flex justify-center sm:hidden">

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
              className="
                group
                flex
                items-center
                gap-2
                border-b
                border-[#CDBA9E]
                pb-1.5
                text-[9px]
                font-medium
                text-[#423A31]
              "
            >
              View all looks

              <ArrowRight
                size={12}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </button>

          </div>

        </div>

      </section>


      {/* =================================================
          MOBILE
      ================================================= */}

      <section
        className="
          relative
          w-full
          overflow-hidden
          bg-[#FAF8F4]
          py-9
          lg:hidden
        "
      >

        <div
          className="
            pointer-events-none
            absolute
            -left-28
            top-24
            h-64
            w-64
            rounded-full
            bg-[#E8D7BC]/20
            blur-[90px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -right-28
            bottom-10
            h-64
            w-64
            rounded-full
            bg-[#DCC6A4]/15
            blur-[90px]
          "
        />


        <div className="relative z-10 px-4">

          {/* Header */}

          <div className="mb-5">

            <div className="flex items-center gap-2.5">
              <span className="h-px w-6 bg-[#B7894A]" />

              <span
                className="
                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  text-[#A4773E]
                "
              >
                Curated Interior
              </span>
            </div>

            <div className="mt-2.5 flex items-end justify-between gap-4">

              <div>

                <h2
                  className="
                    font-serif
                    text-[29px]
                    font-medium
                    leading-none
                    tracking-[-0.045em]
                    text-[#211F1C]
                  "
                >
                  Shop the Look
                </h2>

                <p
                  className="
                    mt-2
                    max-w-70
                    text-[9px]
                    leading-[1.55]
                    text-[#83796D]
                  "
                >
                  A thoughtfully composed space,
                  brought together piece by piece.
                </p>

              </div>

              <span className="mb-1 shrink-0 font-serif text-[11px] text-[#B49773]">
                {String(
                  activeProduct + 1,
                ).padStart(2, "0")}{" "}
                /{" "}
                {String(
                  products.length,
                ).padStart(2, "0")}
              </span>

            </div>

          </div>


          {/* Mobile room */}

          <div
            className="
              relative
              overflow-hidden
              rounded-[20px]
              border
              border-[#E3D8CA]
              bg-[#EAE3D9]
              shadow-[0_18px_55px_rgba(64,49,32,0.10)]
            "
          >

            <div
              className="
                relative
                aspect-[1.08/1]
                w-full
                overflow-hidden
              "
            >

              {/* Room */}

              <div
                className={`
                  absolute
                  inset-0
                  transition-all
                  duration-700
                  ${
                    isProductView
                      ? "scale-[0.96] opacity-0"
                      : "scale-100 opacity-100"
                  }
                `}
              >

                <img
                  src={lookImage}
                  alt="Curated living room interior"
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    object-center
                  "
                />

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-linear-to-t
                    from-[#21180F]/30
                    via-transparent
                    to-transparent
                  "
                />


                {/* Collection badge */}

                <div
                  className="
                    absolute
                    left-3
                    top-3
                    flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-white/60
                    bg-white/60
                    px-2.5
                    py-1.5
                    backdrop-blur-xl
                  "
                >

                  <span className="h-1.5 w-1.5 rounded-full bg-[#B7894A]" />

                  <span
                    className="
                      text-[6px]
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      text-[#5E5040]
                    "
                  >
                    Living Collection
                  </span>

                </div>


                {/* Counter */}

                <div
                  className="
                    absolute
                    right-3
                    top-3
                    flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-white/50
                    bg-white/50
                    px-2.5
                    py-1.5
                    backdrop-blur-xl
                  "
                >

                  <span className="text-[8px] font-semibold text-[#4E4438]">
                    {String(
                      activeProduct + 1,
                    ).padStart(2, "0")}
                  </span>

                  <span className="h-px w-3 bg-[#8C7A65]/50" />

                  <span className="text-[8px] text-[#8C7A65]">
                    {String(
                      products.length,
                    ).padStart(2, "0")}
                  </span>

                </div>


                {/* Mobile hotspots */}

                {products.map(
                  (
                    product,
                    index,
                  ) => {

                    const isActive =
                      index ===
                      activeProduct;

                    return (
                      <button
                        key={product._id}
                        type="button"
                        onClick={() =>
                          handleSelectProduct(
                            index,
                          )
                        }
                        aria-label={`View ${product.name}`}
                        className={`
                          absolute
                          ${
                            HOTSPOT_POSITIONS[
                              index %
                                HOTSPOT_POSITIONS.length
                            ]
                          }
                          z-20
                          -translate-x-1/2
                          -translate-y-1/2
                          outline-none
                        `}
                      >

                        <span
                          className={`
                            absolute
                            -inset-2
                            rounded-full
                            border
                            border-white
                            transition-all
                            duration-500
                            ${
                              isActive
                                ? "scale-100 opacity-100"
                                : "scale-75 opacity-0"
                            }
                          `}
                        />

                        {isActive && (
                          <span
                            className="
                              absolute
                              -inset-1
                              animate-ping
                              rounded-full
                              bg-[#B7894A]/20
                            "
                          />
                        )}

                        <span
                          className={`
                            relative
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white
                            shadow-[0_6px_18px_rgba(64,43,20,0.28)]
                            transition-all
                            duration-300
                            ${
                              isActive
                                ? "scale-110 bg-[#B7894A]"
                                : "bg-[#B7894A]/90"
                            }
                          `}
                        >
                          {isActive ? (
                            <Check
                              size={11}
                              strokeWidth={2}
                              className="text-white"
                            />
                          ) : (
                            <span className="text-[7px] font-semibold text-white">
                              {String(
                                index + 1,
                              ).padStart(
                                2,
                                "0",
                              )}
                            </span>
                          )}
                        </span>

                      </button>
                    );
                  },
                )}


                {/* Slider */}

                <div
                  className="
                    absolute
                    bottom-3
                    left-3
                    right-3
                    flex
                    items-center
                    justify-between
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-white/50
                      bg-white/45
                      px-2.5
                      py-1.5
                      backdrop-blur-md
                    "
                  >

                    {products.map(
                      (
                        product,
                        index,
                      ) => (
                        <button
                          key={product._id}
                          type="button"
                          onClick={() =>
                            handleSelectProduct(
                              index,
                            )
                          }
                          aria-label={`Select ${product.name}`}
                          className={`
                            h-1
                            rounded-full
                            transition-all
                            duration-500
                            ${
                              index ===
                              activeProduct
                                ? "w-4 bg-[#A4773E]"
                                : "w-1 bg-[#6D5C49]/45"
                            }
                          `}
                        />
                      ),
                    )}

                  </div>

                  <span
                    className="
                      rounded-full
                      border
                      border-white/40
                      bg-black/10
                      px-2.5
                      py-1.5
                      text-[6px]
                      font-medium
                      uppercase
                      tracking-[0.14em]
                      text-white
                      backdrop-blur-md
                    "
                  >
                    Tap to explore
                  </span>

                </div>

              </div>


              {/* Mobile product view */}

              <div
                className={`
                  absolute
                  inset-0
                  flex
                  flex-col
                  items-center
                  justify-center
                  overflow-hidden
                  bg-[#F3EEE6]
                  px-6
                  transition-all
                  duration-700
                  ${
                    isProductView
                      ? "scale-100 opacity-100"
                      : "pointer-events-none scale-[1.04] opacity-0"
                  }
                `}
              >

                <div
                  className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    h-[55%]
                    w-[65%]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-[#D9C2A3]/20
                    blur-[60px]
                  "
                />


                <button
                  type="button"
                  onClick={() =>
                    setIsProductView(false)
                  }
                  className="
                    absolute
                    left-3
                    top-3
                    z-20
                    flex
                    items-center
                    gap-1.5
                    rounded-full
                    border
                    border-[#D8CCBD]
                    bg-white/75
                    px-3
                    py-1.5
                    text-[6px]
                    font-semibold
                    uppercase
                    tracking-widest
                    text-[#5E5040]
                    backdrop-blur-xl
                  "
                >
                  <ArrowRight
                    size={9}
                    strokeWidth={1.5}
                    className="rotate-180"
                  />

                  Back
                </button>


                <div
                  className="
                    absolute
                    right-3
                    top-3
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#D8CCBD]
                    bg-white/65
                    backdrop-blur-xl
                  "
                >
                  <span className="font-serif text-[9px] text-[#A4773E]">
                    {String(
                      activeProduct + 1,
                    ).padStart(2, "0")}
                  </span>
                </div>


                <div
                  className="
                    relative
                    flex
                    h-[52%]
                    w-[78%]
                    items-center
                    justify-center
                  "
                >

                  <div
                    className="
                      absolute
                      bottom-[5%]
                      h-5
                      w-[55%]
                      rounded-full
                      bg-[#6E5942]/15
                      blur-xl
                    "
                  />

                  <img
                    src={getProductImage(
                      selectedProduct,
                    )}
                    alt={
                      selectedProduct.name
                    }
                    className="
                      relative
                      z-10
                      max-h-full
                      max-w-full
                      object-contain
                      drop-shadow-[0_18px_24px_rgba(62,45,29,0.14)]
                    "
                  />

                </div>


                <div className="relative z-20 mt-1 text-center">

                  <p
                    className="
                      text-[6px]
                      font-semibold
                      uppercase
                      tracking-[0.22em]
                      text-[#A4773E]
                    "
                  >
                    {selectedProduct.subcategory ||
                      selectedProduct.category}
                  </p>

                  <h3
                    className="
                      mt-1
                      font-serif
                      text-[18px]
                      tracking-[-0.03em]
                      text-[#29251F]
                    "
                  >
                    {selectedProduct.name}
                  </h3>

                  <p className="mt-1 text-[10px] font-semibold text-[#A4773E]">
                    {getProductPrice(
                      selectedProduct,
                    )}
                  </p>

                  <button
                    type="button"
                    onClick={
                      handleViewProduct
                    }
                    className="
                      group
                      mx-auto
                      mt-2.5
                      flex
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-[#CDBA9E]
                      bg-white/65
                      px-3.5
                      py-1.5
                      text-[6px]
                      font-semibold
                      uppercase
                      tracking-widest
                      text-[#5E5040]
                      backdrop-blur-md
                    "
                  >
                    View Details

                    <ArrowRight
                      size={9}
                      strokeWidth={1.5}
                    />
                  </button>

                </div>

              </div>

            </div>

          </div>


          {/* Selected piece */}

          <div className="mt-4">

            <div className="mb-2.5 flex items-center justify-between">

              <div>

                <p
                  className="
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-[0.22em]
                    text-[#A4773E]
                  "
                >
                  Selected piece
                </p>

                <h3
                  className="
                    mt-1
                    font-serif
                    text-[18px]
                    tracking-[-0.03em]
                    text-[#29251F]
                  "
                >
                  This piece completes the look
                </h3>

              </div>

              <span className="text-[7px] text-[#968B7F]">
                {String(
                  activeProduct + 1,
                ).padStart(2, "0")}{" "}
                /{" "}
                {String(
                  products.length,
                ).padStart(2, "0")}
              </span>

            </div>


            <div
              className="
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-[#E5D8C8]
                bg-[#F7F1E8]
                p-2.5
              "
            >

              <div
                className="
                  h-17
                  w-17
                  shrink-0
                  overflow-hidden
                  rounded-xl
                  border
                  border-[#E0D3C3]
                  bg-[#EEE8DF]
                "
              >
                <img
                  src={getProductImage(
                    selectedProduct,
                  )}
                  alt={
                    selectedProduct.name
                  }
                  className="
                    h-full
                    w-full
                    object-contain
                    p-1.5
                  "
                />
              </div>


              <div className="min-w-0 flex-1">

                <p
                  className="
                    truncate
                    font-serif
                    text-[14px]
                    text-[#29251F]
                  "
                >
                  {selectedProduct.name}
                </p>

                <p className="mt-1 text-[8px] text-[#8C8073]">
                  {selectedProduct.subcategory ||
                    selectedProduct.category}
                </p>

                <p className="mt-1 text-[10px] font-semibold text-[#A4773E]">
                  {getProductPrice(
                    selectedProduct,
                  )}
                </p>

                <button
                  type="button"
                  onClick={
                    handleViewProduct
                  }
                  className="
                    mt-1.5
                    flex
                    items-center
                    gap-1
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-widest
                    text-[#6B5138]
                  "
                >
                  View product

                  <ArrowRight
                    size={9}
                    strokeWidth={1.5}
                  />
                </button>

              </div>


              <button
                type="button"
                aria-label="Add selected product to wishlist"
                onClick={() =>
                  handleWishlist(
                    selectedProduct,
                  )
                }
                className="
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#DCCDBA]
                  bg-white/70
                  text-[#806F5D]
                "
              >
                <Heart
                  size={13}
                  strokeWidth={1.5}
                  fill={
                    isWishlisted(
                      selectedProduct._id,
                    )
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>

            </div>

          </div>


          {/* More pieces */}

          {remainingProducts.length > 0 && (
            <div className="mt-7">

              <div className="mb-3 flex items-end justify-between">

                <div>

                  <p
                    className="
                      text-[7px]
                      uppercase
                      tracking-[0.18em]
                      text-[#968B7F]
                    "
                  >
                    Complete the room
                  </p>

                  <h3
                    className="
                      mt-1
                      font-serif
                      text-[20px]
                      tracking-[-0.03em]
                      text-[#29251F]
                    "
                  >
                    More pieces in this look
                  </h3>

                </div>

                <span className="text-[8px] text-[#8F8478]">
                  {remainingProducts.length} more
                </span>

              </div>


              <div
                className="
                  -mx-4
                  flex
                  gap-2.5
                  overflow-x-auto
                  px-4
                  pb-2
                  scrollbar-none
                  snap-x
                  snap-mandatory
                "
              >

                {remainingProducts.map(
                  (product) => {

                    const originalIndex =
                      products.findIndex(
                        (item) =>
                          item._id ===
                          product._id,
                      );

                    return (
                      <button
                        key={product._id}
                        type="button"
                        onClick={() =>
                          handleSelectProduct(
                            originalIndex,
                          )
                        }
                        className="
                          group
                          w-37
                          min-w-37
                          shrink-0
                          snap-start
                          overflow-hidden
                          rounded-[15px]
                          border
                          border-[#E5D8C8]
                          bg-[#FDFBF8]
                          text-left
                          shadow-[0_7px_24px_rgba(64,49,32,0.05)]
                        "
                      >

                        <div
                          className="
                            relative
                            h-30
                            overflow-hidden
                            bg-[#F1ECE5]
                          "
                        >

                          <img
                            src={getProductImage(
                              product,
                            )}
                            alt={
                              product.name
                            }
                            loading="lazy"
                            className="
                              h-full
                              w-full
                              object-contain
                              p-3
                              transition-transform
                              duration-500
                              group-active:scale-105
                            "
                          />

                          <span
                            className="
                              absolute
                              left-2.5
                              top-2.5
                              flex
                              h-5
                              w-5
                              items-center
                              justify-center
                              rounded-full
                              bg-white/80
                              text-[6px]
                              font-semibold
                              text-[#806F5D]
                              backdrop-blur-md
                            "
                          >
                            {String(
                              originalIndex +
                                1,
                            ).padStart(
                              2,
                              "0",
                            )}
                          </span>

                          <span
                            className="
                              absolute
                              right-2.5
                              top-2.5
                              flex
                              h-7
                              w-7
                              items-center
                              justify-center
                              rounded-full
                              border
                              border-white/70
                              bg-white/75
                              text-[#806F5D]
                              backdrop-blur-md
                            "
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                          >
                            <Heart
                              size={12}
                              strokeWidth={1.5}
                              fill={
                                isWishlisted(
                                  product._id,
                                )
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          </span>

                        </div>


                        <div className="px-3 py-2.5">

                          <p
                            className="
                              truncate
                              text-[9px]
                              font-semibold
                              text-[#292622]
                            "
                          >
                            {product.name}
                          </p>

                          <p className="mt-1 text-[7px] text-[#978C80]">
                            {product.subcategory ||
                              product.category}
                          </p>

                          <p className="mt-1.5 text-[9px] font-semibold text-[#A4773E]">
                            {getProductPrice(
                              product,
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


          {/* Collection */}

          <div
            className="
              mt-6
              rounded-[18px]
              border
              border-[#E1D5C6]
              bg-[#FDFBF8]
              p-4
            "
          >

            <div className="flex items-end justify-between">

              <div>

                <p
                  className="
                    text-[7px]
                    uppercase
                    tracking-[0.18em]
                    text-[#968B7F]
                  "
                >
                  Complete collection
                </p>

                <p className="mt-1 text-[9px] text-[#6F665C]">
                  {products.length} pieces · One
                  cohesive space
                </p>

              </div>

              <p
                className="
                  font-serif
                  text-[22px]
                  font-medium
                  text-[#29251F]
                "
              >
                ₹
                {products
                  .reduce(
                    (
                      total,
                      product,
                    ) =>
                      total +
                      product.price,
                    0,
                  )
                  .toLocaleString(
                    "en-IN",
                  )}
              </p>

            </div>


            <button
              type="button"
              onClick={
                handleAddAllToCart
              }
              className="
                group
                relative
                mt-4
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                overflow-hidden
                rounded-xl
                bg-[#6B5138]
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.08em]
                text-white
                shadow-[0_10px_26px_rgba(91,67,43,0.17)]
                transition-all
                duration-300
                active:scale-[0.99]
              "
            >

              <ShoppingBag
                size={14}
                strokeWidth={1.6}
              />

              <span>
                Add All to Cart
              </span>

              <span className="text-white/35">
                •
              </span>

              <span>
                {products.length} Items
              </span>

              <ArrowRight
                size={13}
                className="
                  ml-0.5
                  transition-transform
                  duration-300
                "
              />

            </button>

            <p
              className="
                mt-2.5
                text-center
                text-[7px]
                tracking-[0.04em]
                text-[#9A9085]
              "
            >
              Thoughtfully selected for a
              beautifully balanced home.
            </p>

          </div>


          {/* View all */}

          <div className="mt-5 flex justify-center">

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
              className="
                group
                flex
                items-center
                gap-2
                border-b
                border-[#CDBA9E]
                pb-1.5
                text-[9px]
                font-medium
                text-[#423A31]
              "
            >
              View all looks

              <ArrowRight
                size={12}
                className="
                  transition-transform
                  duration-300
                  group-active:translate-x-1
                "
              />

            </button>

          </div>

        </div>

      </section>
    </>
  );
};

export default ShopTheLook;