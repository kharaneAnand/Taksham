import {
  Check,
  ChevronRight,
  X,
} from "lucide-react";

import type { ProductFilterState } from "./ProductFilters";

interface MobileFilterSheetProps {
  open: boolean;
  filters: ProductFilterState;
  onApply: (
    filters: ProductFilterState,
  ) => void;
  onClose: () => void;
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

const MobileFilterSheet = ({
  open,
  filters,
  onApply,
  onClose,
}: MobileFilterSheetProps) => {
  if (!open) return null;

  const toggleMaterial = (
    material: string,
  ) => {
    onApply({
      ...filters,
      materials:
        filters.materials.includes(
          material,
        )
          ? filters.materials.filter(
              (item) =>
                item !== material,
            )
          : [
              ...filters.materials,
              material,
            ],
    });
  };

  const toggleColor = (
    color: string,
  ) => {
    onApply({
      ...filters,
      colors:
        filters.colors.includes(color)
          ? filters.colors.filter(
              (item) =>
                item !== color,
            )
          : [
              ...filters.colors,
              color,
            ],
    });
  };

  const clearAll = () => {
    onApply({
      category: "All Categories",
      materials: [],
      colors: [],
      minPrice: 0,
      maxPrice: 100000,
      minRating: 0,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 sm:hidden">

      <button
        type="button"
        aria-label="Close filters"
        onClick={onClose}
        className="
          absolute
          inset-0
          bg-[#181511]/45
          backdrop-blur-[3px]
        "
      />

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          max-h-[92vh]
          overflow-y-auto
          rounded-t-[28px]
          border-t
          border-[#E3D9CD]
          bg-[#FAF8F5]
          px-5
          pb-6
          pt-3
          shadow-[0_-20px_60px_rgba(0,0,0,0.18)]
        "
      >
        {/* Handle */}

        <div
          className="
            mx-auto
            h-1
            w-11
            rounded-full
            bg-[#D3C7B8]
          "
        />

        <div
          className="
            mt-5
            flex
            items-center
            justify-between
          "
        >
          <div>
            <p
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-[#A4773E]
              "
            >
              Refine
            </p>

            <h2
              className="
                mt-1
                font-serif
                text-[28px]
                leading-none
                tracking-tight
                text-[#302B25]
              "
            >
              Filter Products
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-[#DCD2C5]
              bg-white
              text-[#403A33]
              transition
              hover:border-[#BFA786]
            "
          >
            <X size={18} />
          </button>
        </div>



        <div className="mt-8">
          <div className="flex items-center justify-between">
            <p
              className="
                text-[12px]
                font-semibold
                uppercase
                tracking-[0.08em]
                text-[#554D44]
              "
            >
              Category
            </p>

            <span className="text-[10px] text-[#9A9186]">
              {filters.category}
            </span>
          </div>

          <div className="mt-4 space-y-1">
            {categories.map(
              (category) => {
                const active =
                  filters.category ===
                  category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      onApply({
                        ...filters,
                        category,
                      })
                    }
                    className={`
                      flex
                      min-h-12
                      w-full
                      items-center
                      justify-between
                      rounded-[10px]
                      px-4
                      text-left
                      transition
                      ${
                        active
                          ? "bg-[#F0E5D6] text-[#805D34]"
                          : "text-[#655D55] hover:bg-[#F5F0E9]"
                      }
                    `}
                  >
                    <span
                      className={`
                        text-[14px]
                        ${
                          active
                            ? "font-semibold"
                            : "font-normal"
                        }
                      `}
                    >
                      {category}
                    </span>

                    {active && (
                      <Check
                        size={17}
                        strokeWidth={1.7}
                        className="text-[#A4773E]"
                      />
                    )}
                  </button>
                );
              },
            )}
          </div>
        </div>


        <div
          className="
            mt-7
            border-t
            border-[#E5DED4]
            pt-6
          "
        >
          <p
            className="
              text-[12px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-[#554D44]
            "
          >
            Material
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {materials.map(
              (material) => {
                const active =
                  filters.materials.includes(
                    material,
                  );

                return (
                  <button
                    key={material}
                    type="button"
                    onClick={() =>
                      toggleMaterial(
                        material,
                      )
                    }
                    className={`
                      flex
                      min-h-11.25
                      items-center
                      justify-between
                      rounded-[9px]
                      border
                      px-3.5
                      text-[13px]
                      transition
                      ${
                        active
                          ? "border-[#B99A6B] bg-[#F1E6D7] font-medium text-[#805D34]"
                          : "border-[#DED5C9] bg-white text-[#6E655C]"
                      }
                    `}
                  >
                    {material}

                    {active && (
                      <Check
                        size={15}
                        strokeWidth={1.7}
                      />
                    )}
                  </button>
                );
              },
            )}
          </div>
        </div>



        <div
          className="
            mt-7
            border-t
            border-[#E5DED4]
            pt-6
          "
        >
          <div className="flex items-center justify-between">
            <p
              className="
                text-[12px]
                font-semibold
                uppercase
                tracking-[0.08em]
                text-[#554D44]
              "
            >
              Price Range
            </p>

            <span className="text-[11px] text-[#7D7368]">
              ₹
              {filters.maxPrice.toLocaleString(
                "en-IN",
              )}
            </span>
          </div>

          <div className="mt-6">
            <div className="relative h-0.75 rounded-full bg-[#D8CEC2]">
              <div className="absolute inset-y-0 left-0 w-[72%] rounded-full bg-[#A4773E]" />

              <span className="absolute left-0 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#A4773E] bg-[#FAF8F5]" />

              <span className="absolute right-0 top-1/2 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#A4773E] bg-[#FAF8F5]" />
            </div>

            <div className="mt-4 flex justify-between text-[11px] text-[#766D63]">
              <span>₹0</span>
              <span>₹1,00,000+</span>
            </div>
          </div>
        </div>



        <div
          className="
            mt-7
            border-t
            border-[#E5DED4]
            pt-6
          "
        >
          <p
            className="
              text-[12px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-[#554D44]
            "
          >
            Color
          </p>

          <div className="mt-5 flex gap-4">
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
                  onClick={() =>
                    toggleColor(
                      color.name,
                    )
                  }
                  className={`
                    relative
                    h-10
                    w-10
                    rounded-full
                    border
                    transition
                    ${
                      active
                        ? "border-[#8F6838] ring-2 ring-[#C7AA80] ring-offset-2"
                        : "border-[#D6CEC4]"
                    }
                  `}
                  style={{
                    backgroundColor:
                      color.value,
                  }}
                >
                  {active && (
                    <Check
                      size={15}
                      strokeWidth={1.8}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>



        <div
          className="
            mt-7
            border-t
            border-[#E5DED4]
            pt-6
          "
        >
          <div className="flex items-center justify-between">
            <p
              className="
                text-[12px]
                font-semibold
                uppercase
                tracking-[0.08em]
                text-[#554D44]
              "
            >
              Rating
            </p>

            <ChevronRight
              size={16}
              className="text-[#9A9186]"
            />
          </div>

          <div className="mt-4 space-y-3">
            {[4, 3].map((rating) => {
              const active =
                filters.minRating ===
                rating;

              return (
                <button
                  key={rating}
                  type="button"
                  onClick={() =>
                    onApply({
                      ...filters,
                      minRating: active
                        ? 0
                        : rating,
                    })
                  }
                  className="
                    flex
                    min-h-10.5
                    w-full
                    items-center
                    gap-3
                    rounded-[9px]
                    px-3
                    text-left
                    transition
                    hover:bg-[#F5F0E9]
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
                      ${
                        active
                          ? "border-[#A4773E] bg-[#A4773E] text-white"
                          : "border-[#D5CCC0]"
                      }
                    `}
                  >
                    {active && (
                      <Check size={13} />
                    )}
                  </span>

                  <span className="text-[13px] tracking-[0.04em] text-[#C88924]">
                    {"★".repeat(rating)}
                    <span className="text-[#D8CEC3]">
                      {"★".repeat(
                        5 - rating,
                      )}
                    </span>
                  </span>

                  <span className="text-[13px] text-[#6E655C]">
                    & above
                  </span>
                </button>
              );
            })}
          </div>
        </div>



        <div
          className="
            sticky
            bottom-0
            mt-7
            grid
            grid-cols-2
            gap-3
            border-t
            border-[#E5DED4]
            bg-[#FAF8F5]
            pt-4
          "
        >
          <button
            type="button"
            onClick={clearAll}
            className="
              h-12
              rounded-[10px]
              border
              border-[#D5CABD]
              bg-white
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-[#554D44]
              transition
              hover:bg-[#F6F1EA]
            "
          >
            Clear All
          </button>

          <button
            type="button"
            onClick={onClose}
            className="
              h-12
              rounded-[10px]
              bg-[#27231E]
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.08em]
              text-white
              shadow-[0_8px_22px_rgba(40,34,28,0.14)]
              transition
              hover:bg-[#3A342D]
              active:scale-[0.985]
            "
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterSheet;