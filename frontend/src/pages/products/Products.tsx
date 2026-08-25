import {
  useEffect,
  useState,
} from "react";

import Breadcrumbs from "../../components/product/Breadcrumbs";
import ProductToolbar from "../../components/product/ProductToolbar";
import ProductFilters, {
  type ProductFilterState,
} from "../../components/product/ProductFilters";
import ProductGrid from "../../components/product/ProductGrid";
import MobileFilterSheet from "../../components/product/MobileFilterSheet";

import type { Product } from "../../types/product";
import { useCart } from "../../context/CartContext";

import {
  getProducts,
  type ProductSort,
} from "../../api/product.api";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import livingRoomLook from "../../assets/images/looks/Hero_product_page.png";

const PRODUCTS_PER_PAGE = 12;

/*
 * ========================================
 * URL CATEGORY PARAMETER MAP
 * ========================================
 */

const CATEGORY_PARAM_MAP: Record<
  string,
  string
> = {
  sofa: "sofas",
  sofas: "sofas",

  chair: "chairs",
  chairs: "chairs",

  table: "tables",
  tables: "tables",

  bed: "beds",
  beds: "beds",

  storage: "storage",

  lamp: "lighting",
  lamps: "lighting",
  light: "lighting",
  lights: "lighting",
  lighting: "lighting",

  mirror: "mirrors",
  mirrors: "mirrors",

  decor: "decor",
  decors: "decor",

  "decorative-object": "decor",
  "decorative-objects": "decor",
  decorativeobject: "decor",
  decorativeobjects: "decor",

  rug: "rugs",
  rugs: "rugs",
};

/*
 * ========================================
 * ROOM PARAMETER MAP
 * ========================================
 */

const ROOM_PARAM_MAP: Record<
  string,
  string
> = {
  "living-room": "Living room",
  "living room": "Living room",

  bedroom: "bedroom",

  kitchen: "kitchen",

  "dining-room": "Dining room",
  "dining room": "Dining room",

  "home-office": "Home office",
  "home office": "Home office",

  "study-library": "Study library",
  "study library": "Study library",

  balcony: "balcony",

  "entertainment-room":
    "Entertainment room",

  "entertainment room":
    "Entertainment room",
};

/*
 * ========================================
 * INITIAL FILTERS
 * ========================================
 */

const initialFilters: ProductFilterState = {
  category: "All Categories",
  materials: [],
  colors: [],
  minPrice: 0,
  maxPrice: 100000,
  minRating: 0,
};

/*
 * ========================================
 * PAGINATION
 * ========================================
 */

const getPaginationItems = (
  currentPage: number,
  totalPages: number,
): (number | "...")[] => {
  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
  }

  if (currentPage <= 4) {
    return [
      1,
      2,
      3,
      4,
      5,
      "...",
      totalPages,
    ];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

/*
 * ========================================
 * NORMALIZE PARAMETER
 * ========================================
 */

const normalizeCategoryParam = (
  value: string,
): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");
};

/*
 * ========================================
 * GET CATEGORY FROM URL
 * ========================================
 */

const getCategoryFromParam = (
  categoryParam: string | null,
): string | undefined => {
  if (!categoryParam) {
    return undefined;
  }

  const normalized =
    normalizeCategoryParam(categoryParam);

  return (
    CATEGORY_PARAM_MAP[normalized] ??
    normalized
  );
};

/*
 * ========================================
 * FORMAT CATEGORY FOR UI
 * ========================================
 */

const formatCategoryName = (
  value: string,
): string => {
  return value
    .replace(/-/g, " ")
    .split(" ")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
};

/*
 * ========================================
 * SAFE COLOR NAME
 * ========================================
 */

const getColorName = (
  color:
    | string
    | {
        name?: string;
      }
    | undefined
    | null,
): string | undefined => {
  if (typeof color === "string") {
    return color;
  }

  if (
    color &&
    typeof color === "object" &&
    typeof color.name === "string"
  ) {
    return color.name;
  }

  return undefined;
};

/*
 * ========================================
 * COMPONENT
 * ========================================
 */

const Products = () => {
  const { addToCart } = useCart();

  const [filters, setFilters] =
    useState<ProductFilterState>(
      initialFilters,
    );

  const [roomFilter, setRoomFilter] =
    useState<string | undefined>();

  const [sortBy, setSortBy] =
    useState("Featured");

  const [viewMode, setViewMode] =
    useState<"grid" | "list">("grid");

  const [
    mobileFiltersOpen,
    setMobileFiltersOpen,
  ] = useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [totalProducts, setTotalProducts] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  const [hasNextPage, setHasNextPage] =
    useState(false);

  const [
    hasPreviousPage,
    setHasPreviousPage,
  ] = useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * ========================================
   * READ URL FILTERS
   * ========================================
   */

  useEffect(() => {
    const applyUrlFilters = () => {
      const params = new URLSearchParams(
        window.location.search,
      );

      const categoryParam =
        params.get("category");

      const roomParam =
        params.get("room");

      const category =
        getCategoryFromParam(
          categoryParam,
        );

      const normalizedRoom =
        roomParam
          ? normalizeCategoryParam(roomParam)
          : undefined;

      const room =
        normalizedRoom
          ? ROOM_PARAM_MAP[
              normalizedRoom
            ] ?? normalizedRoom
          : undefined;

      setFilters((current) => ({
        ...current,
        category:
          category ?? "All Categories",
      }));

      setRoomFilter(room);
      setCurrentPage(1);
    };

    applyUrlFilters();

    window.addEventListener(
      "popstate",
      applyUrlFilters,
    );

    return () => {
      window.removeEventListener(
        "popstate",
        applyUrlFilters,
      );
    };
  }, []);

  /*
   * ========================================
   * RESET PAGE
   * ========================================
   */

  useEffect(() => {
    setCurrentPage(1);
  }, [
    filters,
    sortBy,
    roomFilter,
  ]);

  /*
   * ========================================
   * BACKEND SORT
   * ========================================
   */

  const getBackendSort =
    (): ProductSort => {
      switch (sortBy) {
        case "Price: Low to High":
          return "price_asc";

        case "Price: High to Low":
          return "price_desc";

        case "Name":
          return "popular";

        case "Featured":
        default:
          return "newest";
      }
    };

  /*
   * ========================================
   * FETCH PRODUCTS
   * ========================================
   */

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        /*
         * Backend currently accepts
         * a single material/color.
         * Multiple selections are
         * filtered locally below.
         */

        const material =
          filters.materials.length === 1
            ? filters.materials[0]
            : undefined;

        const color =
          filters.colors.length === 1
            ? filters.colors[0]
            : undefined;

        const result =
          await getProducts({
            page: currentPage,
            limit: PRODUCTS_PER_PAGE,

            room: roomFilter,

            category:
              filters.category !==
              "All Categories"
                ? filters.category
                : undefined,

            material,
            color,

            minPrice:
              filters.minPrice > 0
                ? filters.minPrice
                : undefined,

            maxPrice:
              filters.maxPrice < 100000
                ? filters.maxPrice
                : undefined,

            sort: getBackendSort(),
          });

        if (cancelled) {
          return;
        }

        setProducts(result.products);

        setTotalProducts(
          result.pagination.totalProducts,
        );

        setTotalPages(
          Math.max(
            1,
            result.pagination.totalPages,
          ),
        );

        setHasNextPage(
          result.pagination.hasNextPage,
        );

        setHasPreviousPage(
          result.pagination.hasPreviousPage,
        );
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to fetch products:",
          err,
        );

        setProducts([]);
        setTotalProducts(0);
        setTotalPages(1);
        setHasNextPage(false);
        setHasPreviousPage(false);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load products",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [
    currentPage,
    filters,
    sortBy,
    roomFilter,
  ]);

  /*
   * ========================================
   * FILTER PRODUCTS LOCALLY
   * ========================================
   */

  const filterProducts = (
    productList: Product[],
  ): Product[] => {
    return productList.filter(
      (product) => {
        /*
         * CATEGORY
         */

        const matchesCategory =
          filters.category ===
            "All Categories" ||
          product.category ===
            filters.category ||
          product.subcategory ===
            filters.category;

        /*
         * MATERIAL
         */

        const productMaterials = [
          product.material,

          ...(product.variants ?? []).map(
            (variant) =>
              variant.material,
          ),
        ]
          .filter(
            (
              material,
            ): material is string =>
              typeof material === "string" &&
              material.trim().length > 0,
          )
          .map((material) =>
            material.trim().toLowerCase(),
          );

        const matchesMaterial =
          filters.materials.length === 0 ||
          filters.materials.some(
            (selectedMaterial) =>
              productMaterials.includes(
                selectedMaterial
                  .trim()
                  .toLowerCase(),
              ),
          );

        /*
         * COLOR
         */

        const productColors = [
          ...(product.colors ?? []).map(
            (color) =>
              getColorName(color),
          ),

          ...(product.variants ?? []).map(
            (variant) =>
              getColorName(variant.color),
          ),
        ]
          .filter(
            (
              color,
            ): color is string =>
              typeof color === "string" &&
              color.trim().length > 0,
          )
          .map((color) =>
            color.trim().toLowerCase(),
          );

        const matchesColor =
          filters.colors.length === 0 ||
          filters.colors.some(
            (selectedColor) =>
              productColors.includes(
                selectedColor
                  .trim()
                  .toLowerCase(),
              ),
          );

        /*
         * PRICE
         */

        const productPrice =
          typeof product.price === "number"
            ? product.price
            : Number(product.price);

        const matchesPrice =
          Number.isNaN(productPrice) ||
          (productPrice >=
            filters.minPrice &&
            productPrice <=
              filters.maxPrice);

        /*
         * RATING
         */

        const STATIC_PRODUCT_RATING = 4.8;

        const matchesRating =
          filters.minRating === 0 ||
          STATIC_PRODUCT_RATING >=
            filters.minRating;

        return (
          matchesCategory &&
          matchesMaterial &&
          matchesColor &&
          matchesPrice &&
          matchesRating
        );
      },
    );
  };

  /*
   * ========================================
   * FILTER OPTIONS
   * ========================================
   */

  const categories = Array.from(
    new Set(
      [
        ...Object.values(
          CATEGORY_PARAM_MAP,
        ),

        ...products
          .flatMap((product) => [
            product.category,
            product.subcategory,
          ])
          .filter(
            (
              category,
            ): category is string =>
              typeof category === "string" &&
              category.trim().length > 0,
          ),
      ],
    ),
  );

  const materials = Array.from(
    new Set(
      products
        .flatMap((product) => [
          product.material,

          ...(product.variants ?? []).map(
            (variant) =>
              variant.material,
          ),
        ])
        .filter(
          (
            material,
          ): material is string =>
            typeof material === "string" &&
            material.trim().length > 0,
        ),
    ),
  );

  const colors = Array.from(
    new Set(
      products
        .flatMap((product) => [
          ...(product.colors ?? []).map(
            (color) =>
              getColorName(color),
          ),

          ...(product.variants ?? []).map(
            (variant) =>
              getColorName(variant.color),
          ),
        ])
        .filter(
          (
            color,
          ): color is string =>
            typeof color === "string" &&
            color.trim().length > 0,
        ),
    ),
  );

  /*
   * ========================================
   * TOOLBAR VALUES
   * ========================================
   */

  const toolbarMaterial =
    filters.materials.length === 1
      ? filters.materials[0]
      : "All Materials";

  const toolbarColor =
    filters.colors.length === 1
      ? filters.colors[0]
      : "All Colors";

  const toolbarPrice =
    filters.minPrice === 0 &&
    filters.maxPrice === 100000
      ? "All Prices"
      : filters.maxPrice <= 10000
        ? "Under ₹10,000"
        : filters.minPrice >= 30000
          ? "Above ₹30,000"
          : filters.minPrice >= 10000 &&
              filters.maxPrice <= 20000
            ? "₹10,000 – ₹20,000"
            : "₹20,000 – ₹30,000";

  /*
   * ========================================
   * FILTER HANDLERS
   * ========================================
   */

  const handleCategoryChange = (
    category: string,
  ) => {
    setFilters((current) => ({
      ...current,
      category:
        category === "All Categories"
          ? category
          : normalizeCategoryParam(
              category,
            ),
    }));

    setCurrentPage(1);
  };

  const handleMaterialToggle = (
    material: string,
  ) => {
    setFilters((current) => ({
      ...current,

      materials:
        current.materials.includes(material)
          ? current.materials.filter(
              (item) =>
                item !== material,
            )
          : [
              ...current.materials,
              material,
            ],
    }));

    setCurrentPage(1);
  };

  const handleColorToggle = (
    color: string,
  ) => {
    setFilters((current) => ({
      ...current,

      colors: current.colors.includes(color)
        ? current.colors.filter(
            (item) => item !== color,
          )
        : [
            ...current.colors,
            color,
          ],
    }));

    setCurrentPage(1);
  };

  const handlePriceChange = (
    minPrice: number,
    maxPrice: number,
  ) => {
    setFilters((current) => ({
      ...current,
      minPrice,
      maxPrice,
    }));

    setCurrentPage(1);
  };

  const handleRatingChange = (
    minRating: number,
  ) => {
    setFilters((current) => ({
      ...current,
      minRating,
    }));

    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setRoomFilter(undefined);
    setCurrentPage(1);
  };

  const handleAddToCart = (
    product: Product,
  ) => {
    addToCart(product);
  };

  const handleToolbarPriceChange = (
    value: string,
  ) => {
    switch (value) {
      case "Under ₹10,000":
        handlePriceChange(
          0,
          10000,
        );
        break;

      case "₹10,000 – ₹20,000":
        handlePriceChange(
          10000,
          20000,
        );
        break;

      case "₹20,000 – ₹30,000":
        handlePriceChange(
          20000,
          30000,
        );
        break;

      case "Above ₹30,000":
        handlePriceChange(
          30000,
          100000,
        );
        break;

      default:
        handlePriceChange(
          0,
          100000,
        );
    }
  };

  /*
   * ========================================
   * PAGINATION VALUES
   * ========================================
   */

  const firstResult =
    totalProducts === 0
      ? 0
      : (currentPage - 1) *
          PRODUCTS_PER_PAGE +
        1;

  const lastResult =
    Math.min(
      currentPage * PRODUCTS_PER_PAGE,
      totalProducts,
    );

  const paginationItems =
    getPaginationItems(
      currentPage,
      totalPages,
    );

  const roomDisplayName =
    roomFilter ?? null;

  return (
    <main
      className="
        min-h-screen
        bg-[#FAF8F5]
        text-[#302B25]
      "
    >
      <section className="relative overflow-hidden bg-[#FAF8F5]">
        <div
          className="
            mx-auto
            max-w-[1540px]
            px-4
            pb-7
            pt-5
            sm:px-7
            sm:pb-9
            sm:pt-7
            lg:px-10
            lg:pb-10
            lg:pt-8
            xl:px-14
          "
        >
          <div className="relative z-20">
            <Breadcrumbs />
          </div>

          <div
            className="
              relative
              mt-5
              overflow-hidden
              rounded-[20px]
              border
              border-[#E2D8CC]
              bg-[#F4EEE5]
              shadow-[0_20px_65px_rgba(71,54,36,0.06)]
              sm:mt-6
              sm:rounded-3xl
              lg:mt-7
              lg:min-h-66
              xl:min-h-72
            "
          >
            <div
              className="
                absolute
                inset-y-0
                right-0
                hidden
                w-[59%]
                overflow-hidden
                lg:block
              "
            >
              <img
                src={livingRoomLook}
                alt="Taksham interior collection"
                className="
                  h-full
                  w-full
                  object-cover
                  object-center
                  transition-transform
                  duration-1400
                  ease-out
                  hover:scale-[1.025]
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-linear-to-r
                  from-[#F4EEE5]
                  via-[#F4EEE5]/35
                  to-transparent
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-linear-to-t
                  from-black/10
                  via-transparent
                  to-white/5
                "
              />
            </div>

            <div
              className="
                relative
                h-48
                overflow-hidden
                lg:hidden
              "
            >
              <img
                src={livingRoomLook}
                alt="Taksham interior collection"
                className="
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
                  from-[#F4EEE5]
                  via-transparent
                  to-black/5
                "
              />
            </div>

            <div
              className="
                relative
                z-10
                flex
                min-h-67
                items-center
                px-6
                py-8
                sm:px-9
                sm:py-9
                lg:min-h-67
                lg:w-[57%]
                lg:px-10
                xl:min-h-72
                xl:px-14
              "
            >
              <div className="max-w-143">
                <div
                  className="
                    mb-3
                    flex
                    items-center
                    gap-2.5
                  "
                >
                  <span className="h-px w-8 bg-[#B7894A]" />

                  <span
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-[#A4773E]
                      sm:text-[11px]
                    "
                  >
                    The Taksham Collection
                  </span>
                </div>

                <h1
                  className="
                    max-w-135
                    font-serif
                    text-[43px]
                    font-medium
                    leading-[0.92]
                    tracking-[-0.035em]
                    text-[#25221E]
                    sm:text-[52px]
                    lg:text-[58px]
                    xl:text-[64px]
                  "
                >
                  {roomDisplayName ? (
                    <>
                      {roomDisplayName}
                      <span className="text-[#9A7138]">
                        .
                      </span>
                    </>
                  ) : filters.category ===
                    "All Categories" ? (
                    <>
                      All{" "}
                      <span className="text-[#9A7138]">
                        Products
                      </span>
                    </>
                  ) : (
                    <>
                      {formatCategoryName(
                        filters.category,
                      )}
                      <span className="text-[#9A7138]">
                        .
                      </span>
                    </>
                  )}
                </h1>

                <p
                  className="
                    mt-4
                    max-w-114
                    text-[12px]
                    leading-[1.7]
                    text-[#746B61]
                    sm:text-[13px]
                  "
                >
                  {roomDisplayName
                    ? `Explore thoughtfully selected furniture and decor for your ${roomDisplayName.toLowerCase()}, designed to bring warmth, comfort and timeless character into your home.`
                    : "Discover premium furniture and thoughtful home accents, carefully selected to bring warmth, character and timeless beauty into everyday living."}
                </p>

                <div
                  className="
                    mt-5
                    flex
                    flex-wrap
                    items-center
                    gap-x-5
                    gap-y-2
                  "
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#CDBB9F]
                        bg-white/60
                      "
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#B7894A]" />
                    </span>

                    <span
                      className="
                        text-[10px]
                        font-medium
                        text-[#796D60]
                      "
                    >
                      Thoughtfully selected
                    </span>
                  </div>

                  <span className="hidden h-4 w-px bg-[#D7CABB] sm:block" />

                  <span
                    className="
                      text-[10px]
                      font-medium
                      text-[#968B80]
                    "
                  >
                    Designed for modern living
                  </span>
                </div>
              </div>
            </div>

            <div
              className="
                absolute
                bottom-5
                right-5
                z-20
                hidden
                items-center
                gap-2
                rounded-full
                border
                border-white/50
                bg-white/65
                px-3.5
                py-2
                shadow-[0_8px_25px_rgba(50,40,30,0.10)]
                backdrop-blur-md
                lg:flex
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#B7894A]" />

              <span
                className="
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-widest
                  text-[#5F554A]
                "
              >
                Curated for beautiful living
              </span>
            </div>

            <div
              className="
                absolute
                bottom-5
                left-6
                z-20
                hidden
                font-serif
                text-[15px]
                text-[#A4773E]/60
                lg:block
                xl:left-8
              "
            >
              01
            </div>
          </div>
        </div>
      </section>

      <section>
        <div
          className="
            mx-auto
            max-w-[1540px]
            px-4
            sm:px-7
            lg:px-10
            xl:px-14
          "
        >
          <ProductToolbar
            productCount={totalProducts}
            sortBy={sortBy}
            onSortChange={(value) => {
              setSortBy(value);
              setCurrentPage(1);
            }}
            onFilterClick={() =>
              setMobileFiltersOpen(true)
            }
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            categories={categories}
            materials={materials}
            colors={colors}
            category={filters.category}
            onCategoryChange={
              handleCategoryChange
            }
            material={toolbarMaterial}
            onMaterialChange={(value) => {
              setFilters((current) => ({
                ...current,
                materials:
                  value === "All Materials"
                    ? []
                    : [value],
              }));

              setCurrentPage(1);
            }}
            color={toolbarColor}
            onColorChange={(value) => {
              setFilters((current) => ({
                ...current,
                colors:
                  value === "All Colors"
                    ? []
                    : [value],
              }));

              setCurrentPage(1);
            }}
            price={toolbarPrice}
            onPriceChange={
              handleToolbarPriceChange
            }
          />
        </div>
      </section>

      <section
        className="
          pb-20
          pt-9
          sm:pb-24
          sm:pt-11
          lg:pb-28
          lg:pt-12
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-[1540px]
            gap-9
            px-4
            sm:px-7
            lg:gap-11
            lg:px-10
            xl:gap-14
            xl:px-14
          "
        >
          <ProductFilters
            products={products}
            filters={filters}
            filterProducts={filterProducts(products)}
            onCategoryChange={
              handleCategoryChange
            }
            onMaterialToggle={
              handleMaterialToggle
            }
            onColorToggle={
              handleColorToggle
            }
            onPriceChange={
              handlePriceChange
            }
            onRatingChange={
              handleRatingChange
            }
            onClear={clearFilters}
          />

          <div className="min-w-0 flex-1">
            <div
              className="
                mb-7
                flex
                items-end
                justify-between
                border-b
                border-[#E5DDD2]
                pb-5
                sm:mb-8
                sm:pb-6
              "
            >
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="h-px w-8 bg-[#B7894A]" />

                  <span
                    className="
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-[#A4773E]
                      sm:text-[12px]
                    "
                  >
                    The Collection
                  </span>
                </div>

                <h2
                  className="
                    mt-2.5
                    font-serif
                    text-[34px]
                    font-medium
                    leading-none
                    tracking-[-0.035em]
                    text-[#25221E]
                    sm:text-[38px]
                    lg:text-[40px]
                  "
                >
                  {roomDisplayName ||
                  filters.category ===
                    "All Categories"
                    ? roomDisplayName ||
                      "All Products"
                    : formatCategoryName(
                        filters.category,
                      )}
                </h2>

                <p
                  className="
                    mt-2.5
                    text-[12px]
                    leading-5
                    text-[#81776B]
                    sm:text-[13px]
                  "
                >
                  Showing{" "}
                  <span className="font-semibold text-[#4B433A]">
                    {firstResult}–{lastResult}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#4B433A]">
                    {totalProducts}
                  </span>{" "}
                  pieces
                </p>
              </div>

              {(filters.category !==
                "All Categories" ||
                roomFilter) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="
                    hidden
                    items-center
                    gap-2
                    text-[11px]
                    font-medium
                    text-[#80633F]
                    transition-colors
                    hover:text-[#A4773E]
                    sm:flex
                  "
                >
                  Clear filters

                  <ArrowRight
                    size={13}
                    strokeWidth={1.5}
                  />
                </button>
              )}
            </div>

            {loading && (
              <div
                className="
                  flex
                  min-h-90
                  flex-col
                  items-center
                  justify-center
                  rounded-[20px]
                  border
                  border-[#E5DDD2]
                  bg-white/60
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
                    border-t-[#A4773E]
                  "
                />

                <p
                  className="
                    mt-4
                    text-[12px]
                    text-[#81776C]
                  "
                >
                  Loading collection...
                </p>
              </div>
            )}

            {!loading && error && (
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
                  !
                </span>

                <h3
                  className="
                    mt-2
                    font-serif
                    text-[28px]
                    text-[#332D26]
                  "
                >
                  Unable to load products
                </h3>

                <p
                  className="
                    mt-2
                    max-w-90
                    text-[13px]
                    leading-5
                    text-[#83786B]
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
                    mt-5
                    rounded-[9px]
                    bg-[#8F6B3F]
                    px-5
                    py-3
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-white
                    shadow-[0_8px_22px_rgba(143,107,63,0.18)]
                    transition-all
                    duration-300
                    hover:bg-[#795832]
                  "
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading &&
              !error &&
              products.length > 0 && (
                <ProductGrid
                  products={filterProducts(products)}
                  viewMode={viewMode}
                  onAddToCart={
                    handleAddToCart
                  }
                />
              )}

            {!loading &&
              !error &&
              products.length === 0 && (
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

                  <h3
                    className="
                      mt-2
                      font-serif
                      text-[28px]
                      text-[#332D26]
                    "
                  >
                    Nothing found
                  </h3>

                  <p
                    className="
                      mt-2
                      max-w-[320px]
                      text-[13px]
                      leading-5
                      text-[#83786B]
                    "
                  >
                    Try adjusting your filters
                    to discover more pieces from
                    the Taksham collection.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      mt-5
                      rounded-[9px]
                      bg-[#8F6B3F]
                      px-5
                      py-3
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.08em]
                      text-white
                      shadow-[0_8px_22px_rgba(143,107,63,0.18)]
                      transition-all
                      duration-300
                      hover:bg-[#795832]
                    "
                  >
                    Clear filters
                  </button>
                </div>
              )}

            {!loading &&
              !error &&
              products.length > 0 &&
              filterProducts(products).length ===
                0 && (
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

                  <h3
                    className="
                      mt-2
                      font-serif
                      text-[28px]
                      text-[#332D26]
                    "
                  >
                    Nothing found
                  </h3>

                  <p
                    className="
                      mt-2
                      max-w-[320px]
                      text-[13px]
                      leading-5
                      text-[#83786B]
                    "
                  >
                    Try adjusting your filters
                    to discover more pieces from
                    the Taksham collection.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      mt-5
                      rounded-[9px]
                      bg-[#8F6B3F]
                      px-5
                      py-3
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.08em]
                      text-white
                      shadow-[0_8px_22px_rgba(143,107,63,0.18)]
                      transition-all
                      duration-300
                      hover:bg-[#795832]
                    "
                  >
                    Clear filters
                  </button>
                </div>
              )}

            {!loading &&
              !error &&
              totalPages > 1 && (
                <div
                  className="
                    mt-12
                    flex
                    justify-center
                    border-t
                    border-[#E7DED3]
                    pt-8
                    sm:mt-14
                    sm:pt-9
                  "
                >
                  <nav
                    aria-label="Product pagination"
                    className="
                      flex
                      items-center
                      justify-center
                      gap-1
                      sm:gap-1.5
                    "
                  >
                    <button
                      type="button"
                      disabled={
                        !hasPreviousPage
                      }
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            Math.max(
                              1,
                              page - 1,
                            ),
                        )
                      }
                      aria-label="Previous page"
                      className="
                        mr-1
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        text-[#766D63]
                        transition-all
                        hover:bg-[#F0E8DD]
                        hover:text-[#765A38]
                        disabled:pointer-events-none
                        disabled:opacity-20
                      "
                    >
                      <ChevronLeft
                        size={16}
                        strokeWidth={1.5}
                      />
                    </button>

                    {paginationItems.map(
                      (item, index) => {
                        if (item === "...") {
                          return (
                            <span
                              key={`dots-${index}`}
                              className="
                                flex
                                h-10
                                w-8
                                items-center
                                justify-center
                                text-[15px]
                                text-[#958B80]
                              "
                            >
                              …
                            </span>
                          );
                        }

                        const isActive =
                          item === currentPage;

                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() =>
                              setCurrentPage(item)
                            }
                            aria-current={
                              isActive
                                ? "page"
                                : undefined
                            }
                            className={`
                              flex
                              h-10
                              min-w-10
                              items-center
                              justify-center
                              rounded-lg
                              px-2
                              text-[12px]
                              font-medium
                              transition-all
                              duration-200
                              ${
                                isActive
                                  ? "bg-[#D7AD6B] text-[#2D251D] shadow-[0_5px_14px_rgba(183,137,74,0.16)]"
                                  : "text-[#4F4840] hover:bg-[#F1E9DE] hover:text-[#8A6537]"
                              }
                            `}
                          >
                            {item}
                          </button>
                        );
                      },
                    )}

                    <button
                      type="button"
                      disabled={!hasNextPage}
                      onClick={() =>
                        setCurrentPage(
                          (page) =>
                            Math.min(
                              totalPages,
                              page + 1,
                            ),
                        )
                      }
                      className="
                        ml-1
                        flex
                        h-10
                        items-center
                        gap-2
                        rounded-lg
                        px-3
                        text-[11px]
                        font-medium
                        text-[#4F4840]
                        transition-all
                        hover:bg-[#F1E9DE]
                        hover:text-[#765A38]
                        disabled:pointer-events-none
                        disabled:opacity-20
                      "
                    >
                      Next

                      <ChevronRight
                        size={14}
                        strokeWidth={1.5}
                      />
                    </button>
                  </nav>
                </div>
              )}
          </div>
        </div>
      </section>

      <MobileFilterSheet
        open={mobileFiltersOpen}
        products={products}
        filters={filters}
        onApply={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
        onClose={() =>
          setMobileFiltersOpen(false)
        }
      />
    </main>
  );
};

export default Products;