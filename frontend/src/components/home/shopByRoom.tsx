import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import { ArrowRight } from "lucide-react";

import { getCategories } from "../../api/category.api";

import type {
  Category as BackendCategory,
} from "../../types/category";

/*
 * ========================================
 * ROOM IMAGES
 * ========================================
 */

import livingRoom from "../../assets/images/rooms/living-room.png";
import bedroom from "../../assets/images/rooms/bedroom.png";
import kitchen from "../../assets/images/rooms/kitchen.png";
import diningRoom from "../../assets/images/rooms/diningroom.png";
import homeOffice from "../../assets/images/rooms/office.png";
import Study from "../../assets/images/rooms/Study.png";
import Balcony from "../../assets/images/rooms/Balcony.png";
import Entertainment from "../../assets/images/rooms/Entertainment.png";

/*
 * ========================================
 * POPULAR CATEGORY IMAGES
 * ========================================
 */

import sofa from "../../assets/images/categories/sofa.png";
import chair from "../../assets/images/categories/chair.png";
import table from "../../assets/images/categories/Table.png";
import storage from "../../assets/images/categories/Storage.png";
import beds from "../../assets/images/categories/beds.png";
import lighting from "../../assets/images/categories/Lighting.png";
import decor from "../../assets/images/categories/Dacore.png";
import rugs from "../../assets/images/categories/Rugs.png";
import mirrors from "../../assets/images/categories/mirrors.png";

/*
 * ========================================
 * TYPES
 * ========================================
 */

interface Room {
  name: string;
  slug: string;
  image: string;
}

interface PopularCategory {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

interface PopularCategoryConfig {
  name: string;
  image: string;
  aliases: string[];
}

interface CategoryItem {
  _id?: string;
  name?: string;
  slug?: string;
}

/*
 * ========================================
 * ROOMS
 * ========================================
 */

const rooms: Room[] = [
  {
    name: "Living Room",
    slug: "living-room",
    image: livingRoom,
  },
  {
    name: "Bedroom",
    slug: "bedroom",
    image: bedroom,
  },
  {
    name: "Kitchen",
    slug: "kitchen",
    image: kitchen,
  },
  {
    name: "Dining Room",
    slug: "dining-room",
    image: diningRoom,
  },
  {
    name: "Home Office",
    slug: "home-office",
    image: homeOffice,
  },
  {
    name: "Study & Library",
    slug: "study-library",
    image: Study,
  },
  {
    name: "Balcony",
    slug: "balcony",
    image: Balcony,
  },
  {
    name: "Entertainment Room",
    slug: "entertainment-room",
    image: Entertainment,
  },
];

/*
 * ========================================
 * FIXED POPULAR CATEGORIES
 * ========================================
 */

const popularCategoryConfigs: PopularCategoryConfig[] = [
  {
    name: "Sofas",
    image: sofa,
    aliases: [
      "sofa",
      "sofas",
    ],
  },
  {
    name: "Chairs",
    image: chair,
    aliases: [
      "chair",
      "chairs",
    ],
  },
  {
    name: "Beds",
    image: beds,
    aliases: [
      "bed",
      "beds",
    ],
  },
  {
    name: "Tables",
    image: table,
    aliases: [
      "table",
      "tables",
    ],
  },
  {
    name: "Storage",
    image: storage,
    aliases: [
      "storage",
    ],
  },
  {
    name: "Lighting",
    image: lighting,
    aliases: [
      "lighting",
      "light",
      "lights",
    ],
  },
  {
    name: "Mirrors",
    image: mirrors,
    aliases: [
      "mirror",
      "mirrors",
    ],
  },
  {
    name: "Decorative Objects",
    image: decor,
    aliases: [
      "decor",
      "decors",
      "decorative-object",
      "decorative-objects",
      "decorativeobject",
      "decorativeobjects",
    ],
  },
  {
    name: "Rugs",
    image: rugs,
    aliases: [
      "rug",
      "rugs",
      "area-rug",
      "area-rugs",
      "floor-rug",
      "floor-rugs",
      "carpet",
      "carpets",
    ],
  },
];

/*
 * ========================================
 * NORMALIZE CATEGORY VALUE
 * ========================================
 */

const normalizeCategoryValue = (
  value?: string,
): string => {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");
};

/*
 * ========================================
 * FIND MATCHING CATEGORY CONFIG
 * ========================================
 *
 * This function accepts slug and name
 * separately.
 *
 * So it works for both:
 *
 * category.slug, category.name
 *
 * and:
 *
 * subcategory.slug, subcategory.name
 * ========================================
 */

const findPopularCategoryConfig = (
  slug?: string,
  name?: string,
): PopularCategoryConfig | undefined => {
  const normalizedSlug =
    normalizeCategoryValue(slug);

  const normalizedName =
    normalizeCategoryValue(name);

  return popularCategoryConfigs.find(
    (config) =>
      config.aliases.some(
        (alias) => {
          const normalizedAlias =
            normalizeCategoryValue(alias);

          return (
            normalizedSlug === normalizedAlias ||
            normalizedName === normalizedAlias
          );
        },
      ),
  );
};

/*
 * ========================================
 * COMPONENT
 * ========================================
 */

const ShopByRoom = () => {
  const navigate = useNavigate();

  const [
    showAllRooms,
    setShowAllRooms,
  ] = useState(false);

  const [
    categories,
    setCategories,
  ] = useState<PopularCategory[]>([]);

  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(true);

  /*
   * ========================================
   * FETCH POPULAR CATEGORIES
   * ========================================
   */

  useEffect(() => {
    let cancelled = false;

    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);

        const backendCategories =
          await getCategories();

        if (cancelled) {
          return;
        }

        const foundCategories = new Map<
          string,
          PopularCategory
        >();

        backendCategories.forEach(
          (category: BackendCategory) => {
            /*
             * ========================================
             * CHECK MAIN CATEGORY
             * ========================================
             */

            const categoryConfig =
              findPopularCategoryConfig(
                category.slug,
                category.name,
              );

            if (
              categoryConfig &&
              !foundCategories.has(
                categoryConfig.name,
              )
            ) {
              foundCategories.set(
                categoryConfig.name,
                {
                  _id: category._id,
                  name: categoryConfig.name,
                  slug: category.slug,
                  image: categoryConfig.image,
                },
              );
            }

            /*
             * ========================================
             * CHECK SUBCATEGORIES
             * ========================================
             *
             * This is useful when the backend has
             * some of our popular categories stored
             * as subcategories.
             */

            const subcategories =
              (
                category as BackendCategory & {
                  subcategories?: CategoryItem[];
                }
              ).subcategories ?? [];

            subcategories.forEach(
              (subcategory) => {
                if (
                  !subcategory._id ||
                  !subcategory.slug ||
                  !subcategory.name
                ) {
                  return;
                }

                const subcategoryConfig =
                  findPopularCategoryConfig(
                    subcategory.slug,
                    subcategory.name,
                  );

                if (!subcategoryConfig) {
                  return;
                }

                if (
                  foundCategories.has(
                    subcategoryConfig.name,
                  )
                ) {
                  return;
                }

                foundCategories.set(
                  subcategoryConfig.name,
                  {
                    _id: subcategory._id,
                    name:
                      subcategoryConfig.name,
                    slug: subcategory.slug,
                    image:
                      subcategoryConfig.image,
                  },
                );
              },
            );
          },
        );

        /*
         * ========================================
         * KEEP FIXED ORDER
         * ========================================
         *
         * Sofas
         * Chairs
         * Beds
         * Tables
         * Storage
         * Lighting
         * Mirrors
         * Decorative Objects
         * Rugs
         */

        const orderedCategories =
          popularCategoryConfigs
            .map(
              (config) =>
                foundCategories.get(
                  config.name,
                ),
            )
            .filter(
              (
                category,
              ): category is PopularCategory =>
                Boolean(category),
            );

        if (!cancelled) {
          setCategories(
            orderedCategories,
          );
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to fetch categories:",
          error,
        );

        setCategories([]);
      } finally {
        if (!cancelled) {
          setCategoriesLoading(false);
        }
      }
    };

    void fetchCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * ========================================
   * VISIBLE ROOMS
   * ========================================
   */

  const visibleRooms = showAllRooms
    ? rooms
    : rooms.slice(0, 6);

  /*
   * ========================================
   * NAVIGATION
   * ========================================
   */

  const handleRoomClick = (
    room: Room,
  ) => {
    navigate(
      `/rooms/${encodeURIComponent(
        room.slug,
      )}`,
    );
  };

  const handleCategoryClick = (
    category: PopularCategory,
  ) => {
    navigate(
      `/products?category=${encodeURIComponent(
        category.slug,
      )}`,
    );
  };

  return (
    <>
      {/* =====================================
          DESKTOP / TABLET
      ===================================== */}

      <section className="hidden bg-[#FAF8F5] py-12 sm:py-14 lg:block">
        <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
          {/* SHOP BY ROOM HEADER */}

          <div className="mb-5 flex items-end justify-between">
            <h2
              className="
                font-serif
                text-[25px]
                font-medium
                leading-none
                tracking-tight
                text-[#1E1D1B]
                sm:text-[28px]
              "
            >
              Shop by Room
            </h2>

            {rooms.length > 6 && (
              <button
                type="button"
                onClick={() =>
                  setShowAllRooms(
                    (previous) =>
                      !previous,
                  )
                }
                className="
                  group
                  flex
                  items-center
                  gap-1.5
                  text-[11px]
                  font-medium
                  text-[#3A3733]
                  transition-colors
                  duration-300
                  hover:text-[#A47D3C]
                  sm:text-[12px]
                "
              >
                <span>
                  {showAllRooms
                    ? "View less"
                    : "View all rooms"}
                </span>

                <ArrowRight
                  size={13}
                  strokeWidth={1.8}
                  className={`
                    transition-transform
                    duration-300
                    ${
                      showAllRooms
                        ? "rotate-180"
                        : "group-hover:translate-x-1"
                    }
                  `}
                />
              </button>
            )}
          </div>

          {/* ROOM GRID */}

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
            {visibleRooms.map(
              (room) => (
                <button
                  key={room.slug}
                  type="button"
                  onClick={() =>
                    handleRoomClick(room)
                  }
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[9px]
                    border
                    border-[#E5DED4]
                    bg-white
                    text-left
                    transition-all
                    duration-500
                    ease-out
                    hover:-translate-y-1
                    hover:border-[#D8C5A8]
                    hover:shadow-[0_14px_35px_rgba(58,46,34,0.10)]
                  "
                >
                  <div
                    className="
                      relative
                      aspect-[0.86]
                      overflow-hidden
                      bg-[#F0ECE6]
                    "
                  >
                    <img
                      src={room.image}
                      alt={room.name}
                      loading="lazy"
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        ease-out
                        group-hover:scale-[1.055]
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

                    <span
                      className="
                        absolute
                        bottom-2.5
                        right-2.5
                        flex
                        h-7
                        w-7
                        translate-y-2
                        items-center
                        justify-center
                        rounded-full
                        bg-white/95
                        text-[#292521]
                        opacity-0
                        shadow-[0_4px_15px_rgba(0,0,0,0.15)]
                        backdrop-blur-sm
                        transition-all
                        duration-300
                        group-hover:translate-y-0
                        group-hover:opacity-100
                      "
                    >
                      <ArrowRight
                        size={13}
                        strokeWidth={1.8}
                      />
                    </span>
                  </div>

                  <div className="px-3 py-3">
                    <h3
                      className="
                        text-[11px]
                        font-semibold
                        leading-tight
                        text-[#282623]
                        sm:text-[12px]
                        md:text-[13px]
                      "
                    >
                      {room.name}
                    </h3>

                    <p
                      className="
                        mt-1
                        text-[9px]
                        font-medium
                        tracking-[0.01em]
                        text-[#888178]
                        sm:text-[10px]
                      "
                    >
                      Explore collection
                    </p>
                  </div>

                  <span
                    className="
                      absolute
                      bottom-0
                      left-0
                      h-0.5
                      w-0
                      bg-[#C49A5A]
                      transition-all
                      duration-500
                      group-hover:w-full
                    "
                  />
                </button>
              ),
            )}
          </div>
        </div>

        {/* =====================================
            POPULAR CATEGORIES
        ===================================== */}

        <div
          className="
            mx-auto
            mt-12
            max-w-350
            px-4
            sm:mt-14
            sm:px-6
            lg:px-8
          "
        >
          <div className="mb-5">
            <h2
              className="
                font-serif
                text-[25px]
                font-medium
                leading-none
                tracking-tight
                text-[#1E1D1B]
                sm:text-[28px]
              "
            >
              Popular Categories
            </h2>
          </div>

          {categoriesLoading && (
            <div
              className="
                grid
                grid-cols-2
                gap-2.5
                sm:grid-cols-4
                lg:grid-cols-5
                xl:grid-cols-9
                lg:gap-3
                xl:gap-4
              "
            >
              {Array.from(
                { length: 9 },
                (_, index) => (
                  <div
                    key={index}
                    className="
                      h-29.5
                      animate-pulse
                      rounded-[9px]
                      border
                      border-[#E5DED4]
                      bg-[#F1ECE5]
                      sm:h-32
                    "
                  />
                ),
              )}
            </div>
          )}

          {!categoriesLoading &&
            categories.length > 0 && (
              <div
                className="
                  grid
                  grid-cols-2
                  gap-2.5
                  sm:grid-cols-3
                  md:grid-cols-5
                  lg:grid-cols-5
                  xl:grid-cols-9
                  lg:gap-3
                  xl:gap-4
                "
              >
                {categories.map(
                  (category) => (
                    <button
                      key={category._id}
                      type="button"
                      onClick={() =>
                        handleCategoryClick(
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
                        ease-out
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
                          loading="lazy"
                          className="
                            h-full
                            w-full
                            object-contain
                            px-2
                            transition-transform
                            duration-700
                            ease-out
                            group-hover:scale-[1.08]
                          "
                        />
                      </div>

                      <span
                        className="
                          relative
                          z-10
                          max-w-[90%]
                          truncate
                          text-center
                          text-[10px]
                          font-medium
                          tracking-[0.01em]
                          text-[#302D29]
                          transition-colors
                          duration-300
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
            )}

          {!categoriesLoading &&
            categories.length === 0 && (
              <div
                className="
                  flex
                  min-h-32
                  items-center
                  justify-center
                  rounded-[9px]
                  border
                  border-dashed
                  border-[#DED5CA]
                  bg-[#F7F2EA]
                  px-4
                  text-center
                "
              >
                <p
                  className="
                    text-[11px]
                    text-[#887D70]
                  "
                >
                  No matching popular categories
                  available right now.
                </p>
              </div>
            )}
        </div>
      </section>

      {/* =====================================
          MOBILE
      ===================================== */}

      <section className="bg-[#FAF8F5] px-4 py-8 lg:hidden">
        {/* MOBILE ROOMS */}

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2
              className="
                font-serif
                text-[18px]
                font-medium
                leading-none
                tracking-[-0.02em]
                text-[#1E1D1B]
              "
            >
              Shop by Room
            </h2>

            <span
              className="
                text-[7px]
                font-medium
                uppercase
                tracking-[0.16em]
                text-[#A3988B]
              "
            >
              Curated spaces
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
            {rooms.map((room) => (
              <button
                key={room.slug}
                type="button"
                onClick={() =>
                  handleRoomClick(room)
                }
                className="
                  group
                  w-29
                  min-w-29
                  snap-start
                  overflow-hidden
                  rounded-[10px]
                  border
                  border-[#E4DCD1]
                  bg-white
                  text-left
                  shadow-[0_3px_14px_rgba(58,46,34,0.045)]
                  transition-all
                  duration-300
                  active:scale-[0.98]
                "
              >
                <div
                  className="
                    relative
                    h-27
                    overflow-hidden
                    bg-[#F0ECE6]
                  "
                >
                  <img
                    src={room.image}
                    alt={room.name}
                    loading="lazy"
                    className="
                      h-full
                      w-full
                      object-cover
                    "
                  />
                </div>

                <div className="px-2.5 py-2.5">
                  <h3
                    className="
                      truncate
                      text-[10px]
                      font-semibold
                      text-[#282623]
                    "
                  >
                    {room.name}
                  </h3>

                  <p
                    className="
                      mt-1
                      text-[8px]
                      font-medium
                      text-[#888178]
                    "
                  >
                    Explore collection
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <span
              className="
                text-[7px]
                font-medium
                tracking-[0.12em]
                text-[#A0988D]
              "
            >
              SWIPE TO EXPLORE
            </span>

            <ArrowRight
              size={9}
              strokeWidth={1.5}
              className="text-[#B7894A]"
            />
          </div>
        </div>

        {/* MOBILE CATEGORIES */}

        <div className="mt-9">
          <div className="mb-4 flex items-center justify-between">
            <h2
              className="
                font-serif
                text-[18px]
                font-medium
                leading-none
                text-[#1E1D1B]
              "
            >
              Popular Categories
            </h2>

            <span
              className="
                text-[7px]
                font-medium
                uppercase
                tracking-[0.16em]
                text-[#A3988B]
              "
            >
              Everyday essentials
            </span>
          </div>

          {categoriesLoading && (
            <div
              className="
                -mx-4
                flex
                gap-2
                overflow-hidden
                px-4
              "
            >
              {Array.from(
                { length: 4 },
                (_, index) => (
                  <div
                    key={index}
                    className="
                      h-22
                      w-20.5
                      min-w-20.5
                      animate-pulse
                      rounded-[10px]
                      border
                      border-[#E5DED4]
                      bg-[#F1ECE5]
                    "
                  />
                ),
              )}
            </div>
          )}

          {!categoriesLoading &&
            categories.length > 0 && (
              <>
                <div
                  className="
                    -mx-4
                    flex
                    gap-2
                    overflow-x-auto
                    px-4
                    pb-2
                    scrollbar-none
                    snap-x
                    snap-mandatory
                  "
                >
                  {categories.map(
                    (category) => (
                      <button
                        key={category._id}
                        type="button"
                        onClick={() =>
                          handleCategoryClick(
                            category,
                          )
                        }
                        className="
                          group
                          relative
                          flex
                          h-22
                          w-20.5
                          min-w-20.5
                          snap-start
                          flex-col
                          items-center
                          justify-between
                          overflow-hidden
                          rounded-[10px]
                          border
                          border-[#E5DED4]
                          bg-[#F9F6F1]
                          px-2
                          py-2.5
                          shadow-[0_2px_10px_rgba(58,46,34,0.025)]
                          transition-all
                          duration-300
                          active:scale-[0.97]
                        "
                      >
                        <div
                          className="
                            relative
                            flex
                            h-13.75
                            w-full
                            items-center
                            justify-center
                            overflow-hidden
                          "
                        >
                          <img
                            src={category.image}
                            alt={category.name}
                            loading="lazy"
                            className="
                              h-full
                              w-full
                              object-contain
                            "
                          />
                        </div>

                        <span
                          className="
                            relative
                            max-w-full
                            truncate
                            text-center
                            text-[8px]
                            font-medium
                            text-[#302D29]
                          "
                        >
                          {category.name}
                        </span>
                      </button>
                    ),
                  )}
                </div>

                <div className="mt-1.5 flex items-center justify-end gap-1.5">
                  <span
                    className="
                      text-[7px]
                      font-medium
                      tracking-[0.12em]
                      text-[#A0988D]
                    "
                  >
                    SWIPE TO EXPLORE
                  </span>

                  <ArrowRight
                    size={9}
                    strokeWidth={1.5}
                    className="text-[#B7894A]"
                  />
                </div>
              </>
            )}

          {!categoriesLoading &&
            categories.length === 0 && (
              <div
                className="
                  rounded-[10px]
                  border
                  border-dashed
                  border-[#DED5CA]
                  bg-[#F7F2EA]
                  px-4
                  py-6
                  text-center
                "
              >
                <p
                  className="
                    text-[10px]
                    text-[#887D70]
                  "
                >
                  No matching popular categories
                  available right now.
                </p>
              </div>
            )}
        </div>
      </section>
    </>
  );
};

export default ShopByRoom;