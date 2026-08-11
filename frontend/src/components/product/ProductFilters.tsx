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

const categories = [
  "All Categories",
  "Sofas",
  "Chairs",
  "Tables",
  "Beds",
  "Storage",
  "Lighting",
  "Decor",
  "Rugs",
];

const materials = [
  "Wood",
  "Fabric",
  "Metal",
  "Glass",
];

const colors = [
  {
    name: "Beige",
    value: "#C9B9A3",
  },
  {
    name: "Brown",
    value: "#9B754C",
  },
  {
    name: "Black",
    value: "#37342F",
  },
  {
    name: "White",
    value: "#EEEAE3",
  },
];

const getCategoryCount = (
  products: Product[],
  category: string,
) => {
  if (category === "All Categories") {
    return products.length;
  }

  return products.filter(
    (product) =>
      product.subcategory === category ||
      product.category === category,
  ).length;
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
  const hasActiveFilters =
    filters.category !== "All Categories" ||
    filters.materials.length > 0 ||
    filters.colors.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < 100000 ||
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
            ₹1L+
          </span>
        </div>

        <div className="mt-6">
          <div className="relative h-0.75rounded-full bg-[#DCD3C8]">
            <div
              className="
                absolute
                inset-y-0
                left-0
                rounded-full
                bg-[#A4773E]
              "
              style={{
                width: `${Math.min(
                  100,
                  Math.max(
                    0,
                    (filters.maxPrice /
                      100000) *
                      100,
                  ),
                )}%`,
              }}
            />

            <span
              className="
                absolute
                left-0
                top-1/2
                h-4
                w-4
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border-2
                border-[#A4773E]
                bg-[#FAF8F5]
                shadow-[0_2px_7px_rgba(70,50,30,0.12)]
              "
            />

            <span
              className="
                absolute
                right-0
                top-1/2
                h-4
                w-4
                translate-x-1/2
                -translate-y-1/2
                rounded-full
                border-2
                border-[#A4773E]
                bg-[#FAF8F5]
                shadow-[0_2px_7px_rgba(70,50,30,0.12)]
              "
            />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-[11px] text-[#766D63]">
              ₹
              {filters.minPrice.toLocaleString(
                "en-IN",
              )}
            </span>

            <span className="text-[11px] text-[#766D63]">
              ₹
              {filters.maxPrice.toLocaleString(
                "en-IN",
              )}
            </span>
          </div>

          {/* Price controls */}

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
                    100000,
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

        <div className="mt-5 flex items-center gap-3">
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

        <div className="mt-3 flex gap-3">
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