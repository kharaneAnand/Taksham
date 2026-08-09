import {
  ArrowRight,
  ArrowUpRight,
  Mail,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

const Footer = () => {
  const shopLinks = [
    "Shop by Room",
    "Shop by Product",
    "Collections",
    "New Arrivals",
    "Offers",
  ];

  const exploreLinks = [
    "About Taksham",
    "Projects",
    "Interior Services",
    "Ideas & Inspiration",
  ];

  const helpLinks = [
    "Contact Us",
    "Shipping",
    "FAQ",
    "Track Order",
  ];

  return (
    <footer className="relative overflow-hidden border-t border-[#DED3C5] bg-[#F5F0E8] text-[#25221E]">


      <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#D6B77A]/15 blur-[110px]" />

      <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-[#B7A083]/10 blur-[100px]" />

    

      <div className="relative z-10 mx-auto max-w-375 px-5 sm:px-8 lg:px-12 xl:px-16">

    

        <div className="relative py-12 sm:py-14 lg:py-16">

          {/* Decorative number */}

          <span
            className="
              pointer-events-none
              absolute
              right-0
              top-5
              hidden
              font-serif
              text-[110px]
              font-medium
              leading-none
              tracking-[-0.08em]
              text-[#2D2923]/4.5
              lg:block
            "
          >
            01
          </span>

          <div
            className="
              relative
              overflow-hidden
              rounded-[28px]
              border
              border-[#DCCFBE]
              bg-[#EDE3D5]
              px-6
              py-8
              shadow-[0_20px_60px_rgba(91,70,44,0.06)]
              sm:px-9
              sm:py-10
              lg:px-12
              lg:py-11
            "
          >

            {/* Decorative glow */}

            <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#C9A66C]/15 blur-[80px]" />

            <div className="pointer-events-none absolute bottom-22.5 left-[35%] h-52 w-52 rounded-full border border-[#B99A6B]/10" />

            <div
              className="
                relative
                grid
                gap-8
                lg:grid-cols-[1fr_auto]
                lg:items-center
              "
            >

              {/* Copy */}

              <div>

                <div className="flex items-center gap-3">

                  <span className="h-px w-9 bg-[#A4773E]" />

                  <span className="text-[8px] font-semibold uppercase tracking-[0.32em] text-[#9A7138]">
                    Let's create something beautiful
                  </span>

                </div>

                <h2
                  className="
                    mt-4
                    max-w-175
                    font-serif
                    text-[38px]
                    font-medium
                    leading-[0.98]
                    tracking-[-0.045em]
                    text-[#28241F]
                    sm:text-[46px]
                    lg:text-[54px]
                  "
                >
                  Your home deserves
                  <br />
                  <span className="text-[#A4773E]">
                    thoughtful design.
                  </span>
                </h2>

                <p className="mt-4 max-w-125text-[12px] leading-6 text-[#776D61] sm:text-[13px]">
                  Tell us about your space and let our design team
                  help you bring your vision to life.
                </p>

              </div>


              <div className="lg:pr-3">

                <button
                  className="
                    group
                    relative
                    flex
                    h-14.5
                    w-full
                    items-center
                    justify-between
                    gap-8
                    overflow-hidden
                    rounded-full
                    bg-[#27231E]
                    px-6
                    text-left
                    text-white
                    shadow-[0_12px_30px_rgba(39,35,30,0.14)]
                    transition-all
                    duration-500
                    hover:-translate-y-1
                    hover:shadow-[0_18px_40px_rgba(39,35,30,0.18)]
                    sm:w-67.5
                  "
                >

                  <span className="relative z-10">

                    <span className="block text-[9px] uppercase tracking-[0.18em] text-white/45">
                      Start a conversation
                    </span>

                    <span className="mt-1 block text-[12px] font-medium">
                      Book a Consultation
                    </span>

                  </span>

                  <span
                    className="
                      relative
                      z-10
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-[#C7A66C]
                      text-[#28231D]
                      transition-transform
                      duration-500
                      group-hover:rotate-45
                    "
                  >
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.6}
                    />
                  </span>

                  <span
                    className="
                      absolute
                      inset-0
                      translate-x-full
                      bg-[#332D25]
                      transition-transform
                      duration-500
                      group-hover:translate-x-0
                    "
                  />

                </button>

              </div>

            </div>

          </div>

        </div>


        <div
          className="
            grid
            gap-10
            border-t
            border-[#DED3C5]
            py-10
            sm:grid-cols-2
            lg:grid-cols-[1.35fr_0.8fr_0.8fr_0.8fr]
            lg:gap-12
          "
        >

          {/* BRAND */}

          <div>

            <div className="flex items-center gap-4">

              <div
                className="
                  relative
                  flex
                  h-13
                  w-13
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#CDB99A]
                  bg-[#EFE5D7]
                "
              >

                <span className="font-serif text-[25px] text-[#9D753F]">
                  त
                </span>

                <span className="absolute inset-1.25 rounded-full border border-[#D7C6AD]" />

              </div>

              <div>

                <h3
                  className="
                    font-serif
                    text-[29px]
                    font-medium
                    leading-none
                    tracking-[-0.04em]
                    text-[#28241F]
                  "
                >
                  तक्षम्
                </h3>

                <p className="mt-1 text-[8px] tracking-[0.43em] text-[#978C7F]">
                  TAKSHAM
                </p>

              </div>

            </div>

            <p className="mt-5 max-w-75 text-[12px] leading-6 text-[#7D7469]">
              Furniture, interiors and thoughtful details designed
              for beautiful everyday living.
            </p>

            <div className="mt-5 flex items-center gap-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D6C9B8] bg-white/50">
                <Mail
                  size={14}
                  strokeWidth={1.4}
                  className="text-[#A4773E]"
                />
              </div>

              <span className="text-[11px] text-[#71685D]">
                hello@taksham.com
              </span>

            </div>

          </div>

          {/* SHOP */}

          <div>

            <div className="flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-[#B7894A]" />

              <h3 className="text-[9px] font-semibold uppercase tracking-[0.26em] text-[#9A7138]">
                Shop
              </h3>

            </div>

            <ul className="mt-5 space-y-3">

              {shopLinks.map((item) => (
                <li key={item}>

                  <button
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      text-[12px]
                      text-[#696157]
                      transition-all
                      duration-300
                      hover:translate-x-1
                      hover:text-[#9A7138]
                    "
                  >
                    {item}

                    <ArrowRight
                      size={11}
                      strokeWidth={1.5}
                      className="
                        -translate-x-2
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:translate-x-0
                        group-hover:opacity-100
                      "
                    />

                  </button>

                </li>
              ))}

            </ul>

          </div>

          {/* EXPLORE */}

          <div>

            <div className="flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-[#B7894A]" />

              <h3 className="text-[9px] font-semibold uppercase tracking-[0.26em] text-[#9A7138]">
                Explore
              </h3>

            </div>

            <ul className="mt-5 space-y-3">

              {exploreLinks.map((item) => (
                <li key={item}>

                  <button
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      text-[12px]
                      text-[#696157]
                      transition-all
                      duration-300
                      hover:translate-x-1
                      hover:text-[#9A7138]
                    "
                  >
                    {item}

                    <ArrowRight
                      size={11}
                      strokeWidth={1.5}
                      className="
                        -translate-x-2
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:translate-x-0
                        group-hover:opacity-100
                      "
                    />

                  </button>

                </li>
              ))}

            </ul>

          </div>

          {/* HELP */}

          <div>

            <div className="flex items-center gap-2">

              <span className="h-1.5 w-1.5 rounded-full bg-[#B7894A]" />

              <h3 className="text-[9px] font-semibold uppercase tracking-[0.26em] text-[#9A7138]">
                Help
              </h3>

            </div>

            <ul className="mt-5 space-y-3">

              {helpLinks.map((item) => (
                <li key={item}>

                  <button
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      text-[12px]
                      text-[#696157]
                      transition-all
                      duration-300
                      hover:translate-x-1
                      hover:text-[#9A7138]
                    "
                  >
                    {item}

                    <ArrowRight
                      size={11}
                      strokeWidth={1.5}
                      className="
                        -translate-x-2
                        opacity-0
                        transition-all
                        duration-300
                        group-hover:translate-x-0
                        group-hover:opacity-100
                      "
                    />

                  </button>

                </li>
              ))}

            </ul>

          </div>

        </div>


        <div
          className="
            relative
            flex
            flex-col
            gap-5
            overflow-hidden
            border-t
            border-[#DED3C5]
            py-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          {/* Social */}

          <div className="flex items-center gap-3">

            <span className="mr-1 text-[8px] font-semibold uppercase tracking-[0.25em] text-[#9A9085]">
              Follow
            </span>

            <button
              aria-label="Instagram"
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                border
                border-[#D4C7B6]
                bg-white/50
                text-[#756B5E]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-[#B7894A]
                hover:bg-[#EFE2D0]
                hover:text-[#9A7138]
              "
            >
              <FaInstagram size={14} />
            </button>

            <button
              aria-label="Facebook"
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                border
                border-[#D4C7B6]
                bg-white/50
                text-[#756B5E]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-[#B7894A]
                hover:bg-[#EFE2D0]
                hover:text-[#9A7138]
              "
            >
              <FaFacebookF size={13} />
            </button>

          </div>

          {/* Center Logo */}

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-3 sm:flex">

            <span className="h-px w-12 bg-[#D4C7B6]" />

            <span className="font-serif text-[17px] text-[#A47C47]">
              तक्षम्
            </span>

            <span className="h-px w-12 bg-[#D4C7B6]" />

          </div>

          {/* Legal */}

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">

            {[
              "Privacy Policy",
              "Terms & Conditions",
              "Shipping Policy",
            ].map((item) => (
              <button
                key={item}
                className="
                  text-[9px]
                  text-[#958B80]
                  transition-colors
                  duration-300
                  hover:text-[#9A7138]
                "
              >
                {item}
              </button>
            ))}

            <span className="hidden h-3 w-px bg-[#D6C9B9] sm:block" />

            <span className="text-[9px] text-[#A49B91]">
              © 2026 Taksham
            </span>
            

          </div>

        </div>

        {/* Mobile Signature */}

        <div className="flex items-center justify-center gap-3 pb-5 sm:hidden">

          <span className="h-px w-8 bg-[#D6C9B6]" />

          <span className="font-serif text-[16px] text-[#A47C47]">
            तक्षम्
          </span>

          <span className="h-px w-8 bg-[#D6C9B6]" />

        </div>

      </div>
    </footer>
  );
};

export default Footer;