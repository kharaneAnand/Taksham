import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import livingRoom from "../../assets/images/rooms/living-room.png";
import bedroom from "../../assets/images/rooms/bedroom.png";
import kitchen from "../../assets/images/rooms/kitchen.png";
import diningRoom from "../../assets/images/rooms/diningroom.png";
import homeOffice from "../../assets/images/rooms/office.png";
import Study from "../../assets/images/rooms/Study.png";
import Balcony from "../../assets/images/rooms/Balcony.png";
import Entertainment from "../../assets/images/rooms/Entertainment.png";

import sofa from "../../assets/images/categories/sofa.png";
import chair from "../../assets/images/categories/chair.png";
import table from "../../assets/images/categories/Table.png";
import storage from "../../assets/images/categories/Storage.png";
import beds from "../../assets/images/categories/beds.png";
import lighting from "../../assets/images/categories/Lighting.png";
import decor from "../../assets/images/categories/Dacore.png";
import rugs from "../../assets/images/categories/Rugs.png";

import { getProducts } from "../../api/product.api";

import type { Product } from "../../types/product";

import ProductGrid from "../../components/product/ProductGrid";

import { useCart } from "../../context/CartContext";

/*
 * ========================================
 * Room Data
 * ========================================
 */

interface RoomCategory {
  name: string;
  image: string;
  slug: string;
}

interface RoomData {
  name: string;
  slug: string;

  /*
   * This is the value stored in the
   * product database.
   *
   * URL slug:
   * living-room
   *
   * Product room:
   * living room
   */
  productRoom: string;

  image: string;

  description: string;

  categories: RoomCategory[];
}

/*
 * ========================================
 * Common Categories
 * ========================================
 */

const commonCategories: RoomCategory[] = [
  {
    name: "Sofas",
    slug: "sofas",
    image: sofa,
  },

  {
    name: "Chairs",
    slug: "chairs",
    image: chair,
  },

  {
    name: "Tables",
    slug: "tables",
    image: table,
  },

  {
    name: "Storage",
    slug: "storage",
    image: storage,
  },

  {
    name: "Beds",
    slug: "beds",
    image: beds,
  },

  {
    name: "Lighting",
    slug: "lighting",
    image: lighting,
  },

  {
    name: "Decor",
    slug: "decor",
    image: decor,
  },

  {
    name: "Rugs",
    slug: "rugs",
    image: rugs,
  },
];

/*
 * ========================================
 * Room Configuration
 * ========================================
 */

const roomData: Record<
  string,
  RoomData
> = {
  "living-room": {
    name: "Living Room",

    slug: "living-room",

    productRoom: "living room",

    image: livingRoom,

    description:
      "A thoughtfully curated collection for the heart of your home — from comfortable sofas and statement chairs to coffee tables and finishing touches.",

    categories:
      commonCategories.filter(
        (category) =>
          [
            "Sofas",
            "Chairs",
            "Tables",
            "Storage",
            "Lighting",
            "Decor",
          ].includes(category.name),
      ),
  },

  bedroom: {
    name: "Bedroom",

    slug: "bedroom",

    productRoom: "bedroom",

    image: bedroom,

    description:
      "Create a calm and personal retreat with furniture and details designed around comfort, storage and everyday living.",

    categories:
      commonCategories.filter(
        (category) =>
          [
            "Beds",
            "Storage",
            "Lighting",
            "Decor",
            "Rugs",
          ].includes(category.name),
      ),
  },

  kitchen: {
    name: "Kitchen",

    slug: "kitchen",

    productRoom: "kitchen",

    image: kitchen,

    description:
      "Bring function and warmth together with pieces designed to make everyday cooking, dining and gathering feel effortless.",

    categories:
      commonCategories.filter(
        (category) =>
          [
            "Tables",
            "Chairs",
            "Storage",
            "Lighting",
            "Decor",
          ].includes(category.name),
      ),
  },

  "dining-room": {
    name: "Dining Room",

    slug: "dining-room",

    productRoom: "dining room",

    image: diningRoom,

    description:
      "Set the scene for everyday meals and memorable gatherings with considered dining furniture and warm finishing details.",

    categories:
      commonCategories.filter(
        (category) =>
          [
            "Tables",
            "Chairs",
            "Storage",
            "Lighting",
            "Decor",
          ].includes(category.name),
      ),
  },

  "home-office": {
    name: "Home Office",

    slug: "home-office",

    productRoom: "home office",

    image: homeOffice,

    description:
      "Build a workspace that feels focused, comfortable and distinctly yours with practical furniture and thoughtful details.",

    categories:
      commonCategories.filter(
        (category) =>
          [
            "Tables",
            "Chairs",
            "Storage",
            "Lighting",
          ].includes(category.name),
      ),
  },

  "study-library": {
    name: "Study & Library",

    slug: "study-library",

    productRoom: "study & library",

    image: Study,

    description:
      "Create a quiet corner for reading, learning and reflection with furniture designed for comfortable, focused spaces.",

    categories:
      commonCategories.filter(
        (category) =>
          [
            "Chairs",
            "Tables",
            "Storage",
            "Lighting",
            "Decor",
          ].includes(category.name),
      ),
  },

  balcony: {
    name: "Balcony",

    slug: "balcony",

    productRoom: "balcony",

    image: Balcony,

    description:
      "Turn your balcony into an inviting extension of your home with comfortable seating, compact tables and finishing touches.",

    categories:
      commonCategories.filter(
        (category) =>
          [
            "Chairs",
            "Tables",
            "Lighting",
            "Decor",
            "Rugs",
          ].includes(category.name),
      ),
  },

  "entertainment-room": {
    name: "Entertainment Room",

    slug: "entertainment-room",

    productRoom: "entertainment room",

    image: Entertainment,

    description:
      "Create a relaxed space for movie nights, conversations and weekends with comfortable seating and practical storage.",

    categories:
      commonCategories.filter(
        (category) =>
          [
            "Sofas",
            "Chairs",
            "Tables",
            "Storage",
            "Lighting",
          ].includes(category.name),
      ),
  },
};

/*
 * ========================================
 * Product Skeleton
 * ========================================
 */

const ProductSkeleton = () => {
  return (
    <div
      className="
        grid
        grid-cols-2
        gap-3
        sm:grid-cols-2
        lg:grid-cols-4
      "
    >
      {Array.from({
        length: 4,
      }).map((_, index) => (
        <div
          key={index}
          className="
            overflow-hidden
            rounded-2xl
            border
            border-[#E5DED4]
            bg-white
          "
        >
          <div
            className="
              aspect-square
              animate-pulse
              bg-[#EEE8DF]
            "
          />

          <div className="space-y-2 p-3.5">
            <div className="h-2.5 w-2/3 animate-pulse rounded bg-[#E8E1D8]" />

            <div className="h-3.5 w-4/5 animate-pulse rounded bg-[#E8E1D8]" />

            <div className="h-3 w-1/3 animate-pulse rounded bg-[#E8E1D8]" />
          </div>
        </div>
      ))}
    </div>
  );
};

/*
 * ========================================
 * Room Details
 * ========================================
 */

const RoomDetails = () => {
  const { id } =
    useParams<{
      id: string;
    }>();

  const navigate = useNavigate();

  const { addToCart } = useCart();

  /*
   * ----------------------------------------
   * Room
   * ----------------------------------------
   */

  const room =
    id
      ? roomData[id]
      : undefined;

  /*
   * ----------------------------------------
   * Products
   * ----------------------------------------
   */

  const [products, setProducts] =
    useState<Product[]>([]);

  const [
    isLoadingProducts,
    setIsLoadingProducts,
  ] = useState(true);

  const [
    productsError,
    setProductsError,
  ] = useState<string | null>(null);

  /*
   * ========================================
   * Fetch Room Products
   * ========================================
   */

  useEffect(() => {
    if (!id || !room) {
      setProducts([]);

      setIsLoadingProducts(false);

      return;
    }

    const fetchRoomProducts =
      async () => {
        try {
          setIsLoadingProducts(true);

          setProductsError(null);

          /*
           * IMPORTANT
           *
           * Use the database room value,
           * NOT the URL slug.
           *
           * URL:
           *
           * /rooms/living-room
           *
           * Database:
           *
           * living room
           */

          const result =
            await getProducts({
              room: room.productRoom,

              limit: 8,
            });

          setProducts(
            result.products ?? [],
          );
        } catch (error) {
          console.error(
            "Failed to fetch room products:",
            error,
          );

          setProducts([]);

          setProductsError(
            error instanceof Error
              ? error.message
              : "Failed to load room products",
          );
        } finally {
          setIsLoadingProducts(false);
        }
      };

    fetchRoomProducts();
  }, [id, room]);

  /*
   * ========================================
   * Invalid Room
   * ========================================
   */

  if (!room) {
    return (
      <main className="min-h-screen bg-[#FAF8F5]">
        <div
          className="
            mx-auto
            flex
            min-h-[65vh]
            max-w-350
            items-center
            justify-center
            px-5
          "
        >
          <div className="max-w-sm text-center">
            <p
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.2em]
                text-[#A47D3C]
              "
            >
              Room not found
            </p>

            <h1
              className="
                mt-3
                font-serif
                text-[28px]
                font-medium
                text-[#1E1D1B]
              "
            >
              This space doesn't exist.
            </h1>

            <button
              type="button"
              onClick={() =>
                navigate("/rooms")
              }
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                text-[11px]
                font-medium
                text-[#3A3733]
                transition-colors
                hover:text-[#A47D3C]
              "
            >
              <ArrowLeft size={14} />

              Back to rooms
            </button>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ========================================
   * Handlers
   * ========================================
   */

  const handleShopRoom = () => {
    /*
     * Use the database value here as well.
     *
     * Example:
     *
     * /products?room=living%20room
     */

    navigate(
      `/products?room=${encodeURIComponent(
        room.productRoom,
      )}`,
    );
  };

  const handleCategory = (
    category: RoomCategory,
  ) => {
    navigate(
      `/products?category=${encodeURIComponent(
        category.slug,
      )}`,
    );
  };

  const handleAddToCart = async (
    product: Product,
  ) => {
    await addToCart(product);
  };

  /*
   * ========================================
   * Page
   * ========================================
   */

  return (
    <main className="min-h-screen bg-[#FAF8F5]">

      {/* ========================================
          BREADCRUMB
      ======================================== */}

      <div
        className="
          mx-auto
          max-w-350
          px-4
          pt-5
          sm:px-6
          lg:px-8
        "
      >
        <div
          className="
            flex
            items-center
            gap-1.5
            text-[9px]
            font-medium
            uppercase
            tracking-[0.12em]
            text-[#A3988B]
            sm:text-[10px]
          "
        >
          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            className="transition-colors hover:text-[#A47D3C]"
          >
            Home
          </button>

          <ChevronRight size={11} />

          <button
            type="button"
            onClick={() =>
              navigate("/rooms")
            }
            className="transition-colors hover:text-[#A47D3C]"
          >
            Rooms
          </button>

          <ChevronRight size={11} />

          <span className="text-[#3A3733]">
            {room.name}
          </span>
        </div>
      </div>

      {/* ========================================
          HERO
      ======================================== */}

      <section
        className="
          mx-auto
          max-w-350
          px-4
          pb-10
          pt-5
          sm:px-6
          sm:pb-12
          lg:px-8
          lg:pb-16
          lg:pt-7
        "
      >
        <div
          className="
            grid
            overflow-hidden
            rounded-[10px]
            border
            border-[#E3DACE]
            bg-[#F2EEE8]
            lg:grid-cols-[0.8fr_1.2fr]
          "
        >
          <div
            className="
              flex
              flex-col
              justify-center
              px-6
              py-9
              sm:px-9
              sm:py-11
              lg:px-12
              lg:py-14
            "
          >
            <p
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.2em]
                text-[#A47D3C]
              "
            >
              {isLoadingProducts
                ? "Curating your room"
                : `${products.length} ${
                    products.length === 1
                      ? "Product"
                      : "Products"
                  }`}
            </p>

            <h1
              className="
                mt-3
                font-serif
                text-[32px]
                font-medium
                leading-[1.05]
                tracking-tight
                text-[#1E1D1B]
                sm:text-[40px]
              "
            >
              {room.name}
            </h1>

            <p
              className="
                mt-4
                max-w-md
                text-[11px]
                leading-6
                text-[#777067]
                sm:text-[12px]
                sm:leading-7
              "
            >
              {room.description}
            </p>

            <button
              type="button"
              onClick={handleShopRoom}
              className="
                group
                mt-6
                flex
                w-fit
                items-center
                gap-2
                rounded-full
                bg-[#292521]
                px-5
                py-2.5
                text-[10px]
                font-medium
                text-white
                transition-all
                duration-300
                hover:bg-[#3A3530]
                sm:px-6
                sm:py-3
                sm:text-[11px]
              "
            >
              Shop {room.name}

              <ArrowRight
                size={14}
                strokeWidth={1.8}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </button>
          </div>

          <div
            className="
              relative
              min-h-75
              overflow-hidden
              sm:min-h-100
              lg:min-h-125
            "
          >
            <img
              src={room.image}
              alt={room.name}
              className="
                h-full
                w-full
                object-cover
                transition-transform
                duration-700
                hover:scale-[1.015]
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
                to-transparent
              "
            />
          </div>
        </div>
      </section>

      {/* ========================================
          CATEGORIES
      ======================================== */}

      <section
        className="
          border-y
          border-[#E5DED4]
          bg-[#F7F4EF]
          py-10
          sm:py-12
          lg:py-14
        "
      >
        <div
          className="
            mx-auto
            max-w-350
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <div
            className="
              mb-5
              flex
              items-end
              justify-between
            "
          >
            <div>
              <p
                className="
                  mb-1
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.17em]
                  text-[#A3988B]
                "
              >
                Shop the room
              </p>

              <h2
                className="
                  font-serif
                  text-[24px]
                  font-medium
                  leading-none
                  tracking-tight
                  text-[#1E1D1B]
                  sm:text-[28px]
                "
              >
                Find pieces for{" "}
                {room.name.toLowerCase()}.
              </h2>
            </div>

            <button
              type="button"
              onClick={handleShopRoom}
              className="
                group
                hidden
                items-center
                gap-1.5
                text-[10px]
                font-medium
                text-[#3A3733]
                hover:text-[#A47D3C]
                sm:flex
              "
            >
              View all

              <ArrowRight
                size={13}
                className="
                  transition-transform
                  group-hover:translate-x-1
                "
              />
            </button>
          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-2.5
              sm:grid-cols-3
              lg:grid-cols-6
              lg:gap-3
              xl:gap-4
            "
          >
            {room.categories.map(
              (category) => (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() =>
                    handleCategory(
                      category,
                    )
                  }
                  className="
                    group
                    relative
                    flex
                    h-29.5
                    flex-col
                    items-center
                    justify-end
                    overflow-hidden
                    rounded-[9px]
                    border
                    border-[#E5DED4]
                    bg-[#F9F6F1]
                    pb-3
                    transition-all
                    duration-500
                    hover:-translate-y-1
                    hover:border-[#D6C2A3]
                    hover:bg-[#FFFDF9]
                    hover:shadow-[0_14px_30px_rgba(58,46,34,0.10)]
                    sm:h-32
                  "
                >
                  <span
                    className="
                      pointer-events-none
                      absolute
                      left-1/2
                      top-1/2
                      h-20
                      w-20
                      -translate-x-1/2
                      -translate-y-1/2
                      rounded-full
                      bg-[#EBDCC5]
                      opacity-0
                      blur-2xl
                      transition-opacity
                      duration-500
                      group-hover:opacity-30
                    "
                  />

                  <div
                    className="
                      relative
                      flex
                      h-20.5
                      w-full
                      items-center
                      justify-center
                      overflow-hidden
                      sm:h-22.5
                    "
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="
                        h-full
                        w-full
                        object-contain
                        px-2
                        transition-transform
                        duration-700
                        group-hover:scale-[1.08]
                      "
                    />
                  </div>

                  <span
                    className="
                      relative
                      z-10
                      text-[10px]
                      font-medium
                      text-[#302D29]
                      transition-colors
                      group-hover:text-[#A47D3C]
                      sm:text-[11px]
                    "
                  >
                    {category.name}
                  </span>

                  <span
                    className="
                      absolute
                      bottom-0
                      left-1/2
                      h-0.5
                      w-0
                      -translate-x-1/2
                      bg-[#C49A5A]
                      transition-all
                      duration-500
                      group-hover:w-9
                    "
                  />
                </button>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ========================================
          ROOM PRODUCTS
      ======================================== */}

      <section
        className="
          bg-[#FAF8F5]
          py-12
          sm:py-14
          lg:py-18
        "
      >
        <div
          className="
            mx-auto
            max-w-350
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <div
            className="
              mb-7
              flex
              items-end
              justify-between
              gap-5
              border-b
              border-[#E3DACE]
              pb-5
            "
          >
            <div>
              <p
                className="
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-[#A3988B]
                "
              >
                Curated for this space
              </p>

              <h2
                className="
                  mt-2
                  font-serif
                  text-[26px]
                  font-medium
                  leading-none
                  tracking-tight
                  text-[#1E1D1B]
                  sm:text-[32px]
                "
              >
                Shop {room.name}
              </h2>

              <p
                className="
                  mt-2
                  max-w-lg
                  text-[10px]
                  leading-5
                  text-[#888078]
                  sm:text-[11px]
                "
              >
                Discover pieces selected for
                the look, function and feel of
                your {room.name.toLowerCase()}.
              </p>
            </div>

            <button
              type="button"
              onClick={handleShopRoom}
              className="
                group
                hidden
                shrink-0
                items-center
                gap-1.5
                text-[10px]
                font-medium
                text-[#3A3733]
                transition-colors
                hover:text-[#A47D3C]
                sm:flex
              "
            >
              View all

              <ArrowRight
                size={13}
                className="
                  transition-transform
                  group-hover:translate-x-1
                "
              />
            </button>
          </div>

          {isLoadingProducts && (
            <ProductSkeleton />
          )}

          {!isLoadingProducts &&
            productsError && (
              <div
                className="
                  rounded-xl
                  border
                  border-[#E5DED4]
                  bg-[#F7F3EC]
                  px-5
                  py-10
                  text-center
                "
              >
                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-[#A47D3C]
                  "
                >
                  Something went wrong
                </p>

                <h3
                  className="
                    mt-2
                    font-serif
                    text-[22px]
                    text-[#302B25]
                  "
                >
                  We couldn't load this room.
                </h3>

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-md
                    text-[10px]
                    leading-5
                    text-[#82796F]
                  "
                >
                  {productsError}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    window.location.reload()
                  }
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-[#292521]
                    px-5
                    py-2.5
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.12em]
                    text-white
                    transition
                    hover:bg-[#3A3530]
                  "
                >
                  Try again
                </button>
              </div>
            )}

          {!isLoadingProducts &&
            !productsError &&
            products.length === 0 && (
              <div
                className="
                  rounded-xl
                  border
                  border-[#E5DED4]
                  bg-[#F7F3EC]
                  px-5
                  py-12
                  text-center
                "
              >
                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-[#A47D3C]
                  "
                >
                  Coming together
                </p>

                <h3
                  className="
                    mt-2
                    font-serif
                    text-[23px]
                    text-[#302B25]
                  "
                >
                  More pieces are coming soon.
                </h3>

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-md
                    text-[10px]
                    leading-5
                    text-[#82796F]
                  "
                >
                  We're currently adding more
                  pieces to this room. Explore
                  our full collection in the
                  meantime.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/products")
                  }
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-[#292521]
                    px-5
                    py-2.5
                    text-[9px]
                    font-medium
                    uppercase
                    tracking-[0.12em]
                    text-white
                    transition
                    hover:bg-[#3A3530]
                  "
                >
                  Explore products

                  <ArrowRight size={13} />
                </button>
              </div>
            )}

          {!isLoadingProducts &&
            !productsError &&
            products.length > 0 && (
              <>
                <ProductGrid
                  products={products}
                  viewMode="grid"
                  onAddToCart={
                    handleAddToCart
                  }
                />

                <div
                  className="
                    mt-7
                    flex
                    justify-center
                    sm:hidden
                  "
                >
                  <button
                    type="button"
                    onClick={handleShopRoom}
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.14em]
                      text-[#76562F]
                    "
                  >
                    View all {room.name} products

                    <ArrowRight
                      size={13}
                      className="
                        transition-transform
                        group-hover:translate-x-1
                      "
                    />
                  </button>
                </div>
              </>
            )}
        </div>
      </section>

      {/* ========================================
          INSPIRATION
      ======================================== */}

      <section className="bg-[#FAF8F5]">
        <div
          className="
            mx-auto
            max-w-350
            px-4
            py-12
            sm:px-6
            lg:px-8
            lg:py-16
          "
        >
          <div
            className="
              flex
              flex-col
              items-start
              justify-between
              gap-5
              border-b
              border-[#E3DACE]
              pb-8
              sm:flex-row
              sm:items-end
            "
          >
            <div>
              <p
                className="
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-[#A3988B]
                "
              >
                More to explore
              </p>

              <h2
                className="
                  mt-2
                  font-serif
                  text-[24px]
                  font-medium
                  text-[#1E1D1B]
                  sm:text-[28px]
                "
              >
                Find your inspiration.
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/ideas")
              }
              className="
                group
                flex
                items-center
                gap-1.5
                text-[10px]
                font-medium
                text-[#3A3733]
                hover:text-[#A47D3C]
              "
            >
              Ideas & inspiration

              <ArrowRight
                size={13}
                className="
                  transition-transform
                  group-hover:translate-x-1
                "
              />
            </button>
          </div>

          <div
            className="
              mt-7
              grid
              grid-cols-1
              gap-3
              sm:grid-cols-2
            "
          >
            <div
              className="
                rounded-[9px]
                border
                border-[#E5DED4]
                bg-[#F7F3EC]
                p-5
                sm:p-7
              "
            >
              <p
                className="
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-[#A47D3C]
                "
              >
                Curated for you
              </p>

              <h3
                className="
                  mt-2
                  font-serif
                  text-[21px]
                  font-medium
                  text-[#282623]
                "
              >
                Pieces that work beautifully
                together.
              </h3>

              <p
                className="
                  mt-2
                  max-w-md
                  text-[10px]
                  leading-5
                  text-[#888178]
                "
              >
                Discover furniture and
                accessories selected to make
                styling your space easier.
              </p>
            </div>

            <div
              className="
                rounded-[9px]
                border
                border-[#E5DED4]
                bg-white
                p-5
                sm:p-7
              "
            >
              <p
                className="
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-[#A47D3C]
                "
              >
                Need a little help?
              </p>

              <h3
                className="
                  mt-2
                  font-serif
                  text-[21px]
                  font-medium
                  text-[#282623]
                "
              >
                Design your space with us.
              </h3>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/consultation",
                  )
                }
                className="
                  group
                  mt-4
                  flex
                  items-center
                  gap-1.5
                  text-[10px]
                  font-medium
                  text-[#3A3733]
                  hover:text-[#A47D3C]
                "
              >
                Book a consultation

                <ArrowRight
                  size={13}
                  className="
                    transition-transform
                    group-hover:translate-x-1
                  "
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          BACK
      ======================================== */}

      <section
        className="
          border-t
          border-[#E5DED4]
          bg-[#FAF8F5]
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-350
            px-4
            py-7
            sm:px-6
            lg:px-8
          "
        >
          <button
            type="button"
            onClick={() =>
              navigate("/rooms")
            }
            className="
              group
              flex
              items-center
              gap-2
              text-[10px]
              font-medium
              text-[#3A3733]
              hover:text-[#A47D3C]
            "
          >
            <ArrowLeft
              size={13}
              className="
                transition-transform
                group-hover:-translate-x-1
              "
            />

            Back to all rooms
          </button>
        </div>
      </section>
    </main>
  );
};

export default RoomDetails;