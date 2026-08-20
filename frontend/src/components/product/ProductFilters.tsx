import type { Product } from "../../types/product";

export interface ProductFilterState {
  category: string;
  materials: string[];
  colors: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
}

interface ProductFiltersProps {
  products: Product[];
  filters: ProductFilterState;
  onCategoryChange: (category: string) => void;
  onMaterialToggle: (material: string) => void;
  onColorToggle: (color: string) => void;
  onPriceChange: (
    minPrice: number,
    maxPrice: number,
  ) => void;
  onRatingChange: (minRating: number) => void;
  onClear: () => void;
}

const colorMap: Record<string, string> = {
  Beige: "#C9B9A3",
  Brown: "#9B754C",
  Black: "#37342F",
  White: "#EEEAE3",
  Grey: "#9CA3AF",
  Gray: "#9CA3AF",
  Red: "#C85A54",
  Blue: "#5B7DB1",
  Green: "#718A68",
  Yellow: "#D4AE4A",
  Gold: "#C9A24D",
  Silver: "#B8B8B8",
  Cream: "#E8DDC8",
  Orange: "#D98745",
  Pink: "#D9A0AE",
  Purple: "#9173B2",
};

const getColorValue = (
  color: string,
): string => {
  return (
    colorMap[
      color.charAt(0).toUpperCase() +
        color.slice(1).toLowerCase()
    ] ?? "#C9B9A3"
  );
};

const getCategoryCount = (
  products: Product[],
  category: string,
) => {
  if (category === "All Categories") {
    return products.length;
  }

  const normalizedCategory =
    category.toLowerCase();

  return products.filter((product) => {
    return (
      product.category?.toLowerCase() ===
        normalizedCategory ||
      product.subcategory?.toLowerCase() ===
        normalizedCategory
    );
  }).length;
};

const ProductFilters = ({
  products,
  filters,
  onCategoryChange,
  onMaterialToggle,
  onColorToggle,
  onPriceChange,
  onRatingChange,
  onClear,
}: ProductFiltersProps) => {
  /*
   * ========================================
   * DYNAMIC FILTER OPTIONS FROM BACKEND DATA
   * ========================================
   */

  const categories = [
    "All Categories",
    ...Array.from(
      new Set(
        products.flatMap((product) =>
          [
            product.category,
            product.subcategory,
          ].filter(
            (value): value is string =>
              Boolean(value),
          ),
        ),
      ),
    ).sort((a, b) =>
      a.localeCompare(b),
    ),
  ];

  const materials = Array.from(
    new Set(
      products.flatMap((product) => {
        const values: string[] = [];

        if (product.material) {
          values.push(product.material);
        }

        product.variants?.forEach(
          (variant) => {
            if (variant.material) {
              values.push(
                variant.material,
              );
            }
          },
        );

        return values;
      }),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const colorNames = Array.from(
    new Set(
      products.flatMap((product) => {
        const values: string[] = [];

        product.colors?.forEach((color) => {
          if (typeof color === "string") {
            values.push(color);
          }
        });

        product.variants?.forEach(
          (variant) => {
            if (variant.color) {
              values.push(
                variant.color,
              );
            }
          },
        );

        return values;
      }),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const colors = colorNames.map((name) => ({
    name,
    value: getColorValue(name),
  }));

  /*
   * ========================================
   * DYNAMIC PRICE RANGE
   * ========================================
   */

  const highestProductPrice =
    products.length > 0
      ? Math.max(
          ...products.flatMap((product) => [
            product.price,
            ...(product.variants ?? [])
              .map((variant) =>
                variant.price ?? 0,
              ),
          ]),
        )
      : 100000;

  const maxPriceLimit = Math.max(
    100000,
    Math.ceil(highestProductPrice / 1000) *
      1000,
  );

  const hasActiveFilters =
    filters.category !== "All Categories" ||
    filters.materials.length > 0 ||
    filters.colors.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < maxPriceLimit ||
    filters.minRating > 0;

  return (
    <aside
      className="
        hidden
        w-59
        shrink-0
        lg:block
        xl:w-63
      "
    >
      <div className="flex items-center justify-between">
        <h2
          className="
            text-[13px]
            font-semibold
            uppercase
            tracking-[0.08em]
            text-[#302B25]
          "
        >
          Filters
        </h2>

        <button
          type="button"
          onClick={onClear}
          disabled={!hasActiveFilters}
          className="
            text-[11px]
            font-medium
            tracking-wider
            text-[#A4773E]
            transition-colors
            duration-200
            hover:text-[#7E5B32]
            hover:underline
            disabled:pointer-events-none
            disabled:opacity-30
          "
        >
          Clear All
        </button>
      </div>

      {/* ========================================
          CATEGORIES
      ======================================== */}

      <div className="mt-8">
        <h3
          className="
            text-[12px]
            font-semibold
            uppercase
            tracking-[0.08em]
            text-[#554D44]
          "
        >
          Categories
        </h3>

        <div className="mt-4 space-y-1">
          {categories.map((category) => {
            const active =
              filters.category === category;

            const count = getCategoryCount(
              products,
              category,
            );

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  onCategoryChange(category)
                }
                className={`
                  group
                  flex
                  min-h-10
                  w-full
                  items-center
                  justify-between
                  rounded-[9px]
                  px-3
                  text-left
                  transition-all
                  duration-200
                  ${
                    active
                      ? "bg-[#F0E6D8] text-[#7F5D35]"
                      : "text-[#6E655C] hover:bg-[#F6F1EA] hover:text-[#302B25]"
                  }
                `}
              >
                <span
                  className={`
                    text-[13px]
                    ${
                      active
                        ? "font-semibold"
                        : "font-normal"
                    }
                  `}
                >
                  {category}
                </span>

                <span
                  className={`
                    text-[10px]
                    tabular-nums
                    ${
                      active
                        ? "font-semibold text-[#A4773E]"
                        : "text-[#A0978D]"
                    }
                  `}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="my-8 h-px bg-[#E5DED4]" />

      {/* ========================================
          PRICE RANGE
      ======================================== */}

      <div>
        <div className="flex items-center justify-between">
          <h3
            className="
              text-[12px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-[#554D44]
            "
          >
            Price Range
          </h3>

          <span className="text-[10px] text-[#9A9186]">
            ₹
            {maxPriceLimit.toLocaleString(
              "en-IN",
            )}
            +
          </span>
        </div>

        <div className="mt-6">
          <div className="relative h-6">
            <div
              className="
                absolute
                left-0
                right-0
                top-1/2
                h-0.75
                -translate-y-1/2
                rounded-full
                bg-[#DCD3C8]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                top-1/2
                h-0.75
                -translate-y-1/2
                rounded-full
                bg-[#A4773E]
              "
              style={{
                left: `${
                  (filters.minPrice /
                    maxPriceLimit) *
                  100
                }%`,
                right: `${
                  100 -
                  (filters.maxPrice /
                    maxPriceLimit) *
                    100
                }%`,
              }}
            />

            <input
              type="range"
              min={0}
              max={maxPriceLimit}
              step={1000}
              value={Math.min(
                filters.minPrice,
                maxPriceLimit,
              )}
              onChange={(event) => {
                const value = Number(
                  event.target.value,
                );

                onPriceChange(
                  Math.min(
                    value,
                    filters.maxPrice - 1000,
                  ),
                  filters.maxPrice,
                );
              }}
              className="
                price-range
                absolute
                inset-0
                z-20
                h-6
                w-full
                cursor-pointer
                appearance-none
                bg-transparent
              "
              aria-label="Minimum price"
            />

            <input
              type="range"
              min={0}
              max={maxPriceLimit}
              step={1000}
              value={Math.min(
                filters.maxPrice,
                maxPriceLimit,
              )}
              onChange={(event) => {
                const value = Number(
                  event.target.value,
                );

                onPriceChange(
                  filters.minPrice,
                  Math.max(
                    value,
                    filters.minPrice + 1000,
                  ),
                );
              }}
              className="
                price-range
                absolute
                inset-0
                z-30
                h-6
                w-full
                cursor-pointer
                appearance-none
                bg-transparent
              "
              aria-label="Maximum price"
            />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span
              className="
                text-[11px]
                font-medium
                tabular-nums
                text-[#766D63]
              "
            >
              ₹
              {filters.minPrice.toLocaleString(
                "en-IN",
              )}
            </span>

            <span
              className="
                text-[11px]
                font-medium
                tabular-nums
                text-[#766D63]
              "
            >
              ₹
              {filters.maxPrice.toLocaleString(
                "en-IN",
              )}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                onPriceChange(
                  Math.max(
                    0,
                    filters.minPrice - 5000,
                  ),
                  filters.maxPrice,
                )
              }
              className="
                rounded-lg
                border
                border-[#DED5C9]
                bg-white/70
                px-2
                py-2
                text-[10px]
                text-[#6E655C]
                transition
                hover:border-[#CBB594]
                hover:text-[#7E5B32]
              "
            >
              − ₹5K
            </button>

            <button
              type="button"
              onClick={() =>
                onPriceChange(
                  filters.minPrice,
                  Math.min(
                    maxPriceLimit,
                    filters.maxPrice + 5000,
                  ),
                )
              }
              className="
                rounded-lg
                border
                border-[#DED5C9]
                bg-white/70
                px-2
                py-2
                text-[10px]
                text-[#6E655C]
                transition
                hover:border-[#CBB594]
                hover:text-[#7E5B32]
              "
            >
              + ₹5K
            </button>
          </div>
        </div>
      </div>

      <div className="my-8 h-px bg-[#E5DED4]" />

      {/* ========================================
          MATERIAL
      ======================================== */}

      <div>
        <h3
          className="
            text-[12px]
            font-semibold
            uppercase
            tracking-[0.08em]
            text-[#554D44]
          "
        >
          Material
        </h3>

        <div className="mt-4 space-y-3">
          {materials.map((material) => {
            const checked =
              filters.materials.includes(
                material,
              );

            return (
              <label
                key={material}
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-3
                  text-[13px]
                  text-[#6E655C]
                "
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    onMaterialToggle(
                      material,
                    )
                  }
                  className="
                    h-4
                    w-4
                    cursor-pointer
                    rounded
                    accent-[#A4773E]
                  "
                />

                <span
                  className={
                    checked
                      ? "font-medium text-[#403A33]"
                      : ""
                  }
                >
                  {material}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="my-8 h-px bg-[#E5DED4]" />

      {/* ========================================
          COLOR
      ======================================== */}

      <div>
        <h3
          className="
            text-[12px]
            font-semibold
            uppercase
            tracking-[0.08em]
            text-[#554D44]
          "
        >
          Color
        </h3>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {colors.map((color) => {
            const active =
              filters.colors.includes(
                color.name,
              );

            return (
              <button
                key={color.name}
                type="button"
                aria-label={color.name}
                title={color.name}
                onClick={() =>
                  onColorToggle(color.name)
                }
                className={`
                  relative
                  h-8
                  w-8
                  rounded-full
                  border
                  transition-all
                  duration-200
                  hover:scale-105
                  ${
                    active
                      ? "border-[#8F6838] ring-2 ring-[#C9AC83] ring-offset-2 ring-offset-[#FAF8F5]"
                      : "border-[#D6CEC4]"
                  }
                `}
                style={{
                  backgroundColor:
                    color.value,
                }}
              >
                {active && (
                  <span className="absolute inset-0 flex items-center justify-center text-[11px] text-white">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          {colors.map((color) => (
            <span
              key={color.name}
              className="
                w-8
                text-center
                text-[9px]
                text-[#93897E]
              "
            >
              {color.name.slice(0, 1)}
            </span>
          ))}
        </div>
      </div>

      <div className="my-8 h-px bg-[#E5DED4]" />

      {/* ========================================
          RATING
      ======================================== */}

      <div>
        <h3
          className="
            text-[12px]
            font-semibold
            uppercase
            tracking-[0.08em]
            text-[#554D44]
          "
        >
          Rating
        </h3>

        <div className="mt-4 space-y-3">
          {[4, 3].map((rating) => {
            const active =
              filters.minRating === rating;

            return (
              <button
                key={rating}
                type="button"
                onClick={() =>
                  onRatingChange(
                    active ? 0 : rating,
                  )
                }
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  text-left
                "
              >
                <span
                  className={`
                    flex
                    h-5
                    w-5
                    items-center
                    justify-center
                    rounded
                    border
                    text-[10px]
                    ${
                      active
                        ? "border-[#A4773E] bg-[#A4773E] text-white"
                        : "border-[#D5CCC0] bg-white text-transparent"
                    }
                  `}
                >
                  ✓
                </span>

                <span className="flex items-center gap-1">
                  <span className="text-[12px] tracking-wider text-[#C88924]">
                    {"★".repeat(rating)}
                  </span>

                  <span className="text-[12px] text-[#CFC6BC]">
                    {"★".repeat(5 - rating)}
                  </span>
                </span>

                <span className="text-[12px] text-[#6E655C]">
                  & above
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default ProductFilters;