import {
  ArrowRight,
  BookOpen,
  Lightbulb,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import livingRoom from "../../assets/images/rooms/living-room.png";
import bedroom from "../../assets/images/rooms/bedroom.png";
import diningRoom from "../../assets/images/rooms/diningroom.png";
import homeOffice from "../../assets/images/rooms/office.png";
import study from "../../assets/images/rooms/Study.png";
import balcony from "../../assets/images/rooms/Balcony.png";
import entertainment from "../../assets/images/rooms/Entertainment.png"

import sofa from "../../assets/images/categories/sofa.png";
import lighting from "../../assets/images/categories/Lighting.png";
import decor from "../../assets/images/categories/Dacore.png";

interface InspirationStory {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  category: string;
  route: string;
}

const featuredStories: InspirationStory[] = [
  {
    id: "living-room",
    eyebrow: "LIVING ROOM",
    title: "How to create a living room that feels effortlessly warm.",
    description:
      "A thoughtful mix of proportions, textures and natural tones can transform the heart of your home into a space that feels both refined and inviting.",
    image: livingRoom,
    category: "Living",
    route: "/rooms/living-room",
  },
  {
    id: "bedroom",
    eyebrow: "BEDROOM",     
    title: "Design a bedroom that feels like a retreat.",     
    description:"Soft lighting, balanced forms and calming materials come together to create a room made for slowing down.",
    image: bedroom,     
    category: "Bedroom",     
    route: "/rooms/bedroom",   
  },
  {
  id: "entertainment",
  eyebrow: "ENTERTAINMENT",
  title: "Design an entertainment space made for unforgettable moments.",
  description:
    "Comfortable seating, immersive lighting and thoughtful details come together to create a space made for relaxing, connecting and enjoying every moment.",
  image: entertainment,
  category: "Entertainment",
  route: "/rooms/entertainment",
},
   {
    id: "dining",
    eyebrow: "DINING",
    title: "The art of gathering beautifully.",
    description:
      "Discover simple ways to make your dining space feel more intimate, comfortable and ready for everyday moments.",
    image: diningRoom,
    category: "Dining",
    route: "/rooms/dining-room",
  },
];

/*
 * ========================================
 * DESIGN GUIDES
 * ========================================
 */

const designGuides = [
  {
    id: "sofa-guide",
    eyebrow: "BUYING GUIDE",
    title: "Finding the right sofa for your space",
    description:
      "Understand proportions, comfort and placement before choosing the centrepiece of your living room.",
    image: sofa,
    route: "/products?category=sofas",
  },
  {
    id: "lighting-guide",
    eyebrow: "DESIGN GUIDE",
    title: "Lighting that changes the mood",
    description:
      "Layer ambient, task and accent lighting to give every room a softer, more considered atmosphere.",
    image: lighting,
    route: "/products?category=lighting",
  },
  {
    id: "decor-guide",
    eyebrow: "STYLE GUIDE",
    title: "The details that make a space yours",
    description:
      "Small decorative choices can add personality without overwhelming the architecture of a room.",
    image: decor,
    route: "/products?category=decor",
  },
];

/*
 * ========================================
 * ROOM INSPIRATION
 * ========================================
 */

const roomInspiration = [
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
    image: study,
  },
  {
    name: "Balcony",
    slug: "balcony",
    image: balcony,
  },
];

/*
 * ========================================
 * COMPONENT
 * ========================================
 */

const Ideas = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#302B25]">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden  border-b border-[#E5DDD3] bg-[#F4EEE6]">
        {/* Decorative glow */}

        <div
          className="
            pointer-events-none
            absolute
            -right-32
            -top-32
            h-96
            w-96
            rounded-full
            bg-[#D8C09D]/20
            blur-[100px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-40
            -left-32
            h-96
            w-96
            rounded-full
            bg-[#E4D3B9]/20
            blur-[100px]
          "
        />

        <div
          className="
            relative
            mx-auto
            max-w-375
            px-5
            pb-16
            pt-7
            sm:px-8
            sm:pb-20
            sm:pt-9
            lg:px-12
            lg:pb-24
            lg:pt-10
            xl:px-16
          "
        >
          {/* Breadcrumb */}

          <button
            type="button"
            onClick={() => navigate("/")}
            className="
              group
              flex
              items-center
              gap-2
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#8B8074]
              transition-colors
              duration-300
              hover:text-[#9A7138]
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

            Ideas & Inspiration
          </button>

          {/* Hero content */}

          <div
            className="
              mt-12
              grid
              gap-9
              lg:mt-16
              lg:grid-cols-[1fr_0.62fr]
              lg:items-end
              lg:gap-20
            "
          >
            <div>
              <div className="flex items-center gap-2">
                <BookOpen
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
                    text-[#A4773E]
                  "
                >
                  The Taksham Journal
                </span>
              </div>

              <h1
                className="
                  mt-4
                  max-w-225
                  font-serif
                  text-[47px]
                  font-medium
                  leading-[0.93]
                  tracking-[-0.055em]
                  text-[#29241F]
                  sm:text-[64px]
                  lg:text-[82px]
                  xl:text-[96px]
                "
              >
                Ideas for living
                <br />
                beautifully
                <span className="text-[#A4773E]">.</span>
              </h1>
            </div>

            <div className="lg:pb-1">
              <p
                className="
                  max-w-xl
                  text-[12px]
                  leading-6
                  text-[#756B60]
                  sm:text-[14px]
                  sm:leading-7
                "
              >
                Inspiration, thoughtful guides and
                simple ideas to help you create spaces
                that feel personal, comfortable and
                beautifully considered.
              </p>

              <div className="mt-6 flex items-center gap-2">
                <span className="h-px w-8 bg-[#B89A70]" />

                <span
                  className="
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[0.2em]
                    text-[#8D8174]
                  "
                >
                  Design • Living • Inspiration
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED STORY
      ===================================================== */}

      <section
        className="
          mx-auto
          max-w-375
          px-5
          py-14
          sm:px-8
          sm:py-18
          lg:px-12
          lg:py-24
          xl:px-16
        "
      >
        <div className="mb-9 sm:mb-12">
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.3em]
              text-[#A4773E]
            "
          >
            Featured inspiration
          </p>

          <h2
            className="
              mt-2.5
              font-serif
              text-[30px]
              leading-none
              tracking-[-0.04em]
              text-[#302B25]
              sm:text-[40px]
            "
          >
            Stories worth bringing home
          </h2>
        </div>

        <article
          className="
            overflow-hidden
            rounded-3xl
            border
            border-[#E1D8CD]
            bg-[#F1ECE4]
            shadow-[0_15px_45px_rgba(55,43,31,0.055)]
          "
        >
          <div className="grid lg:grid-cols-[1.12fr_0.88fr]">
            {/* Image */}

            <div className="relative aspect-[1.15] overflow-hidden lg:aspect-auto lg:min-h-133">
              <img
                src={featuredStories[0].image}
                alt={featuredStories[0].title}
                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  hover:scale-[1.025]
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-linear-to-t
                  from-black/25
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
                  border-white/40
                  bg-black/10
                  px-3
                  py-1.5
                  text-[7px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-white
                  backdrop-blur-md
                "
              >
                Featured
              </span>
            </div>

            {/* Content */}

            <div
              className="
                flex
                flex-col
                justify-center
                px-6
                py-10
                sm:px-10
                sm:py-14
                lg:px-14
                xl:px-18
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
                {featuredStories[0].eyebrow}
              </p>

              <h3
                className="
                  mt-4
                  max-w-xl
                  font-serif
                  text-[34px]
                  leading-[1.02]
                  tracking-[-0.045em]
                  text-[#302B25]
                  sm:text-[44px]
                "
              >
                {featuredStories[0].title}
              </h3>

              <p
                className="
                  mt-5
                  max-w-lg
                  text-[11px]
                  leading-6
                  text-[#776D62]
                  sm:text-[12px]
                "
              >
                {featuredStories[0].description}
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    featuredStories[0].route,
                  )
                }
                className="
                  group
                  mt-7
                  flex
                  w-fit
                  items-center
                  gap-2.5
                  rounded-xl
                  bg-[#8F6B3F]
                  px-5
                  py-3.5
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-white
                  shadow-[0_9px_22px_rgba(143,107,63,0.16)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#795832]
                "
              >
                Explore the room

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
          </div>
        </article>
      </section>

      {/* =====================================================
          MORE STORIES
      ===================================================== */}

      <section className="border-y border-[#E5DDD4] bg-[#F7F2EB]">
        <div
          className="
            mx-auto
            max-w-375
            px-5
            py-14
            sm:px-8
            sm:py-18
            lg:px-12
            lg:py-22
            xl:px-16
          "
        >
          <div
            className="
              mb-9
              flex
              items-end
              justify-between
              sm:mb-12
            "
          >
            <div>
              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  text-[#A4773E]
                "
              >
                More inspiration
              </p>

              <h2
                className="
                  mt-2.5
                  font-serif
                  text-[30px]
                  leading-none
                  tracking-[-0.04em]
                  text-[#302B25]
                  sm:text-[40px]
                "
              >
                Ideas for every room
              </h2>
            </div>
          </div>

          <div
            className="
              grid
              gap-5
              md:grid-cols-2
              lg:grid-cols-3
            "
          >
            {featuredStories.slice(1).map(
              (story) => (
                <article
                  key={story.id}
                  className="
                    group
                    overflow-hidden
                    rounded-[20px]
                    border
                    border-[#E2D9CE]
                    bg-[#FBF8F3]
                    shadow-[0_10px_30px_rgba(55,43,31,0.035)]
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        story.route,
                      )
                    }
                    className="block w-full text-left"
                  >
                    <div className="relative aspect-[1.2] overflow-hidden">
                      <img
                        src={story.image}
                        alt={story.title}
                        loading="lazy"
                        className="
                          h-full
                          w-full
                          object-cover
                          transition-transform
                          duration-700
                          group-hover:scale-[1.045]
                        "
                      />

                      <div
                        className="
                          absolute
                          inset-0
                          bg-linear-to-t
                          from-black/30
                          via-transparent
                          to-transparent
                        "
                      />

                      <span
                        className="
                          absolute
                          left-4
                          top-4
                          rounded-full
                          border
                          border-white/35
                          bg-black/10
                          px-3
                          py-1.5
                          text-[7px]
                          font-semibold
                          uppercase
                          tracking-[0.16em]
                          text-white
                          backdrop-blur-md
                        "
                      >
                        {story.category}
                      </span>
                    </div>

                    <div className="p-5 sm:p-6">
                      <p
                        className="
                          text-[7px]
                          font-semibold
                          uppercase
                          tracking-[0.25em]
                          text-[#A4773E]
                        "
                      >
                        {story.eyebrow}
                      </p>

                      <h3
                        className="
                          mt-2.5
                          font-serif
                          text-[25px]
                          leading-[1.02]
                          tracking-[-0.035em]
                          text-[#302B25]
                        "
                      >
                        {story.title}
                      </h3>

                      <p
                        className="
                          mt-3
                          text-[10px]
                          leading-5
                          text-[#81776C]
                        "
                      >
                        {story.description}
                      </p>

                      <span
                        className="
                          mt-5
                          flex
                          items-center
                          gap-2
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-[0.15em]
                          text-[#76562F]
                        "
                      >
                        Read inspiration

                        <ArrowRight
                          size={11}
                          strokeWidth={1.5}
                          className="
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                          "
                        />
                      </span>
                    </div>
                  </button>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          ROOM INSPIRATION
      ===================================================== */}

      <section
        className="
          mx-auto
          max-w-375
          px-5
          py-14
          sm:px-8
          sm:py-18
          lg:px-12
          lg:py-22
          xl:px-16
        "
      >
        <div
          className="
            mb-9
            flex
            items-end
            justify-between
            sm:mb-12
          "
        >
          <div>
            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.3em]
                text-[#A4773E]
              "
            >
              Browse by space
            </p>

            <h2
              className="
                mt-2.5
                font-serif
                text-[30px]
                leading-none
                tracking-[-0.04em]
                text-[#302B25]
                sm:text-[40px]
              "
            >
              Find inspiration by room
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/rooms")
            }
            className="
              group
              hidden
              items-center
              gap-2
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.15em]
              text-[#76562F]
              sm:flex
            "
          >
            View all rooms

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

        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-3
            lg:grid-cols-6
            lg:gap-4
          "
        >
          {roomInspiration.map(
            (room) => (
              <button
                key={room.slug}
                type="button"
                onClick={() =>
                  navigate(
                    `/rooms/${room.slug}`,
                  )
                }
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-2xl
                  border
                  border-[#E1D8CD]
                  bg-[#F0EBE3]
                  text-left
                  transition-all
                  duration-400
                  hover:-translate-y-1
                  hover:shadow-[0_12px_30px_rgba(55,43,31,0.08)]
                "
              >
                <div className="relative aspect-[0.9] overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    loading="lazy"
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-600
                      group-hover:scale-[1.05]
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0
                      bg-linear-to-t
                      from-black/70
                      via-black/5
                      to-transparent
                    "
                  />

                  <div
                    className="
                      absolute
                      bottom-0
                      left-0
                      right-0
                      p-3.5
                      sm:p-4
                    "
                  >
                    <p
                      className="
                        text-[9px]
                        font-semibold
                        leading-4
                        text-white
                        sm:text-[10px]
                      "
                    >
                      {room.name}
                    </p>

                    <span
                      className="
                        mt-1
                        flex
                        items-center
                        gap-1
                        text-[6px]
                        font-medium
                        uppercase
                        tracking-[0.12em]
                        text-white/70
                      "
                    >
                      Explore

                      <ArrowRight
                        size={9}
                        strokeWidth={1.5}
                        className="
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                      />
                    </span>
                  </div>
                </div>
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/rooms")
          }
          className="
            group
            mt-6
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-[#CDBA9F]
            bg-white/60
            py-3
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.15em]
            text-[#76562F]
            transition-all
            duration-300
            hover:bg-white
            sm:hidden
          "
        >
          View all rooms

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
      </section>

      {/* =====================================================
          DESIGN GUIDES
      ===================================================== */}

      <section className="bg-[#F4EEE6]">
        <div
          className="
            mx-auto
            max-w-375
            px-5
            py-14
            sm:px-8
            sm:py-18
            lg:px-12
            lg:py-22
            xl:px-16
          "
        >
          <div className="mb-9 sm:mb-12">
            <div className="flex items-center gap-2">
              <Lightbulb
                size={13}
                strokeWidth={1.4}
                className="text-[#A4773E]"
              />

              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  text-[#A4773E]
                "
              >
                Design guides
              </p>
            </div>

            <h2
              className="
                mt-2.5
                font-serif
                text-[30px]
                leading-none
                tracking-[-0.04em]
                text-[#302B25]
                sm:text-[40px]
              "
            >
              A little help goes a long way
            </h2>
          </div>

          <div
            className="
              grid
              gap-5
              md:grid-cols-3
            "
          >
            {designGuides.map(
              (guide, index) => (
                <button
                  key={guide.id}
                  type="button"
                  onClick={() =>
                    navigate(
                      guide.route,
                    )
                  }
                  className="
                    group
                    overflow-hidden
                    rounded-[20px]
                    border
                    border-[#E0D6CA]
                    bg-[#FBF8F3]
                    text-left
                    transition-all
                    duration-500
                    hover:-translate-y-1
                    hover:border-[#CDB28B]
                    hover:shadow-[0_16px_35px_rgba(55,43,31,0.07)]
                  "
                >
                  <div className="relative aspect-[1.2] overflow-hidden bg-[#EEE8DF]">
                    <img
                      src={guide.image}
                      alt={guide.title}
                      loading="lazy"
                      className="
                        h-full
                        w-full
                        object-contain
                        p-8
                        transition-transform
                        duration-600
                        group-hover:scale-[1.05]
                      "
                    />

                    <span
                      className="
                        absolute
                        left-4
                        top-4
                        flex
                        h-7
                        min-w-7
                        items-center
                        justify-center
                        rounded-full
                        bg-[#F9F3EA]/90
                        px-2
                        text-[7px]
                        font-semibold
                        text-[#76562F]
                        shadow-sm
                      "
                    >
                      0{index + 1}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6">
                    <p
                      className="
                        text-[7px]
                        font-semibold
                        uppercase
                        tracking-[0.25em]
                        text-[#A4773E]
                      "
                    >
                      {guide.eyebrow}
                    </p>

                    <h3
                      className="
                        mt-2.5
                        font-serif
                        text-[25px]
                        leading-[1.02]
                        tracking-[-0.035em]
                        text-[#302B25]
                      "
                    >
                      {guide.title}
                    </h3>

                    <p
                      className="
                        mt-3
                        text-[10px]
                        leading-5
                        text-[#81776C]
                      "
                    >
                      {guide.description}
                    </p>

                    <span
                      className="
                        mt-5
                        flex
                        items-center
                        gap-2
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[0.15em]
                        text-[#76562F]
                      "
                    >
                      Explore guide

                      <ArrowRight
                        size={11}
                        strokeWidth={1.5}
                        className="
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                      />
                    </span>
                  </div>
                </button>
              ),
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          PHILOSOPHY
      ===================================================== */}

      <section
        className="
          border-t
          border-[#E5DDD4]
          bg-[#FAF8F5]
        "
      >
        <div
          className="
            mx-auto
            max-w-250
            px-5
            py-16
            text-center
            sm:px-8
            sm:py-20
            lg:py-24
          "
        >
          <Sparkles
            size={18}
            strokeWidth={1.2}
            className="mx-auto text-[#A4773E]"
          />

          <p
            className="
              mt-4
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.3em]
              text-[#A4773E]
            "
          >
            The Taksham approach
          </p>

          <h2
            className="
              mx-auto
              mt-4
              max-w-4xl
              font-serif
              text-[34px]
              leading-[1.04]
              tracking-[-0.045em]
              text-[#302B25]
              sm:text-[48px]
              lg:text-[58px]
            "
          >
            Good design is not about
            <br className="hidden sm:block" />
            filling a room. It's about
            <br className="hidden sm:block" />
            creating a feeling.
          </h2>

          <p
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-[11px]
              leading-6
              text-[#81776C]
              sm:text-[13px]
              sm:leading-7
            "
          >
            We believe the best spaces are
            thoughtful without feeling overly
            designed — comfortable enough for
            everyday life and beautiful enough to
            stay with you for years.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
            className="
              group
              mx-auto
              mt-7
              flex
              items-center
              gap-2
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
              active:scale-[0.98]
            "
          >
            Explore the collection

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

export default Ideas;