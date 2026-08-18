import {
  ArrowRight,
  Check,
  ExternalLink,
  Home,
  Layers3,
  Lightbulb,
  Palette,
  Ruler,
  Sofa,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import livingRoom from "../../assets/images/rooms/living-room.png";
import bedroom from "../../assets/images/rooms/bedroom.png";
import homeOffice from "../../assets/images/rooms/office.png";
import interiorConsultation from "../../assets/images/looks/interior-consultation.png";

const INTERIOR_WEBSITE =
  "https://arteffect.net/sitehome";

const services = [
  {
    icon: Home,
    title: "Residential Interiors",
    description:
      "Thoughtfully designed homes that balance your personality, comfort and everyday lifestyle.",
  },
  {
    icon: Layers3,
    title: "Commercial Interiors",
    description:
      "Functional, refined workspaces designed to support productivity and create a lasting impression.",
  },
  {
    icon: Palette,
    title: "Modular Kitchens",
    description:
      "Smart, ergonomic kitchen solutions designed around storage, movement and everyday use.",
  },
  {
    icon: Sofa,
    title: "Custom Furniture",
    description:
      "Bespoke furniture pieces created around your space, dimensions and design preferences.",
  },
  {
    icon: Lightbulb,
    title: "Ceiling & Lighting",
    description:
      "Architectural ceiling treatments and lighting details that add depth and atmosphere.",
  },
  {
    icon: Ruler,
    title: "Complete Execution",
    description:
      "Civil, electrical, painting and finishing work coordinated as one complete interior journey.",
  },
];

const process = [
  {
    number: "01",
    title: "Discover",
    description:
      "Understand your space, requirements, lifestyle and vision.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "Develop layouts, visual direction, materials and furniture concepts.",
  },
  {
    number: "03",
    title: "Execute",
    description:
      "Bring the approved design to life with coordinated execution.",
  },
  {
    number: "04",
    title: "Handover",
    description:
      "Complete the final checks and hand over a space ready to live in.",
  },
];

const InteriorServices = () => {
  const navigate = useNavigate();

  const openInteriorWebsite = () => {
    window.open(
      INTERIOR_WEBSITE,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#302B25]">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-[#E5DDD4] bg-[#F4EEE6]">
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
            pb-10
            pt-7
            sm:px-8
            sm:pb-14
            sm:pt-9
            lg:px-12
            lg:pb-18
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

            Interior Services
          </button>

          {/* =================================================
              HERO CONTENT + IMAGE
          ================================================= */}

          <div
            className="
              mt-10
              grid
              overflow-hidden
              rounded-[26px]
              border
              border-[#DCCFC0]
              bg-[#EDE3D6]
              lg:mt-12
              lg:grid-cols-[0.88fr_1.12fr]
            "
          >
            {/* =================================================
                LEFT — CONTENT
            ================================================= */}

            <div
              className="
                flex
                flex-col
                justify-center
                px-6
                py-10
                sm:px-10
                sm:py-14
                lg:px-12
                lg:py-16
                xl:px-16
              "
            >
              <div className="flex items-center gap-2">
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
                    text-[#A4773E]
                  "
                >
                  Interior design & execution
                </span>
              </div>

              <h1
                className="
                  mt-4
                  max-w-3xl
                  font-serif
                  text-[46px]
                  font-medium
                  leading-[0.94]
                  tracking-[-0.055em]
                  text-[#29241F]
                  sm:text-[60px]
                  lg:text-[68px]
                  xl:text-[78px]
                "
              >
                Your space,
                <br />
                thoughtfully
                <br />
                designed
                <span className="text-[#A4773E]">
                  .
                </span>
              </h1>

              <p
                className="
                  mt-5
                  max-w-lg
                  text-[11px]
                  leading-6
                  text-[#756B60]
                  sm:text-[12px]
                  sm:leading-6.5
                "
              >
                Looking beyond individual furniture
                pieces? Discover complete interior
                design and execution for spaces
                created around the way you live.
              </p>

              <button
                type="button"
                onClick={openInteriorWebsite}
                className="
                  group
                  mt-6
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
                  shadow-[0_10px_25px_rgba(143,107,63,0.18)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#795832]
                "
              >
                Explore Interior Services

                <ExternalLink
                  size={12}
                  strokeWidth={1.5}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                  "
                />
              </button>

              <div className="mt-6 flex items-center gap-2">
                <span className="h-px w-7 bg-[#B89A70]" />

                <span
                  className="
                    text-[7px]
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-[#8D8174]
                  "
                >
                  Design · Craft · Detail
                </span>
              </div>
            </div>

            {/* =================================================
                RIGHT — HERO IMAGE
            ================================================= */}

            <div
              className="
                group
                relative
                min-h-80
                overflow-hidden
                sm:min-h-108
                lg:min-h-143
              "
            >
              <img
                src={interiorConsultation}
                alt="Interior consultation"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-[1.025]
                "
              />

              {/* Image overlay */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-linear-to-r
                  from-[#302B25]/15
                  via-transparent
                  to-transparent
                "
              />

              {/* Image label */}

              <div
                className="
                  absolute
                  bottom-5
                  left-5
                  rounded-full
                  border
                  border-white/35
                  bg-black/10
                  px-3
                  py-1.5
                  backdrop-blur-md
                  sm:bottom-6
                  sm:left-6
                "
              >
                <span
                  className="
                    text-[7px]
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-white/90
                  "
                >
                  Interior consultation
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTRO VISUALS
      ===================================================== */}

      <section
        className="
          mx-auto
          max-w-375
          px-5
          py-12
          sm:px-8
          sm:py-16
          lg:px-12
          lg:py-20
          xl:px-16
        "
      >
        <div
          className="
            grid
            gap-4
            sm:grid-cols-2
            lg:grid-cols-2
          "
        >
          <div
            className="
              group
              relative
              overflow-hidden
              rounded-[22px]
              border
              border-[#E1D8CD]
              bg-[#EEE8DF]
            "
          >
            <img
              src={livingRoom}
              alt="Taksham living room interior"
              className="
                h-full
                min-h-90
                w-full
                object-cover
                transition-transform
                duration-700
                group-hover:scale-[1.025]
              "
            />

            <div
              className="
                absolute
                inset-0
                bg-linear-to-t
                from-black/65
                via-transparent
                to-transparent
              "
            />

            <div
              className="
                absolute
                bottom-0
                left-0
                right-0
                p-5
                sm:p-7
              "
            >
              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.28em]
                  text-[#E5C895]
                "
              >
                Complete spaces
              </p>

              <h2
                className="
                  mt-2
                  max-w-lg
                  font-serif
                  text-[30px]
                  leading-none
                  tracking-[-0.04em]
                  text-white
                  sm:text-[38px]
                "
              >
                From empty rooms to
                spaces that feel like home.
              </h2>
            </div>
          </div>

          <div
            className="
              grid
              gap-4
              sm:grid-cols-2
            "
          >
            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[22px]
                border
                border-[#E1D8CD]
                bg-[#EEE8DF]
              "
            >
              <img
                src={bedroom}
                alt="Bedroom interior"
                className="
                  h-full
                  min-h-65
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-[1.025]
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-linear-to-t
                  from-black/60
                  via-transparent
                  to-transparent
                "
              />

              <div className="absolute bottom-4 left-5">
                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.22em]
                    text-white/70
                  "
                >
                  Residential
                </p>

                <p
                  className="
                    mt-1
                    font-serif
                    text-[24px]
                    text-white
                  "
                >
                  Personal spaces
                </p>
              </div>
            </div>

            <div
              className="
                group
                relative
                overflow-hidden
                rounded-[22px]
                border
                border-[#E1D8CD]
                bg-[#EEE8DF]
              "
            >
              <img
                src={homeOffice}
                alt="Home office interior"
                className="
                  h-full
                  min-h-65
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-[1.025]
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-linear-to-t
                  from-black/60
                  via-transparent
                  to-transparent
                "
              />

              <div className="absolute bottom-4 left-5">
                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.22em]
                    text-white/70
                  "
                >
                  Workspaces
                </p>

                <p
                  className="
                    mt-1
                    font-serif
                    text-[24px]
                    text-white
                  "
                >
                  Designed to work
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICES
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
              What we can help with
            </p>

            <h2
              className="
                mt-2.5
                max-w-2xl
                font-serif
                text-[31px]
                leading-none
                tracking-[-0.04em]
                text-[#302B25]
                sm:text-[42px]
              "
            >
              Everything your space needs.
            </h2>

            <p
              className="
                mt-4
                max-w-2xl
                text-[11px]
                leading-5.5
                text-[#81776C]
                sm:text-[12px]
                sm:leading-6
              "
            >
              From the overall design direction to
              the smallest finishing detail, the
              interior team handles the complete
              journey.
            </p>
          </div>

          <div
            className="
              grid
              gap-3
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {services.map(
              (service) => {
                const Icon =
                  service.icon;

                return (
                  <div
                    key={
                      service.title
                    }
                    className="
                      rounded-[18px]
                      border
                      border-[#E1D8CD]
                      bg-[#FBF8F3]
                      p-5
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:border-[#CDB28B]
                      hover:shadow-[0_12px_28px_rgba(55,43,31,0.05)]
                      sm:p-6
                    "
                  >
                    <div
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#D8C5A8]
                        bg-[#F5EDE2]
                      "
                    >
                      <Icon
                        size={16}
                        strokeWidth={1.3}
                        className="text-[#9A7138]"
                      />
                    </div>

                    <h3
                      className="
                        mt-5
                        font-serif
                        text-[22px]
                        tracking-tight
                        text-[#302B25]
                      "
                    >
                      {
                        service.title
                      }
                    </h3>

                    <p
                      className="
                        mt-2
                        text-[10px]
                        leading-5
                        text-[#81776C]
                        sm:text-[11px]
                      "
                    >
                      {
                        service.description
                      }
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY CHOOSE
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
            grid
            gap-10
            lg:grid-cols-[0.82fr_1.18fr]
            lg:items-center
            lg:gap-20
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
              Why choose a complete service
            </p>

            <h2
              className="
                mt-3
                font-serif
                text-[35px]
                leading-none
                tracking-[-0.045em]
                text-[#302B25]
                sm:text-[46px]
              "
            >
              One vision.
              <br />
              One experience.
              <br />
              One finished space.
            </h2>

            <p
              className="
                mt-5
                max-w-lg
                text-[11px]
                leading-6
                text-[#81776C]
                sm:text-[12px]
              "
            >
              Instead of coordinating different
              vendors for different parts of your
              project, a complete interior service
              brings design and execution together.
            </p>

            <button
              type="button"
              onClick={openInteriorWebsite}
              className="
                group
                mt-6
                flex
                items-center
                gap-2
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.16em]
                text-[#76562F]
              "
            >
              Discover the full service

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
              gap-3
              sm:grid-cols-2
            "
          >
            {[
              "Turnkey execution",
              "Quality materials",
              "Coordinated workmanship",
              "Transparent estimates",
              "Design-led decisions",
              "Single point of contact",
            ].map(
              (item, index) => (
                <div
                  key={item}
                  className="
                    flex
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-[#E2D9CE]
                    bg-[#F7F2EB]
                    px-4
                    py-4
                  "
                >
                  <span
                    className="
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#EDE1D1]
                    "
                  >
                    <Check
                      size={12}
                      strokeWidth={2}
                      className="text-[#8F6B3F]"
                    />
                  </span>

                  <div>
                    <span
                      className="
                        block
                        text-[7px]
                        font-semibold
                        uppercase
                        tracking-[0.15em]
                        text-[#A4773E]
                      "
                    >
                      0{index + 1}
                    </span>

                    <span
                      className="
                        mt-0.5
                        block
                        text-[10px]
                        font-semibold
                        text-[#403A33]
                      "
                    >
                      {item}
                    </span>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          PROCESS
      ===================================================== */}

      <section className="border-y border-[#E5DDD4] bg-[#F4EEE6]">
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
          <div className="mb-10">
            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.3em]
                text-[#A4773E]
              "
            >
              From concept to completion
            </p>

            <h2
              className="
                mt-2.5
                font-serif
                text-[31px]
                leading-none
                tracking-[-0.04em]
                text-[#302B25]
                sm:text-[42px]
              "
            >
              A simpler way to transform your space.
            </h2>
          </div>

          <div
            className="
              grid
              gap-3
              md:grid-cols-2
              lg:grid-cols-4
            "
          >
            {process.map(
              (step) => (
                <div
                  key={step.number}
                  className="
                    relative
                    rounded-[18px]
                    border
                    border-[#E0D6CA]
                    bg-[#FBF8F3]
                    p-5
                    sm:p-6
                  "
                >
                  <span
                    className="
                      font-serif
                      text-[34px]
                      leading-none
                      text-[#B7894A]/35
                    "
                  >
                    {step.number}
                  </span>

                  <h3
                    className="
                      mt-5
                      font-serif
                      text-[23px]
                      tracking-tight
                      text-[#302B25]
                    "
                  >
                    {step.title}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-[10px]
                      leading-5
                      text-[#81776C]
                    "
                  >
                    {step.description}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
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
        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-[#D9CCBC]
            bg-[#EDE3D6]
            px-6
            py-12
            text-center
            sm:px-10
            sm:py-16
            lg:py-20
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-64
              w-64
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#D0B48A]/20
              blur-[80px]
            "
          />

          <div className="relative">
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
              Ready to transform your space?
            </p>

            <h2
              className="
                mx-auto
                mt-3
                max-w-3xl
                font-serif
                text-[35px]
                leading-[1.02]
                tracking-[-0.045em]
                text-[#302B25]
                sm:text-[48px]
                lg:text-[56px]
              "
            >
              Let's make your vision
              <br className="hidden sm:block" />
              a reality.
            </h2>

            <p
              className="
                mx-auto
                mt-4
                max-w-xl
                text-[10px]
                leading-5
                text-[#776D62]
                sm:text-[12px]
                sm:leading-6
              "
            >
              Explore the complete interior design
              and execution experience through our
              dedicated interior services team.
            </p>

            <div
              className="
                mt-7
                flex
                flex-col
                items-center
                justify-center
                gap-3
                sm:flex-row
              "
            >
              <button
                type="button"
                onClick={openInteriorWebsite}
                className="
                  group
                  flex
                  items-center
                  justify-center
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
                "
              >
                Visit Interior Services

                <ExternalLink
                  size={12}
                  strokeWidth={1.5}
                  className="
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                  "
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/products")
                }
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-[#BDA98D]
                  bg-white/50
                  px-6
                  py-3.5
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-[#76562F]
                  transition-all
                  duration-300
                  hover:bg-white
                "
              >
                Continue Shopping

                <ArrowRight
                  size={12}
                  strokeWidth={1.5}
                />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default InteriorServices;