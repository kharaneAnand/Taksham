import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { ArrowRight } from "lucide-react";

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

import wardrobes from "../../assets/images/categories/wardrobes.png";
import dressers from "../../assets/images/categories/Dressers.png";
import sideTable from "../../assets/images/categories/sidetable.png";
import mirrors from "../../assets/images/categories/mirrors.png";
import curtains from "../../assets/images/categories/curtains.png";
import plants from "../../assets/images/categories/organizers.png";
import shelves from "../../assets/images/categories/shalves.png";
import organizers from "../../assets/images/categories/organizers.png";

/*
 * ========================================
 * Room Type
 * ========================================
 */

interface Room {
  name: string;
  slug: string;
  image: string;
}

/*
 * ========================================
 * Category Type
 * ========================================
 */

interface Category {
  name: string;
  slug: string;
  image: string;
}

/*
 * ========================================
 * Rooms
 * ========================================
 *
 * IMPORTANT:
 * The slug is the canonical value used
 * throughout the application.
 *
 * Example:
 *
 * Living Room
 *      ↓
 * living-room
 *
 * We NEVER generate the slug from the
 * display name at runtime.
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
 * Categories
 * ========================================
 */

const categories: Category[] = [
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

  {
    name: "Wardrobes",
    slug: "wardrobes",
    image: wardrobes,
  },

  {
    name: "Dressers",
    slug: "dressers",
    image: dressers,
  },

  {
    name: "Side Tables",
    slug: "side-tables",
    image: sideTable,
  },

  {
    name: "Mirrors",
    slug: "mirrors",
    image: mirrors,
  },

  {
    name: "Curtains",
    slug: "curtains",
    image: curtains,
  },

  {
    name: "Plants",
    slug: "plants",
    image: plants,
  },

  {
    name: "Shelves",
    slug: "shelves",
    image: shelves,
  },

  {
    name: "Organizers",
    slug: "organizers",
    image: organizers,
  },
];

/*
 * ========================================
 * Component
 * ========================================
 */

const ShopByRoom = () => {
  const navigate = useNavigate();

  const [showAllRooms, setShowAllRooms] =
    useState(false);

  const [
    showAllCategories,
    setShowAllCategories,
  ] = useState(false);

  /*
   * ----------------------------------------
   * Visible Items
   * ----------------------------------------
   */

  const visibleRooms = showAllRooms
    ? rooms
    : rooms.slice(0, 6);

  const visibleCategories =
    showAllCategories
      ? categories
      : categories.slice(0, 8);

  /*
   * ========================================
   * Navigation
   * ========================================
   */

  const handleRoomClick = (
    room: Room,
  ) => {
    /*
     * IMPORTANT:
     *
     * Do NOT navigate directly to:
     *
     * /products?room=living room
     *
     * The room page owns the room filtering
     * flow.
     *
     * We first go to:
     *
     * /rooms/living-room
     *
     * RoomDetails then fetches products using
     * the canonical room slug.
     */

    navigate(`/rooms/${room.slug}`);
  };

  const handleCategoryClick = (
    category: Category,
  ) => {
    /*
     * Categories go directly to the
     * Products page.
     *
     * Example:
     *
     * Sofas
     *   ↓
     * /products?category=sofas
     */

    navigate(
      `/products?category=${encodeURIComponent(
        category.slug,
      )}`,
    );
  };

  return (
    <>
      {/* =====================================================
          DESKTOP / TABLET
      ===================================================== */}

      <section className="hidden bg-[#FAF8F5] py-12 sm:py-14 lg:block">
        <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8">

          {/* =================================================
              SHOP BY ROOM HEADER
          ================================================= */}

          <div className="mb-5 flex items-end justify-between">
            <div>
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
            </div>

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
          </div>

          {/* =================================================
              ROOM GRID
          ================================================= */}

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
                    handleRoomClick(
                      room,
                    )
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

        {/* =====================================================
            POPULAR CATEGORIES
        ===================================================== */}

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
              Popular Categories
            </h2>

            <button
              type="button"
              onClick={() =>
                setShowAllCategories(
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
                {showAllCategories
                  ? "View less"
                  : "View all categories"}
              </span>

              <ArrowRight
                size={13}
                strokeWidth={1.8}
                className={`
                  transition-transform
                  duration-300
                  ${
                    showAllCategories
                      ? "rotate-180"
                      : "group-hover:translate-x-1"
                  }
                `}
              />
            </button>
          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-2.5
              sm:grid-cols-4
              lg:grid-cols-8
              lg:gap-3
              xl:gap-4
            "
          >
            {visibleCategories.map(
              (category) => (
                <button
                  key={category.slug}
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
        </div>
      </section>

      {/* =====================================================
          MOBILE
      ===================================================== */}

      <section className="bg-[#FAF8F5] px-4 py-8 lg:hidden">

        {/* ===================================================
            MOBILE SHOP BY ROOM
        =================================================== */}

        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
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
            </div>

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
                  handleRoomClick(
                    room,
                  )
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
                      transition-transform
                      duration-500
                      ease-out
                      group-active:scale-[1.04]
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
                      pointer-events-none
                      absolute
                      bottom-2
                      left-2
                      h-0.5
                      w-5
                      rounded-full
                      bg-[#B7894A]
                    "
                  />
                </div>

                <div className="px-2.5 py-2.5">
                  <h3
                    className="
                      truncate
                      text-[10px]
                      font-semibold
                      leading-tight
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

        {/* ===================================================
            MOBILE CATEGORIES
        =================================================== */}

        <div className="mt-9">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
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
            </div>

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
                  key={category.slug}
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
                  <span
                    className="
                      pointer-events-none
                      absolute
                      -right-5
                      -top-5
                      h-12
                      w-12
                      rounded-full
                      bg-[#D9B36A]/10
                      blur-xl
                    "
                  />

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
                        transition-transform
                        duration-500
                        ease-out
                        group-active:scale-[1.06]
                      "
                    />
                  </div>

                  <span
                    className="
                      relative
                      max-w-full
                      truncate
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
        </div>
      </section>
    </>
  );
};

export default ShopByRoom;