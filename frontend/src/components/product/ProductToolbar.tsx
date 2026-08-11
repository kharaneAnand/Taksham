import {
  ChevronDown,
  Filter,
  Grid2X2,
  List,
} from "lucide-react";

interface ProductToolbarProps {
  productCount: number;
  sortBy: string;
  onSortChange: (value: string) => void;
  onFilterClick: () => void;

  viewMode: "grid" | "list";
  onViewModeChange: (
    mode: "grid" | "list",
  ) => void;

  category: string;
  onCategoryChange: (
    value: string,
  ) => void;

  material: string;
  onMaterialChange: (
    value: string,
  ) => void;

  color: string;
  onColorChange: (
    value: string,
  ) => void;

  price: string;
  onPriceChange: (
    value: string,
  ) => void;
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
  "All Materials",
  "Wood",
  "Fabric",
  "Metal",
  "Glass",
];

const colors = [
  "All Colors",
  "Beige",
  "Brown",
  "Black",
  "White",
];

const prices = [
  "All Prices",
  "Under ₹10,000",
  "₹10,000 – ₹20,000",
  "₹20,000 – ₹30,000",
  "Above ₹30,000",
];

const sortOptions = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "Name",
];

interface SelectButtonProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  ariaLabel: string;
}

const SelectButton = ({
  value,
  options,
  onChange,
  ariaLabel,
}: SelectButtonProps) => {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        aria-label={ariaLabel}
        className="
          h-10
          min-w-37
          cursor-pointer
          appearance-none
          rounded-[9px]
          border
          border-[#DCD2C5]
          bg-white
          pl-4
          pr-9
          text-[12px]
          font-medium
          text-[#4A433B]
          outline-none
          transition-all
          duration-200
          hover:border-[#C6B292]
          focus:border-[#A4773E]
          focus:ring-2
          focus:ring-[#A4773E]/10
          sm:h-11
          sm:min-w-39
        "
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={14}
        strokeWidth={1.4}
        className="
          pointer-events-none
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          text-[#8E8274]
        "
      />
    </div>
  );
};

const ProductToolbar = ({
  productCount,
  sortBy,
  onSortChange,
  onFilterClick,
  viewMode,
  onViewModeChange,
  category,
  onCategoryChange,
  material,
  onMaterialChange,
  color,
  onColorChange,
  price,
  onPriceChange,
}: ProductToolbarProps) => {
  return (
    <div
      className="
        border-y
        border-[#E2D9CE]
        py-4
        sm:py-5
      "
    >
      <div
        className="
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
          lg:gap-4
        "
      >


        <div
          className="
            flex
            min-w-0
            flex-1
            flex-wrap
            items-center
            gap-2
            sm:gap-2.5
          "
        >
          {/* Filter button */}

          <button
            type="button"
            onClick={onFilterClick}
            className="
              flex
              h-10
              items-center
              gap-2
              rounded-[9px]
              border
              border-[#DCD2C5]
              bg-white
              px-4
              text-[12px]
              font-semibold
              text-[#403A33]
              transition-all
              duration-200
              hover:border-[#BDA47F]
              hover:bg-[#F9F5EF]
              hover:text-[#7F5D35]
              sm:h-11
            "
          >
            <Filter
              size={15}
              strokeWidth={1.5}
            />

            <span>Filter</span>
          </button>

          {/* Desktop dropdowns */}

          <div className="hidden items-center gap-2 sm:flex">
            <SelectButton
              value={category}
              options={categories}
              onChange={
                onCategoryChange
              }
              ariaLabel="Category"
            />

            <SelectButton
              value={material}
              options={materials}
              onChange={
                onMaterialChange
              }
              ariaLabel="Material"
            />

            <SelectButton
              value={price}
              options={prices}
              onChange={
                onPriceChange
              }
              ariaLabel="Price"
            />

            <SelectButton
              value={color}
              options={colors}
              onChange={onColorChange}
              ariaLabel="Color"
            />
          </div>
        </div>


        <div
          className="
            flex
            shrink-0
            items-center
            gap-3
          "
        >
          {/* Product count */}

          <span
            className="
              hidden
              whitespace-nowrap
              text-[11px]
              font-medium
              uppercase
              tracking-widest
              text-[#8B8176]
              lg:inline
            "
          >
            {productCount} Products
          </span>

          <span
            className="
              hidden
              h-5
              w-px
              bg-[#DED5CA]
              lg:block
            "
          />

          {/* Sort */}

          <div className="flex items-center gap-2">
            <span
              className="
                hidden
                text-[10px]
                font-medium
                uppercase
                tracking-widest
                text-[#978D82]
                md:inline
              "
            >
              Sort by
            </span>

            <SelectButton
              value={sortBy}
              options={sortOptions}
              onChange={onSortChange}
              ariaLabel="Sort products"
            />
          </div>

          {/* View toggle */}

          <div
            className="
              hidden
              items-center
              rounded-[9px]
              border
              border-[#DCD2C5]
              bg-white
              p-1
              sm:flex
            "
          >
            <button
              type="button"
              onClick={() =>
                onViewModeChange(
                  "grid",
                )
              }
              aria-label="Grid view"
              className={`
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-[7px]
                transition-all
                duration-200
                ${
                  viewMode === "grid"
                    ? "bg-[#F0E5D6] text-[#856238]"
                    : "text-[#9A9186] hover:text-[#66584A]"
                }
              `}
            >
              <Grid2X2
                size={16}
                strokeWidth={1.4}
              />
            </button>

            <button
              type="button"
              onClick={() =>
                onViewModeChange(
                  "list",
                )
              }
              aria-label="List view"
              className={`
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-[7px]
                transition-all
                duration-200
                ${
                  viewMode === "list"
                    ? "bg-[#F0E5D6] text-[#856238]"
                    : "text-[#9A9186] hover:text-[#66584A]"
                }
              `}
            >
              <List
                size={17}
                strokeWidth={1.4}
              />
            </button>
          </div>
        </div>
      </div>



      <div
        className="
          mt-3
          flex
          items-center
          justify-between
          border-t
          border-[#EEE7DE]
          pt-3
          sm:hidden
        "
      >
        <span
          className="
            text-[11px]
            font-medium
            text-[#81776C]
          "
        >
          {productCount} products
        </span>

        <span
          className="
            text-[11px]
            text-[#A4773E]
          "
        >
          {sortBy}
        </span>
      </div>
    </div>
  );
};

export default ProductToolbar;