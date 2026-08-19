import {
  ChevronLeft,
  ChevronRight,
  Edit3,
  Package,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import {
  deleteProduct,
  getProducts,
} from "../../api/product.api";

import type { Product } from "../../types/product";

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalProducts, setTotalProducts] =
    useState(0);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const limit = 10;

  /*
   * =====================================================
   * FETCH PRODUCTS
   * =====================================================
   */

  const fetchProducts =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const result =
          await getProducts({
            page,
            limit,
            search:
              search.trim() || undefined,
          });

        setProducts(
          result.products,
        );

        setTotalProducts(
          result.pagination
            .totalProducts,
        );

        setTotalPages(
          Math.max(
            1,
            result.pagination
              .totalPages,
          ),
        );
      } catch (error) {
        console.error(
          "Failed to fetch admin products:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load products",
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    }, [page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  /*
   * =====================================================
   * SEARCH
   * =====================================================
   */

  const handleSearch = (
    value: string,
  ) => {
    setSearch(value);
    setPage(1);
  };

  /*
   * =====================================================
   * DELETE
   * =====================================================
   */

  const handleDelete = async (
    product: Product,
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${product.name}"?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(
        product._id,
      );

      await deleteProduct(
        product._id,
      );

      toast.success(
        "Product deleted successfully",
      );

      await fetchProducts();
    } catch (error) {
      console.error(
        "Failed to delete product:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete product",
      );
    } finally {
      setDeletingId(null);
    }
  };

  /*
   * =====================================================
   * HELPERS
   * =====================================================
   */

  const formatPrice = (
    price: number,
  ) =>
    `₹${price.toLocaleString(
      "en-IN",
    )}`;

  /*
   * =====================================================
   * PAGE
   * =====================================================
   */

  return (
    <div className="mx-auto max-w-375">
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          flex
          flex-col
          gap-5
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.28em]
              text-[#A4773E]
            "
          >
            Catalogue
          </p>

          <h2
            className="
              mt-2
              font-serif
              text-[34px]
              leading-none
              tracking-[-0.045em]
              text-[#302B25]
              sm:text-[40px]
            "
          >
            Products
          </h2>

          <p
            className="
              mt-3
              text-[10px]
              text-[#81776C]
            "
          >
            Manage the products available
            across your Taksham store.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate(
              "/admin/products/new",
            )
          }
          className="
            flex
            w-fit
            items-center
            gap-2
            rounded-xl
            bg-[#8F6B3F]
            px-5
            py-3
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.14em]
            text-white
            shadow-[0_8px_20px_rgba(143,107,63,0.16)]
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:bg-[#795832]
          "
        >
          <Plus
            size={14}
            strokeWidth={1.7}
          />

          Add Product
        </button>
      </div>

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div
        className="
          mt-7
          flex
          flex-col
          gap-3
          rounded-[18px]
          border
          border-[#E2DAD0]
          bg-white
          p-4
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div
          className="
            relative
            w-full
            sm:max-w-sm
          "
        >
          <Search
            size={15}
            strokeWidth={1.5}
            className="
              pointer-events-none
              absolute
              left-3.5
              top-1/2
              -translate-y-1/2
              text-[#A0988E]
            "
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              handleSearch(
                event.target.value,
              )
            }
            placeholder="Search products..."
            className="
              h-11
              w-full
              rounded-xl
              border
              border-[#E1D8CD]
              bg-[#FBF9F5]
              pl-10
              pr-4
              text-[10px]
              text-[#302B25]
              outline-none
              transition
              placeholder:text-[#AAA096]
              focus:border-[#BDA47F]
              focus:bg-white
              focus:ring-2
              focus:ring-[#BDA47F]/10
            "
          />
        </div>

        <div className="flex items-center gap-3">
          <span
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-[#A0988E]
            "
          >
            {totalProducts} products
          </span>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          className="
            mt-4
            rounded-2xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-[10px]
            text-red-700
          "
        >
          {error}
        </div>
      )}

      {/* =================================================
          PRODUCT TABLE
      ================================================= */}

      <div
        className="
          mt-4
          overflow-hidden
          rounded-[18px]
          border
          border-[#E2DAD0]
          bg-white
        "
      >
        {/* Desktop header */}

        <div
          className="
            hidden
            grid-cols-[2fr_1fr_1fr_0.8fr_0.7fr_100px]
            items-center
            gap-4
            border-b
            border-[#E7E0D7]
            bg-[#FBF9F5]
            px-5
            py-3.5
            lg:grid
          "
        >
          {[
            "Product",
            "Category",
            "Room",
            "Price",
            "Stock",
            "Actions",
          ].map((heading) => (
            <span
              key={heading}
              className={`
                text-[7px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-[#9A9186]
                ${
                  heading === "Actions"
                    ? "text-right"
                    : ""
                }
              `}
            >
              {heading}
            </span>
          ))}
        </div>

        {loading ? (
          <div
            className="
              flex
              min-h-88
              items-center
              justify-center
            "
          >
            <div className="text-center">
              <div
                className="
                  mx-auto
                  h-7
                  w-7
                  animate-spin
                  rounded-full
                  border-2
                  border-[#DCCFC0]
                  border-t-[#8F6B3F]
                "
              />

              <p
                className="
                  mt-4
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-[#81776C]
                "
              >
                Loading products
              </p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div
            className="
              flex
              min-h-88
              flex-col
              items-center
              justify-center
              px-5
              text-center
            "
          >
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-[#F3EDE5]
              "
            >
              <Package
                size={19}
                strokeWidth={1.3}
                className="text-[#A4773E]"
              />
            </div>

            <h3
              className="
                mt-4
                font-serif
                text-[22px]
                text-[#302B25]
              "
            >
              No products found
            </h3>

            <p
              className="
                mt-2
                max-w-sm
                text-[10px]
                leading-5
                text-[#81776C]
              "
            >
              {search
                ? "Try changing your search."
                : "Start building your catalogue by adding your first product."}
            </p>

            {!search && (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/admin/products/new",
                  )
                }
                className="
                  mt-5
                  flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#8F6B3F]
                  px-5
                  py-3
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-white
                "
              >
                <Plus size={13} />

                Add Product
              </button>
            )}
          </div>
        ) : (
          <div>
            {products.map(
              (product) => (
                <div
                  key={product._id}
                  className="
                    grid
                    gap-4
                    border-b
                    border-[#EEE8E0]
                    px-4
                    py-4
                    transition
                    last:border-b-0
                    hover:bg-[#FCFAF7]
                    lg:grid-cols-[2fr_1fr_1fr_0.8fr_0.7fr_100px]
                    lg:items-center
                    lg:px-5
                  "
                >
                  {/* Product */}

                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="
                        h-14
                        w-14
                        shrink-0
                        overflow-hidden
                        rounded-xl
                        border
                        border-[#E4DDD4]
                        bg-[#F4EFE8]
                      "
                    >
                      {product.image ? (
                        <img
                          src={
                            product.image
                          }
                          alt={
                            product.name
                          }
                          className="
                            h-full
                            w-full
                            object-contain
                            p-1.5
                          "
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Package
                            size={16}
                            className="text-[#B0A69B]"
                          />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-[11px]
                          font-semibold
                          text-[#302B25]
                        "
                      >
                        {product.name}
                      </p>

                      <p
                        className="
                          mt-1
                          truncate
                          text-[8px]
                          text-[#A0988E]
                        "
                      >
                        {product.slug}
                      </p>
                    </div>
                  </div>

                  {/* Category */}

                  <div>
                    <p
                      className="
                        mb-1
                        text-[7px]
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        text-[#A0988E]
                        lg:hidden
                      "
                    >
                      Category
                    </p>

                    <span
                      className="
                        text-[9px]
                        text-[#62594F]
                      "
                    >
                      {product.category}
                    </span>
                  </div>

                  {/* Room */}

                  <div>
                    <p
                      className="
                        mb-1
                        text-[7px]
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        text-[#A0988E]
                        lg:hidden
                      "
                    >
                      Room
                    </p>

                    <span
                      className="
                        text-[9px]
                        text-[#62594F]
                      "
                    >
                      {product.room}
                    </span>
                  </div>

                  {/* Price */}

                  <div>
                    <p
                      className="
                        mb-1
                        text-[7px]
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        text-[#A0988E]
                        lg:hidden
                      "
                    >
                      Price
                    </p>

                    <span
                      className="
                        text-[10px]
                        font-semibold
                        text-[#302B25]
                      "
                    >
                      {formatPrice(
                        product.price,
                      )}
                    </span>
                  </div>

                  {/* Stock */}

                  <div>
                    <p
                      className="
                        mb-1
                        text-[7px]
                        font-semibold
                        uppercase
                        tracking-[0.14em]
                        text-[#A0988E]
                        lg:hidden
                      "
                    >
                      Stock
                    </p>

                    <span
                      className={`
                        inline-flex
                        rounded-full
                        px-2.5
                        py-1
                        text-[7px]
                        font-semibold
                        ${
                          product.stock > 0
                            ? "bg-[#EAF0E5] text-[#68745D]"
                            : "bg-red-50 text-red-600"
                        }
                      `}
                    >
                      {product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of stock"}
                    </span>
                  </div>

                  {/* Actions */}

                  <div
                    className="
                      flex
                      items-center
                      justify-start
                      gap-1.5
                      lg:justify-end
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin/products/${product._id}/edit`,
                        )
                      }
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-[#E1D8CD]
                        text-[#71685E]
                        transition
                        hover:border-[#BDA47F]
                        hover:bg-[#F7F1E9]
                        hover:text-[#76562F]
                      "
                      title="Edit product"
                    >
                      <Edit3
                        size={13}
                        strokeWidth={1.4}
                      />
                    </button>

                    <button
                      type="button"
                      disabled={
                        deletingId ===
                        product._id
                      }
                      onClick={() =>
                        handleDelete(
                          product,
                        )
                      }
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        border
                        border-[#E8D7D2]
                        text-[#9A665D]
                        transition
                        hover:bg-red-50
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                      "
                      title="Delete product"
                    >
                      {deletingId ===
                      product._id ? (
                        <span
                          className="
                            h-3
                            w-3
                            animate-spin
                            rounded-full
                            border
                            border-[#D9C1BA]
                            border-t-[#9A665D]
                          "
                        />
                      ) : (
                        <Trash2
                          size={13}
                          strokeWidth={1.4}
                        />
                      )}
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      {/* =================================================
          PAGINATION
      ================================================= */}

      {!loading &&
        products.length > 0 && (
          <div
            className="
              mt-4
              flex
              items-center
              justify-between
              rounded-2xl
              border
              border-[#E2DAD0]
              bg-white
              px-4
              py-3
            "
          >
            <p
              className="
                text-[8px]
                text-[#81776C]
              "
            >
              Page{" "}
              <span className="font-semibold text-[#302B25]">
                {page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#302B25]">
                {totalPages}
              </span>
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.max(
                        1,
                        current - 1,
                      ),
                  )
                }
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-[#E1D8CD]
                  text-[#71685E]
                  transition
                  hover:bg-[#F7F1E9]
                  disabled:opacity-30
                "
              >
                <ChevronLeft
                  size={14}
                />
              </button>

              <button
                type="button"
                disabled={
                  page >= totalPages
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.min(
                        totalPages,
                        current + 1,
                      ),
                  )
                }
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-[#E1D8CD]
                  text-[#71685E]
                  transition
                  hover:bg-[#F7F1E9]
                  disabled:opacity-30
                "
              >
                <ChevronRight
                  size={14}
                />
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default Products;