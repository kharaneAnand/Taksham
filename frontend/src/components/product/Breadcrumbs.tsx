import {
  useEffect,
  useState,
} from "react";

import {
  ChevronRight,
  Home,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import type {
  Product,
} from "../../types/product";

import {
  getProductBySlug,
} from "../../api/product.api";

const Breadcrumbs = () => {
  const location = useLocation();

  const [product, setProduct] =
    useState<Product | null>(null);

  const pathname = location.pathname;

  const isProductDetails =
    pathname.startsWith("/products/") &&
    pathname !== "/products";

  const slug = isProductDetails
    ? pathname.split("/")[2]
    : undefined;

  useEffect(() => {
    if (!slug) {
      setProduct(null);
      return;
    }

    let cancelled = false;

    const fetchProduct = async () => {
      try {
        const data =
          await getProductBySlug(slug);

        if (!cancelled) {
          setProduct(data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to fetch breadcrumb product:",
            error,
          );

          setProduct(null);
        }
      }
    };

    void fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <nav
      aria-label="Breadcrumb"
      className="
        flex
        min-w-0
        items-center
        gap-2
        overflow-x-auto
        whitespace-nowrap
        text-[9px]
        sm:text-[10px]
      "
    >
      <Link
        to="/"
        className="
          flex
          shrink-0
          items-center
          gap-1.5
          text-[#8B8176]
          transition-colors
          hover:text-[#76572F]
        "
      >
        <Home
          size={12}
          strokeWidth={1.5}
        />

        <span>Home</span>
      </Link>

      <ChevronRight
        size={11}
        strokeWidth={1.4}
        className="shrink-0 text-[#C3B8AA]"
      />

      <Link
        to="/products"
        className="
          shrink-0
          text-[#8B8176]
          transition-colors
          hover:text-[#76572F]
        "
      >
        Collections
      </Link>

      {!isProductDetails && (
        <>
          <ChevronRight
            size={11}
            strokeWidth={1.4}
            className="shrink-0 text-[#C3B8AA]"
          />

          <span className="shrink-0 font-medium text-[#403A33]">
            All Products
          </span>
        </>
      )}

      {isProductDetails && (
        <>
          <ChevronRight
            size={11}
            strokeWidth={1.4}
            className="shrink-0 text-[#C3B8AA]"
          />

          <Link
            to="/products"
            className="
              shrink-0
              text-[#8B8176]
              transition-colors
              hover:text-[#76572F]
            "
          >
            All Products
          </Link>

          <ChevronRight
            size={11}
            strokeWidth={1.4}
            className="shrink-0 text-[#C3B8AA]"
          />

          <span className="truncate font-medium text-[#403A33]">
            {product?.name ?? "Product"}
          </span>
        </>
      )}
    </nav>
  );
};

export default Breadcrumbs;