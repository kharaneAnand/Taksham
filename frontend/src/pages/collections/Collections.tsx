import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import livingRoom from "../../assets/images/rooms/living-room.png";
import bedroom from "../../assets/images/rooms/bedroom.png";
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

interface Collection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  route: string;
  type: "room" | "category";
}

const collections: Collection[] = [
  {
    id: "living",
    eyebrow: "01 / LIVING",
    title: "The Living Edit",
    description:
      "Warm, inviting pieces designed around conversations, comfort and everyday living.",
    image: livingRoom,
    route: "/rooms/living-room",
    type: "room",
  },
  {
    id: "bedroom",
    eyebrow: "02 / BEDROOM",
    title: "The Bedroom Edit",
    description:
      "Create a calm personal retreat with timeless forms and considered comfort.",
    image: bedroom,
    route: "/rooms/bedroom",
    type: "room",
  },
  {
    id: "dining",
    eyebrow: "03 / DINING",
    title: "The Dining Edit",
    description:
      "Pieces made for gathering, long conversations and beautifully shared moments.",
    image: diningRoom,
    route: "/rooms/dining-room",
    type: "room",
  },
  {
    id: "work",
    eyebrow: "04 / WORK & STUDY",
    title: "The Work Edit",
    description:
      "Thoughtful furniture for focused work, quiet reading and inspired thinking.",
    image: homeOffice,
    route: "/rooms/home-office",
    type: "room",
  },
  {
    id: "study",
    eyebrow: "05 / STUDY",
    title: "The Study Edit",
    description:
      "A refined balance of function and character for your personal corner.",
    image: Study,
    route: "/rooms/study-library",
    type: "room",
  },
  {
    id: "outdoor",
    eyebrow: "06 / OUTDOOR",
    title: "The Balcony Edit",
    description:
      "Turn overlooked corners into beautiful spaces made for slow mornings.",
    image: Balcony,
    route: "/rooms/balcony",
    type: "room",
  },
];

const categoryCollections = [
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

const Collections = () => {
  const navigate =
    useNavigate();

  const handleCollectionClick = (
    collection: Collection,
  ) => {
    navigate(collection.route);
  };

  const handleCategoryClick = (
    slug: string,
  ) => {
    navigate(
      `/products?category=${encodeURIComponent(
        slug,
      )}`,
    );
  };

  return (
    <main
      className="
        min-h-screen
        overflow-hidden
        bg-[#FAF8F5]
        text-[#302B25]
      "
    >
      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          border-b
          border-[#E4DCD2]
          bg-[#F4EEE6]
        "
      >
        {/* Ambient background details */}

        <div
          className="
            pointer-events-none
            absolute
            -right-44
            -top-44
            h-130
            w-130
            rounded-full
            bg-[#CBAE7D]/18
            blur-[120px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-56
            -left-40
            h-140
            w-140
            rounded-full
            bg-[#DCC6A5]/20
            blur-[120px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            right-[20%]
            top-[45%]
            h-32
            w-32
            rounded-full
            bg-white/30
            blur-[80px]
          "
        />

        <div
          className="
            relative
            mx-auto
            max-w-375
            px-5
            pb-14
            pt-6
            sm:px-8
            sm:pb-20
            sm:pt-9
            lg:px-12
            lg:pb-25
            lg:pt-10
            xl:px-16
          "
        >
          {/* Breadcrumb */}

          <button
            type="button"
            onClick={() =>
              navigate("/")
            }
            className="
              group
              flex
              items-center
              gap-2
              rounded-full
              border
              border-[#D9CDBD]
              bg-white/35
              px-3
              py-2
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#82766A]
              backdrop-blur-sm
              transition-all
              duration-300
              hover:border-[#B99A6B]
              hover:bg-white/60
              hover:text-[#8C6535]
            "
          >
            Home

            <ArrowRight
              size={10}
              strokeWidth={1.5}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-0.5
              "
            />

            Collections
          </button>

          {/* Hero content */}

          <div
            className="
              mt-12
              grid
              gap-10
              lg:mt-17
              lg:grid-cols-[1fr_0.62fr]
              lg:items-end
              lg:gap-20
            "
          >
            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#D7C6AD]
                  bg-white/35
                  px-3
                  py-2
                  backdrop-blur-sm
                "
              >
                <Sparkles
                  size={13}
                  strokeWidth={1.4}
                  className="text-[#A4773E]"
                />

                <span
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.3em]
                    text-[#967143]
                  "
                >
                  Curated for living
                </span>
              </div>

              <h1
                className="
                  mt-5
                  max-w-225
                  font-serif
                  text-[52px]
                  font-medium
                  leading-[0.88]
                  tracking-[-0.06em]
                  text-[#29241F]
                  sm:text-[72px]
                  lg:text-[92px]
                  xl:text-[108px]
                "
              >
                Collections
                <span className="text-[#A4773E]">
                  .
                </span>
              </h1>

              <div
                className="
                  mt-6
                  h-px
                  w-20
                  bg-[#B7894A]
                  sm:w-28
                "
              />
            </div>

            <div
              className="
                lg:pb-1
              "
            >
              <p
                className="
                  max-w-xl
                  text-[13px]
                  leading-6.5
                  text-[#756B60]
                  sm:text-[15px]
                  sm:leading-7.5
                "
              >
                Discover thoughtfully curated
                edits designed to bring warmth,
                character and timeless elegance
                into every corner of your home.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/products",
                  )
                }
                className="
                  group
                  mt-7
                  flex
                  items-center
                  gap-3
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.19em]
                  text-[#76562F]
                "
              >
                Explore all products

                <span
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#CBB89B]
                    bg-white/55
                    shadow-[0_6px_18px_rgba(70,52,33,0.06)]
                    backdrop-blur-sm
                    transition-all
                    duration-300
                    group-hover:border-[#A4773E]
                    group-hover:bg-[#A4773E]
                    group-hover:text-white
                    group-hover:shadow-[0_8px_20px_rgba(143,107,63,0.18)]
                  "
                >
                  <ArrowRight
                    size={12}
                    strokeWidth={1.5}
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-0.5
                    "
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED COLLECTIONS
      ===================================================== */}

      <section
        className="
          relative
          mx-auto
          max-w-375
          px-5
          py-15
          sm:px-8
          sm:py-20
          lg:px-12
          lg:py-25
          xl:px-16
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            left-0
            top-20
            h-48
            w-48
            rounded-full
            bg-[#E9DCC9]/25
            blur-[90px]
          "
        />

        {/* Section heading */}

        <div
          className="
            relative
            mb-9
            flex
            items-end
            justify-between
            sm:mb-12
          "
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-[#B7894A]" />

              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  text-[#A4773E]
                "
              >
                Explore our edits
              </p>
            </div>

            <h2
              className="
                mt-3
                font-serif
                text-[32px]
                leading-none
                tracking-[-0.045em]
                text-[#302B25]
                sm:text-[42px]
                lg:text-[46px]
              "
            >
              Made for your space
            </h2>
          </div>

          <span
            className="
              hidden
              rounded-full
              border
              border-[#DDD1C2]
              bg-[#F7F1E9]
              px-3
              py-2
              text-[8px]
              font-medium
              uppercase
              tracking-[0.18em]
              text-[#9A9186]
              sm:block
            "
          >
            {collections.length} curated edits
          </span>
        </div>

        {/* Collection grid */}

        <div
          className="
            relative
            grid
            gap-4
            sm:grid-cols-2
            sm:gap-5
            lg:grid-cols-3
            lg:gap-6
          "
        >
          {collections.map(
            (
              collection,
              index,
            ) => (
              <button
                key={
                  collection.id
                }
                type="button"
                onClick={() =>
                  handleCollectionClick(
                    collection,
                  )
                }
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-[22px]
                  border
                  border-[#E2D8CD]
                  bg-[#EEE7DE]
                  text-left
                  shadow-[0_14px_38px_rgba(55,43,31,0.055)]
                  transition-all
                  duration-500
                  hover:-translate-y-1.5
                  hover:border-[#CDB28B]
                  hover:shadow-[0_24px_55px_rgba(55,43,31,0.12)]
                  active:scale-[0.99]
                  ${
                    index === 0
                      ? "sm:row-span-2"
                      : ""
                  }
                `}
              >
                <div
                  className={`
                    relative
                    overflow-hidden
                    ${
                      index === 0
                        ? "aspect-[0.78] sm:h-full"
                        : "aspect-[1.05]"
                    }
                  `}
                >
                  <img
                    src={
                      collection.image
                    }
                    alt={
                      collection.title
                    }
                    loading={
                      index === 0
                        ? undefined
                        : "lazy"
                    }
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-900
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
                      from-[#18130F]/92
                      via-[#18130F]/20
                      to-transparent
                    "
                  />

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-x-0
                      top-0
                      h-32
                      bg-linear-to-b
                      from-black/18
                      to-transparent
                    "
                  />

                  {/* Number */}

                  <span
                    className="
                      absolute
                      left-4
                      top-4
                      flex
                      h-8
                      min-w-8
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/35
                      bg-black/15
                      px-2
                      text-[7px]
                      font-semibold
                      tracking-[0.08em]
                      text-white
                      shadow-sm
                      backdrop-blur-md
                      sm:left-5
                      sm:top-5
                    "
                  >
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  {/* Explore indicator */}

                  <span
                    className="
                      absolute
                      right-4
                      top-4
                      flex
                      h-9
                      w-9
                      translate-y-1
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/35
                      bg-white/10
                      text-white
                      opacity-0
                      backdrop-blur-md
                      transition-all
                      duration-400
                      group-hover:translate-y-0
                      group-hover:opacity-100
                      sm:right-5
                      sm:top-5
                    "
                  >
                    <ArrowRight
                      size={13}
                      strokeWidth={1.5}
                      className="
                        -rotate-45
                      "
                    />
                  </span>

                  {/* Content */}

                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      right-0
                      p-5
                      sm:p-6
                    "
                  >
                    <p
                      className="
                        text-[7px]
                        font-semibold
                        uppercase
                        tracking-[0.28em]
                        text-[#E5C895]
                        sm:text-[8px]
                      "
                    >
                      {
                        collection.eyebrow
                      }
                    </p>

                    <h3
                      className="
                        mt-2
                        font-serif
                        text-[28px]
                        leading-[0.96]
                        tracking-[-0.04em]
                        text-white
                        sm:text-[34px]
                      "
                    >
                      {
                        collection.title
                      }
                    </h3>

                    <p
                      className="
                        mt-2.5
                        max-w-sm
                        text-[9px]
                        leading-4.5
                        text-white/75
                        sm:text-[10px]
                        sm:leading-5
                      "
                    >
                      {
                        collection.description
                      }
                    </p>

                    <span
                      className="
                        mt-4
                        flex
                        items-center
                        gap-2
                        text-[7px]
                        font-semibold
                        uppercase
                        tracking-[0.15em]
                        text-white
                        sm:text-[8px]
                      "
                    >
                      Explore collection

                      <span
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-white/35
                          bg-white/10
                          backdrop-blur-md
                          transition-all
                          duration-300
                          group-hover:border-white
                          group-hover:bg-white
                          group-hover:text-[#6B4F2E]
                        "
                      >
                        <ArrowRight
                          size={11}
                          strokeWidth={1.5}
                          className="
                            transition-transform
                            duration-300
                            group-hover:translate-x-0.5
                          "
                        />
                      </span>
                    </span>
                  </div>
                </div>
              </button>
            ),
          )}
        </div>
      </section>

      {/* =====================================================
          CATEGORY EDIT
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          border-y
          border-[#E4DCD2]
          bg-[#F6F0E8]
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -right-20
            top-0
            h-80
            w-80
            rounded-full
            bg-[#DCC7A8]/20
            blur-[100px]
          "
        />

        <div
          className="
            relative
            mx-auto
            max-w-375
            px-5
            py-15
            sm:px-8
            sm:py-20
            lg:px-12
            lg:py-24
            xl:px-16
          "
        >
          {/* Heading */}

          <div
            className="
              mb-8
              flex
              items-end
              justify-between
              sm:mb-10
            "
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-[#B7894A]" />

                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.3em]
                    text-[#A4773E]
                  "
                >
                  Furniture edit
                </p>
              </div>

              <h2
                className="
                  mt-3
                  font-serif
                  text-[30px]
                  leading-none
                  tracking-[-0.045em]
                  text-[#302B25]
                  sm:text-[40px]
                  lg:text-[44px]
                "
              >
                Find your signature piece
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/products",
                )
              }
              className="
                group
                hidden
                items-center
                gap-2
                rounded-full
                border
                border-[#D4C3AA]
                bg-white/40
                px-4
                py-2.5
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-[#76562F]
                transition-all
                duration-300
                hover:border-[#B7894A]
                hover:bg-white
                sm:flex
              "
            >
              View all

              <ArrowRight
                size={12}
                strokeWidth={1.5}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </button>
          </div>

          {/* Categories */}

          <div
            className="
              grid
              grid-cols-2
              gap-3
              sm:grid-cols-4
              lg:grid-cols-8
              lg:gap-4
            "
          >
            {categoryCollections.map(
              (category) => (
                <button
                  key={
                    category.slug
                  }
                  type="button"
                  onClick={() =>
                    handleCategoryClick(
                      category.slug,
                    )
                  }
                  className="
                    group
                    relative
                    overflow-hidden
                    rounded-[17px]
                    border
                    border-[#E0D5C8]
                    bg-[#FBF8F3]
                    text-center
                    shadow-[0_8px_22px_rgba(55,43,31,0.035)]
                    transition-all
                    duration-400
                    hover:-translate-y-1
                    hover:border-[#CDB28B]
                    hover:bg-white
                    hover:shadow-[0_16px_35px_rgba(55,43,31,0.09)]
                    active:scale-[0.98]
                  "
                >
                  <div
                    className="
                      relative
                      flex
                      aspect-square
                      items-center
                      justify-center
                      overflow-hidden
                      bg-[#F1EBE3]
                    "
                  >
                    <div
                      className="
                        pointer-events-none
                        absolute
                        h-24
                        w-24
                        rounded-full
                        bg-[#D9C5A5]/25
                        blur-3xl
                        transition-transform
                        duration-500
                        group-hover:scale-125
                      "
                    />

                    <img
                      src={
                        category.image
                      }
                      alt={
                        category.name
                      }
                      loading="lazy"
                      className="
                        relative
                        h-full
                        w-full
                        object-contain
                        p-3
                        transition-transform
                        duration-600
                        ease-out
                        group-hover:scale-[1.09]
                      "
                    />

                    <span
                      className="
                        absolute
                        right-2
                        top-2
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-white/70
                        text-[#76562F]
                        opacity-0
                        shadow-sm
                        backdrop-blur-sm
                        transition-all
                        duration-300
                        group-hover:opacity-100
                      "
                    >
                      <ArrowRight
                        size={9}
                        strokeWidth={1.5}
                        className="-rotate-45"
                      />
                    </span>
                  </div>

                  <div
                    className="
                      px-2
                      py-3.5
                    "
                  >
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        text-[#3B352F]
                        sm:text-[11px]
                      "
                    >
                      {
                        category.name
                      }
                    </p>

                    <span
                      className="
                        mt-1
                        block
                        text-[7px]
                        uppercase
                        tracking-[0.12em]
                        text-[#A0988E]
                        transition-colors
                        duration-300
                        group-hover:text-[#A4773E]
                      "
                    >
                      Explore
                    </span>
                  </div>

                  <span
                    className="
                      absolute
                      bottom-0
                      left-1/2
                      h-0.5
                      w-0
                      -translate-x-1/2
                      bg-[#B7894A]
                      transition-all
                      duration-400
                      group-hover:w-10
                    "
                  />
                </button>
              ),
            )}
          </div>

          {/* Mobile view all */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/products",
              )
            }
            className="
              group
              mt-6
              flex
              w-full
              items-center
              justify-center
              gap-2.5
              rounded-xl
              border
              border-[#CDBA9F]
              bg-white/65
              py-3.5
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.15em]
              text-[#76562F]
              shadow-[0_7px_20px_rgba(55,43,31,0.04)]
              backdrop-blur-sm
              transition-all
              duration-300
              hover:border-[#B7894A]
              hover:bg-white
              sm:hidden
            "
          >
            View all products

            <ArrowRight
              size={12}
              strokeWidth={1.5}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </button>
        </div>
      </section>

      {/* =====================================================
          ENTERTAINMENT / LIFESTYLE FEATURE
      ===================================================== */}

      <section
        className="
          mx-auto
          max-w-375
          px-5
          py-15
          sm:px-8
          sm:py-20
          lg:px-12
          lg:py-25
          xl:px-16
        "
      >
        <div
          className="
            group
            relative
            overflow-hidden
            rounded-[26px]
            border
            border-[#DED4C8]
            bg-[#EEE7DE]
            shadow-[0_16px_45px_rgba(55,43,31,0.065)]
          "
        >
          <div
            className="
              grid
              lg:grid-cols-[1fr_1fr]
            "
          >
            {/* Image */}

            <div
              className="
                relative
                aspect-[1.15]
                overflow-hidden
                lg:aspect-auto
                lg:min-h-120
              "
            >
              <img
                src={Entertainment}
                alt="Entertainment room"
                loading="lazy"
                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-1000ms
                  ease-out
                  group-hover:scale-[1.035]
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-linear-to-r
                  from-black/10
                  via-transparent
                  to-transparent
                "
              />

              <span
                className="
                  absolute
                  left-5
                  top-5
                  rounded-full
                  border
                  border-white/35
                  bg-black/10
                  px-3
                  py-2
                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-white
                  backdrop-blur-md
                "
              >
                Lifestyle edit
              </span>
            </div>

            {/* Content */}

            <div
              className="
                relative
                flex
                flex-col
                justify-center
                overflow-hidden
                px-6
                py-11
                sm:px-10
                sm:py-15
                lg:px-14
                xl:px-20
              "
            >
              <div
                className="
                  pointer-events-none
                  absolute
                  -right-20
                  -top-20
                  h-52
                  w-52
                  rounded-full
                  bg-[#D6BE9A]/20
                  blur-[80px]
                "
              />

              <div className="relative">
                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.3em]
                    text-[#A4773E]
                  "
                >
                  The lifestyle edit
                </p>

                <h2
                  className="
                    mt-4
                    max-w-lg
                    font-serif
                    text-[36px]
                    leading-[0.96]
                    tracking-tighter
                    text-[#302B25]
                    sm:text-[48px]
                  "
                >
                  Spaces that bring
                  <br />
                  people together.
                </h2>

                <div
                  className="
                    mt-5
                    h-px
                    w-14
                    bg-[#B7894A]
                  "
                />

                <p
                  className="
                    mt-5
                    max-w-lg
                    text-[11px]
                    leading-5.5
                    text-[#776D62]
                    sm:text-[12px]
                    sm:leading-6
                  "
                >
                  From quiet corners to lively
                  evenings, discover pieces designed
                  to make every space feel considered,
                  comfortable and unmistakably yours.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      "/rooms/entertainment-room",
                    )
                  }
                  className="
                    group/button
                    mt-7
                    flex
                    w-fit
                    items-center
                    gap-3
                    rounded-xl
                    bg-[#8F6B3F]
                    px-5
                    py-3.5
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-white
                    shadow-[0_10px_24px_rgba(143,107,63,0.17)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#795832]
                    hover:shadow-[0_14px_30px_rgba(143,107,63,0.22)]
                    active:scale-[0.98]
                  "
                >
                  Explore the space

                  <ArrowRight
                    size={12}
                    strokeWidth={1.5}
                    className="
                      transition-transform
                      duration-300
                      group-hover/button:translate-x-1
                    "
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CLOSING EDITORIAL
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          border-t
          border-[#E4DCD2]
          bg-[#F4EEE6]
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-80
            w-80
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#DCC7A8]/20
            blur-[110px]
          "
        />

        <div
          className="
            relative
            mx-auto
            max-w-250
            px-5
            py-17
            text-center
            sm:px-8
            sm:py-22
            lg:py-26
          "
        >
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.3em]
              text-[#A4773E]
            "
          >
            The Taksham philosophy
          </p>

          <div
            className="
              mx-auto
              mt-4
              h-px
              w-12
              bg-[#B7894A]
            "
          />

          <h2
            className="
              mx-auto
              mt-5
              max-w-4xl
              font-serif
              text-[35px]
              leading-[1.02]
              tracking-tighter
              text-[#302B25]
              sm:text-[50px]
              lg:text-[60px]
            "
          >
            Beautiful spaces begin
            <br className="hidden sm:block" />
            with thoughtful choices.
          </h2>

          <p
            className="
              mx-auto
              mt-6
              max-w-2xl
              text-[11px]
              leading-6
              text-[#81776C]
              sm:text-[13px]
              sm:leading-7
            "
          >
            Explore furniture shaped by
            craftsmanship, contemporary design
            and the simple idea that the things
            around you should feel like they belong.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/products",
              )
            }
            className="
              group
              mx-auto
              mt-8
              flex
              items-center
              gap-3
              rounded-xl
              bg-[#8F6B3F]
              px-6
              py-3.5
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.15em]
              text-white
              shadow-[0_10px_25px_rgba(143,107,63,0.18)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#795832]
              hover:shadow-[0_14px_32px_rgba(143,107,63,0.23)]
              active:scale-[0.98]
            "
          >
            Explore products

            <ArrowRight
              size={12}
              strokeWidth={1.5}
              className="
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
            />
          </button>
        </div>
      </section>
    </main>
  );
};

export default Collections;