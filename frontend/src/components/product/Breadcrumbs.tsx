import { Link, useSearchParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const formatCategory = (value: string) => {
  return value
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
};

const Breadcrumbs = () => {
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category");

  const currentLabel = category
    ? formatCategory(category)
    : "All Products";

  return (
    <nav
      aria-label="Breadcrumb"
      className="
        flex
        min-w-0
        items-center
        gap-1.5
        overflow-hidden
        whitespace-nowrap
      "
    >
      <Link
        to="/"
        className="
          shrink-0
          text-[9px]
          font-medium
          uppercase
          tracking-[0.14em]
          text-[#9A9186]
          transition-colors
          hover:text-[#A4773E]
          sm:text-[10px]
        "
      >
        Home
      </Link>

      <ChevronRight
        size={11}
        strokeWidth={1.5}
        className="shrink-0 text-[#B7AEA3]"
      />

      <Link
        to="/products"
        className="
          shrink-0
          text-[9px]
          font-medium
          uppercase
          tracking-[0.14em]
          text-[#9A9186]
          transition-colors
          hover:text-[#A4773E]
          sm:text-[10px]
        "
      >
        Collections
      </Link>

      <ChevronRight
        size={11}
        strokeWidth={1.5}
        className="shrink-0 text-[#B7AEA3]"
      />

      <span
        className="
          min-w-0
          truncate
          text-[9px]
          font-semibold
          uppercase
          tracking-[0.14em]
          text-[#403A33]
          sm:text-[10px]
        "
      >
        {currentLabel}
      </span>
    </nav>
  );
};

export default Breadcrumbs;