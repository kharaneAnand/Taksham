import {
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";

import brandImage from "../../assets/images/looks/whyTaksham.png";

const highlights = [
  {
    number: "01",
    title: "Thoughtful Design",
    description:
      "Beauty, comfort and purpose in every piece.",
  },
  {
    number: "02",
    title: "Quality Craftsmanship",
    description:
      "Refined materials and details made to last.",
  },
  {
    number: "03",
    title: "Personalized Spaces",
    description:
      "Pieces that make your space uniquely yours.",
  },
  {
    number: "04",
    title: "Expert Guidance",
    description:
      "Confident choices for every room.",
  },
];

const WhyTaksham = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF8F4] py-8 sm:py-10 lg:py-11">


      <div className="pointer-events-none absolute -left-40 top-10 h-90 w-90 rounded-full bg-[#D7BD98]/10 blur-[110px]" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-90 w-90 rounded-full bg-[#B79A74]/10 blur-[110px]" />

      <div className="relative z-10 mx-auto max-w-370 px-4 sm:px-6 lg:px-8 xl:px-10">

    

        <div className="mb-6 flex items-end justify-between gap-8 lg:mb-7">

          <div>

            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-[#B7894A]" />

              <span className="text-[8px] font-semibold uppercase tracking-[0.36em] text-[#A4773E] sm:text-[9px]">
                The Taksham Difference
              </span>
            </div>

            <h2
              className="
                mt-3
                font-serif
                text-[36px]
                font-medium
                leading-[0.95]
                tracking-[-0.055em]
                text-[#211F1C]
                sm:text-[45px]
                lg:text-[52px]
                xl:text-[56px]
              "
            >
              Thoughtfully designed.
              <span className="text-[#967B59]">
                {" "}
                Made for your home.
              </span>
            </h2>

          </div>

          <div className="hidden max-w-85 items-center gap-3 pb-1 lg:flex">

            <Sparkles
              size={15}
              strokeWidth={1.3}
              className="shrink-0 text-[#B7894A]"
            />

            <p className="text-[10px] leading-5 text-[#766E65]">
              Timeless design, meaningful details and spaces made
              for everyday living.
            </p>

          </div>

        </div>


        <div
          className="
            relative
            overflow-hidden
            rounded-[26px]
            border
            border-[#DED2C3]
            bg-[#FDFBF8]
            shadow-[0_28px_80px_rgba(65,48,31,0.10)]
            lg:h-129
            xl:h-135
          "
        >

          <div className="grid h-full lg:grid-cols-[1.04fr_0.96fr]">


            <div
              className="
                group
                relative
                h-83
                overflow-hidden
                sm:h-103
                lg:h-full
              "
            >

              <img
                src={brandImage}
                alt="Thoughtfully designed Taksham interior"
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-1800
                  ease-out
                  group-hover:scale-[1.025]
                "
              />


              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#1D140D]/70 via-[#1D140D]/10 to-transparent" />

              <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#1D140D]/20 via-transparent to-transparent" />

              {/* Image frame */}

              <div className="pointer-events-none absolute inset-4 rounded-[20px] border border-white/20" />

              

              <div className="absolute left-7 top-7">

                <div
                  className="
                    flex
                    items-center
                    gap-2.5
                    rounded-full
                    border
                    border-white/45
                    bg-white/60
                    px-4
                    py-2
                    shadow-lg
                    backdrop-blur-xl
                  "
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#A4773E]" />

                  <span className="text-[7px] font-semibold uppercase tracking-[0.28em] text-[#514437] sm:text-[8px]">
                    The Taksham Edit
                  </span>
                </div>

              </div>

           

              <div className="absolute right-7 top-7 flex flex-col items-center gap-2">

                <span className="font-serif text-[15px] text-white/90">
                  01
                </span>

                <span className="h-9 w-px bg-white/35" />

                <span className="text-[7px] tracking-[0.22em] text-white/60">
                  04
                </span>

              </div>

              

              <div className="absolute bottom-7 left-7 right-7">

                <p className="text-[8px] font-semibold uppercase tracking-[0.32em] text-white/65">
                  Designed for living
                </p>

                <h3
                  className="
                    mt-2
                    max-w-120
                    font-serif
                    text-[30px]
                    font-medium
                    leading-[0.98]
                    tracking-[-0.045em]
                    text-white
                    sm:text-[36px]
                    lg:text-[38px]
                  "
                >
                  A home should feel
                  <br />
                  <span className="text-[#E5CFAD]">
                    unmistakably yours.
                  </span>
                </h3>

                <div className="mt-4 flex items-center gap-3">

                  <span className="h-px w-12 bg-white/60" />

                  <span className="text-[7px] uppercase tracking-[0.3em] text-white/55">
                    TAKSHAM
                  </span>

                </div>

              </div>

            </div>


            <div
              className="
                relative
                flex
                h-full
                flex-col
                bg-[#FDFBF8]
                px-6
                py-6
                sm:px-8
                sm:py-7
                lg:px-9
                lg:py-7
                xl:px-11
                xl:py-8
              "
            >

             

              <div
                className="
                  pointer-events-none
                  absolute
                  right-0
                  top-0
                  h-24
                  w-24
                  rounded-bl-[90px]
                  border-b
                  border-l
                  border-[#E6D9C9]
                "
              />

             

              <div className="relative z-10">

                <div className="flex items-center gap-2.5">

                  <span className="h-1.5 w-1.5 rounded-full bg-[#B7894A]" />

                  <span className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[#A4773E]">
                    Why Taksham
                  </span>

                </div>

                <h3
                  className="
                    mt-3
                    max-w-130
                    font-serif
                    text-[34px]
                    font-medium
                    leading-[0.98]
                    tracking-[-0.045em]
                    text-[#29251F]
                    sm:text-[39px]
                    lg:text-[41px]
                    xl:text-[44px]
                  "
                >
                  Your home should feel
                  <br />
                  <span className="text-[#927957]">
                    as good as it looks.
                  </span>
                </h3>

                <p
                  className="
                    mt-3
                    max-w-125
                    text-[10px]
                    leading-5
                    text-[#766E65]
                    sm:text-[11px]
                  "
                >
                  Timeless design meets everyday functionality to help
                  you create spaces you truly love.
                </p>

              </div>


              <div
                className="
                  relative
                  z-10
                  mt-5
                  grid
                  grid-cols-2
                  border-t
                  border-[#E4D9CD]
                "
              >

                {highlights.map((item, index) => (
                  <div
                    key={item.title}
                    className={`
                      group
                      relative
                      min-h-23
                      px-2
                      py-4
                      transition-all
                      duration-300
                      hover:bg-[#FBF7F0]
                      ${
                        index % 2 === 0
                          ? "border-r border-[#E4D9CD] pr-5"
                          : "pl-5"
                      }
                      ${
                        index >= 2
                          ? "border-t border-[#E4D9CD]"
                          : ""
                      }
                    `}
                  >

                    <div className="flex items-center justify-between">

                      <span
                        className="
                          font-serif
                          text-[17px]
                          font-medium
                          text-[#BBA488]
                          transition-colors
                          duration-300
                          group-hover:text-[#A4773E]
                        "
                      >
                        {item.number}
                      </span>

                      <span
                        className="
                          flex
                          h-6
                          w-6
                          items-center
                          justify-center
                          rounded-full
                          border
                          border-[#E4D5C1]
                          bg-[#F4EBDD]
                          transition-all
                          duration-300
                          group-hover:scale-105
                        "
                      >
                        <Check
                          size={11}
                          strokeWidth={2}
                          className="text-[#A4773E]"
                        />
                      </span>

                    </div>

                    <h4 className="mt-2.5 text-[11px] font-semibold text-[#302C27] sm:text-[12px]">
                      {item.title}
                    </h4>

                    <p className="mt-1.5 max-w-55 text-[13px] leading-4 text-[#81776B] sm:text-[9px]">
                      {item.description}
                    </p>

                    {/* Hover accent */}

                    <span
                      className="
                        absolute
                        bottom-0
                        left-0
                        h-0.5
                        w-0
                        bg-[#B7894A]
                        transition-all
                        duration-500
                        group-hover:w-12
                      "
                    />

                  </div>
                ))}

              </div>


              <div className="relative z-10 mt-auto pt-5">

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-5
                    rounded-[15px]
                    border
                    border-[#E0D2C1]
                    bg-[#F7EFE3]
                    px-4
                    py-2
                    transition-all
                    duration-300
                    hover:border-[#CBB28F]
                    hover:shadow-[0_8px_25px_rgba(120,90,50,0.06)]
                  "
                >

                  <div>

                    <p className="text-[7px] font-semibold uppercase tracking-[0.27em] text-[#A4773E]">
                      Our philosophy
                    </p>

                    <p
                      className="
                        mt-1.5
                        font-serif
                        text-[15px]
                        leading-tight
                        tracking-[-0.02em]
                        text-[#51483E]
                        sm:text-[17px]
                      "
                    >
                      Less noise. Better pieces.
                      <br className="sm:hidden" /> More meaningful spaces.
                    </p>

                  </div>

                  <Sparkles
                    size={18}
                    strokeWidth={1.2}
                    className="shrink-0 text-[#B7894A]"
                  />

                </div>

                

                <div className="mt-4 flex items-center justify-between">

                  <div className="flex items-center gap-2.5">

                    <span className="h-px w-8 bg-[#C9B79F]" />

                    <span className="text-[7px] uppercase text-bold tracking-[0.25em] text-[#876742]">
                      Designed with intention
                    </span>

                  </div>

                  <button
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-[#C4AA86]
                      bg-[#FDFBF8]
                      px-4
                      py-2
                      text-[7px]
                      font-semibold
                      uppercase
                      tracking-[0.17em]
                      text-[#574938]
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:border-[#A4773E]
                      hover:bg-[#EFE3D2]
                      hover:text-[#A4773E]
                      hover:shadow-[0_8px_20px_rgba(120,90,50,0.08)]
                    "
                  >
                    Discover our story

                    <ArrowRight
                      size={11}
                      strokeWidth={1.6}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </button>

                </div>

              </div>

            </div>

          </div>
        </div>

       

        <div className="mt-4 flex items-center justify-center gap-3">

          <span className="h-px w-10 bg-[#D8CCBC]" />

          <span className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#A49788]">
            Thoughtfully made for modern living
          </span>

          <span className="h-px w-10 bg-[#D8CCBC]" />

        </div>

      </div>
    </section>
  );
};

export default WhyTaksham;