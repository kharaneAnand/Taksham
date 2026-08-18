import {
  ArrowRight,
  Check,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import livingRoom from "../../assets/images/rooms/living-room.png";
import heroimg from "../../assets/images/looks/Hero_product_page.png"

const About = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#302B25]">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        className="
          mx-auto
          max-w-375
          px-4
          pt-5
          sm:px-6
          sm:pt-7
          lg:px-10
          lg:pt-9
          xl:px-14
        "
      >
        <div
          className="
            relative
            min-h-90
            overflow-hidden
            rounded-[22px]
            border
            border-[#DED3C5]
            bg-[#F2EADF]
            shadow-[0_14px_45px_rgba(65,48,30,0.055)]
            sm:min-h-98
            sm:rounded-[25px]
            lg:min-h-103
            lg:rounded-[28px]
          "
        >
          {/* =================================================
              HERO IMAGE
          ================================================= */}

          <div className="absolute inset-0 overflow-hidden">
            <img
              src={heroimg}
              alt="Taksham living space"
              className="
                absolute
                inset-0
                h-full
                w-full
                object-cover
                object-center
                transition-transform
                duration-1200
                ease-out
              "
            />

            {/* Desktop fade */}

            <div
              className="
                absolute
                inset-0
                bg-linear-to-r
                from-[#F3EDE4]
                via-[#F3EDE4]/95
                via-25%
                to-[#F3EDE4]/10
              "
            />

            {/* Bottom softness */}

            <div
              className="
                absolute
                inset-x-0
                bottom-0
                h-28
                bg-linear-to-t
                from-[#3A2E22]/10
                to-transparent
              "
            />

            {/* Mobile image treatment */}

            <div
              className="
                absolute
                inset-0
                bg-[#F3EDE4]/35
                sm:hidden
              "
            />
          </div>

          {/* =================================================
              HERO CONTENT
          ================================================= */}

          <div
            className="
              relative
              z-10
              flex
              min-h-90
              flex-col
              justify-between
              p-6
              sm:min-h-98
              sm:p-8
              lg:min-h-103
              lg:p-10
              xl:p-12
            "
          >
            {/* Top */}

            <div>
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-[#A4773E]" />

                <span
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.28em]
                    text-[#9A7138]
                    sm:text-[9px]
                  "
                >
                  About Taksham
                </span>
              </div>

              {/* Main heading */}

              <h1
                className="
                  mt-5
                  max-w-140
                  font-serif
                  text-[40px]
                  font-medium
                  leading-[0.95]
                  tracking-[-0.045em]
                  text-[#29241F]
                  sm:mt-6
                  sm:text-[50px]
                  lg:text-[58px]
                  xl:text-[64px]
                "
              >
                Furniture that
                <br />
                feels like{" "}
                <span className="text-[#9A7138]">
                  home.
                </span>
              </h1>

              <p
                className="
                  mt-5
                  max-w-123
                  text-[11px]
                  leading-[1.8]
                  text-[#70665B]
                  sm:text-[12px]
                  lg:text-[13px]
                  lg:leading-6
                "
              >
                Taksham is about creating spaces
                that feel personal, comfortable and
                beautifully lived in. We bring
                thoughtfully selected furniture and
                design together to help you create a
                home that feels truly yours.
              </p>
            </div>

            {/* Bottom */}

            <div
              className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >
              <div className="flex items-center gap-3">
                {/* Editorial number */}

                <span
                  className="
                    font-serif
                    text-[13px]
                    text-[#A4773E]
                  "
                >
                  01
                </span>

                <span className="h-7 w-px bg-[#CBBBA8]" />

                {/* Detail */}

                <div className="flex items-center gap-2">
                  <span
                    className="
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#C9A675]
                      bg-white/45
                    "
                  >
                    <span className="h-2 w-2 rounded-full bg-[#B7894A]" />
                  </span>

                  <span
                    className="
                      text-[7px]
                      font-semibold
                      uppercase
                      tracking-[0.14em]
                      text-[#685C4F]
                      sm:text-[8px]
                    "
                  >
                    Thoughtfully designed
                  </span>
                </div>

                <span className="hidden h-4 w-px bg-[#CBBBA8] sm:block" />

                <span
                  className="
                    hidden
                    text-[8px]
                    font-medium
                    text-[#756A5E]
                    sm:block
                  "
                >
                  Made for modern living
                </span>
              </div>

              {/* Image badge */}

              <div
                className="
                  flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-white/70
                  bg-[#F7F0E7]/85
                  px-3.5
                  py-2
                  shadow-[0_6px_20px_rgba(50,38,25,0.08)]
                  backdrop-blur-md
                "
              >
                <span className="h-1.5 w-1.5 rounded-full bg-[#B7894A]" />

                <span
                  className="
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-[#67594A]
                  "
                >
                  Creating beautiful spaces
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ABOUT / OUR STORY
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
          lg:py-20
          xl:px-16
        "
      >
        <div
          className="
            grid
            gap-9
            lg:grid-cols-[0.9fr_1.1fr]
            lg:items-center
            lg:gap-16
          "
        >
          {/* Image */}

          <div
            className="
              group
              relative
              overflow-hidden
              rounded-[20px]
              border
              border-[#E1D8CD]
              bg-[#EEE8DF]
              shadow-[0_12px_35px_rgba(60,45,30,0.045)]
              sm:rounded-[22px]
            "
          >
            <div className="aspect-[1.08]">
              <img
                src={livingRoom}
                alt="Taksham living space"
                className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-700
                  ease-out
                  group-hover:scale-[1.025]
                "
              />
            </div>

            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                bottom-0
                h-24
                bg-linear-to-t
                from-black/15
                to-transparent
              "
            />

            <div
              className="
                absolute
                bottom-4
                left-4
                flex
                items-center
                gap-2
                rounded-full
                border
                border-white/40
                bg-black/10
                px-3
                py-1.5
                backdrop-blur-md
              "
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#E1BD80]" />

              <span
                className="
                  text-[6px]
                  font-semibold
                  uppercase
                  tracking-[0.17em]
                  text-white/90
                "
              >
                The Taksham edit
              </span>
            </div>
          </div>

          {/* Content */}

          <div>
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-[#A4773E]" />

              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.28em]
                  text-[#A4773E]
                "
              >
                Our story
              </p>
            </div>

            <h2
              className="
                mt-4
                max-w-2xl
                font-serif
                text-[32px]
                leading-none
                tracking-[-0.04em]
                text-[#302B25]
                sm:text-[40px]
                lg:text-[44px]
              "
            >
              Good furniture
              <br />
              changes how a
              <br />
              space{" "}
              <span className="text-[#9A7138]">
                feels.
              </span>
            </h2>

            <div
              className="
                mt-5
                h-px
                w-10
                bg-[#B7894A]
              "
            />

            <div
              className="
                mt-5
                max-w-xl
                space-y-4
                text-[11px]
                leading-6
                text-[#81776C]
                sm:text-[12px]
              "
            >
              <p>
                We believe furniture should be more
                than something you simply place in a
                room. It should complement the way
                you live, gather, relax and create
                memories.
              </p>

              <p>
                That's why Taksham focuses on
                thoughtful designs, comfortable
                forms and pieces that can naturally
                become part of your everyday life.
              </p>

              <p>
                Whether you're furnishing one corner
                or creating an entire home, we're here
                to make the process simple and
                enjoyable.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
              className="
                group
                mt-6
                flex
                items-center
                gap-2
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.17em]
                text-[#76562F]
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
        </div>
      </section>

      {/* =====================================================
          WHAT WE STAND FOR
      ===================================================== */}

      <section className="border-y border-[#E5DDD4] bg-[#F7F2EB]">
        <div
          className="
            mx-auto
            max-w-375
            px-5
            py-12
            sm:px-8
            sm:py-15
            lg:px-12
            lg:py-17
            xl:px-16
          "
        >
          <div
            className="
              mb-7
              flex
              flex-col
              gap-2
              sm:mb-9
              sm:flex-row
              sm:items-end
              sm:justify-between
            "
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-[#A4773E]" />

                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.28em]
                    text-[#A4773E]
                  "
                >
                  What matters to us
                </p>
              </div>

              <h2
                className="
                  mt-3
                  font-serif
                  text-[28px]
                  leading-none
                  tracking-[-0.04em]
                  text-[#302B25]
                  sm:text-[36px]
                  lg:text-[40px]
                "
              >
                Simple things.
                <span className="text-[#9A7138]">
                  {" "}
                  Done thoughtfully.
                </span>
              </h2>
            </div>

            <span
              className="
                hidden
                font-serif
                text-[13px]
                text-[#B7894A]
                sm:block
              "
            >
              02
            </span>
          </div>

          <div
            className="
              grid
              gap-3
              md:grid-cols-3
            "
          >
            {[
              {
                title: "Thoughtful Design",
                text: "Pieces that bring character, comfort and purpose to your space.",
              },
              {
                title: "Quality First",
                text: "We care about the materials, finishes and details that make a difference.",
              },
              {
                title: "Customer First",
                text: "From choosing a product to receiving it, we want the experience to feel effortless.",
              },
            ].map((item, index) => (
              <div
                key={item.title}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-[17px]
                  border
                  border-[#E0D6CA]
                  bg-[#FBF8F3]
                  p-5
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#CDB28B]
                  hover:shadow-[0_14px_30px_rgba(55,43,31,0.05)]
                  sm:p-6
                "
              >
                <span
                  className="
                    absolute
                    right-5
                    top-5
                    font-serif
                    text-[11px]
                    text-[#C6A777]
                  "
                >
                  0{index + 1}
                </span>

                <span
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#DCCBB5]
                    bg-[#F2E7D8]
                  "
                >
                  <Check
                    size={13}
                    strokeWidth={1.8}
                    className="text-[#8F6B3F]"
                  />
                </span>

                <h3
                  className="
                    mt-5
                    font-serif
                    text-[21px]
                    tracking-tight
                    text-[#302B25]
                    sm:text-[22px]
                  "
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mt-2
                    max-w-sm
                    text-[10px]
                    leading-5
                    text-[#81776C]
                    sm:text-[11px]
                  "
                >
                  {item.text}
                </p>

                <div
                  className="
                    mt-5
                    h-px
                    w-7
                    bg-[#B7894A]
                    transition-all
                    duration-300
                    group-hover:w-12
                  "
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT
      ===================================================== */}

      <section
        className="
          mx-auto
          max-w-275
          px-5
          py-15
          sm:px-8
          sm:py-19
          lg:py-22
        "
      >
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-6 bg-[#A4773E]" />

            <p
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.28em]
                text-[#A4773E]
              "
            >
              Contact Taksham
            </p>

            <span className="h-px w-6 bg-[#A4773E]" />
          </div>

          <h2
            className="
              mt-4
              font-serif
              text-[32px]
              leading-none
              tracking-[-0.04em]
              text-[#302B25]
              sm:text-[42px]
            "
          >
            Let's talk about
            <br className="sm:hidden" /> your space.
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-xl
              text-[11px]
              leading-6
              text-[#81776C]
              sm:text-[12px]
            "
          >
            Need help choosing furniture, have a
            question about your order, or simply want
            to know more about Taksham? Reach out.
            We'd love to hear from you.
          </p>
        </div>

        {/* Contact cards */}

        <div
          className="
            mt-8
            grid
            gap-3
            sm:grid-cols-3
          "
        >
          {/* Email */}

          <a
            href="mailto:hello@taksham.com"
            className="
              group
              rounded-[18px]
              border
              border-[#E1D8CD]
              bg-[#F7F2EB]
              p-5
              text-center
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#CDB28B]
              hover:shadow-[0_14px_30px_rgba(55,43,31,0.06)]
              sm:p-6
            "
          >
            <span
              className="
                mx-auto
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[#DCCBB5]
                bg-[#EDE1D1]
              "
            >
              <Mail
                size={16}
                strokeWidth={1.3}
                className="text-[#8F6B3F]"
              />
            </span>

            <p
              className="
                mt-4
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[#A4773E]
              "
            >
              Email us
            </p>

            <p
              className="
                mt-1.5
                text-[11px]
                font-medium
                text-[#403A33]
              "
            >
              hello@taksham.com
            </p>
          </a>

          {/* Phone */}

          <a
            href="tel:+919999999999"
            className="
              group
              rounded-[18px]
              border
              border-[#E1D8CD]
              bg-[#F7F2EB]
              p-5
              text-center
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#CDB28B]
              hover:shadow-[0_14px_30px_rgba(55,43,31,0.06)]
              sm:p-6
            "
          >
            <span
              className="
                mx-auto
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[#DCCBB5]
                bg-[#EDE1D1]
              "
            >
              <Phone
                size={16}
                strokeWidth={1.3}
                className="text-[#8F6B3F]"
              />
            </span>

            <p
              className="
                mt-4
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[#A4773E]
              "
            >
              Call us
            </p>

            <p
              className="
                mt-1.5
                text-[11px]
                font-medium
                text-[#403A33]
              "
            >
              +91 99999 99999
            </p>
          </a>

          {/* WhatsApp */}

          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="
              group
              rounded-[18px]
              border
              border-[#E1D8CD]
              bg-[#F7F2EB]
              p-5
              text-center
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#CDB28B]
              hover:shadow-[0_14px_30px_rgba(55,43,31,0.06)]
              sm:p-6
            "
          >
            <span
              className="
                mx-auto
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[#DCCBB5]
                bg-[#EDE1D1]
              "
            >
              <MessageCircle
                size={16}
                strokeWidth={1.3}
                className="text-[#8F6B3F]"
              />
            </span>

            <p
              className="
                mt-4
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[#A4773E]
              "
            >
              WhatsApp
            </p>

            <p
              className="
                mt-1.5
                text-[11px]
                font-medium
                text-[#403A33]
              "
            >
              Chat with us
            </p>
          </a>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="border-t border-[#E5DDD4] bg-[#302B25]">
        <div
          className="
            mx-auto
            max-w-275
            px-5
            py-11
            text-center
            sm:px-8
            sm:py-15
          "
        >
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.28em]
              text-[#D1AC70]
            "
          >
            Taksham
          </p>

          <h2
            className="
              mt-3
              font-serif
              text-[29px]
              leading-none
              tracking-[-0.04em]
              text-[#F7F2EB]
              sm:text-[38px]
            "
          >
            Find something
            <span className="text-[#C9A16A]">
              {" "}
              you'll love.
            </span>
          </h2>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
            className="
              group
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              border
              border-[#C29A5E]
              bg-[#C29A5E]
              px-6
              py-3.5
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.15em]
              text-white
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#AF854D]
              hover:shadow-[0_10px_25px_rgba(194,154,94,0.18)]
            "
          >
            Shop Collection

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

export default About;