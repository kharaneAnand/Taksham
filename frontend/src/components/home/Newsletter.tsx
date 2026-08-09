import {
  ArrowRight,
  Mail,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const Newsletter = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF8F4] py-8 sm:py-10 lg:py-12">
      <div className="mx-auto max-w-370 px-4 sm:px-6 lg:px-8 xl:px-10">

        {/* Main Editorial Card */}

        <div
          className="
            group
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-[#DCCFBE]
            bg-[#F1E8DB]
            shadow-[0_30px_90px_rgba(61,45,29,0.10)]
          "
        >

          {/* Ambient Glow */}

          <div className="pointer-events-none absolute -left-40 -top-40 h-130 w-130 rounded-full bg-[#D4A962]/20 blur-[130px]" />

          <div className="pointer-events-none absolute -bottom-52 -right-32 h-140 w-140 rounded-full bg-[#80684B]/15 blur-[140px]" />

          <div className="pointer-events-none absolute left-[48%] top-1/2 h-70 w-70 -translate-y-1/2 rounded-full bg-white/35 blur-[110px]" />

          {/* Large Background T */}

          <div
            className="
              pointer-events-none
              absolute
              -bottom-16
              -left-4
              select-none
              font-serif
              text-[180px]
              font-medium
              leading-none
              tracking-[-0.08em]
              text-[#8C7455]/4.5
              sm:text-[240px]
              lg:text-[300px]
            "
          >
            T
          </div>

          {/* Inner Frame */}

          <div className="pointer-events-none absolute inset-3 rounded-[23px] border border-white/40" />

          <div className="pointer-events-none absolute inset-3 rounded-[19px] border border-[#CDBB9F]/20" />

          {/* Content */}

          <div className="relative z-10 grid lg:grid-cols-[0.9fr_1.1fr]">


            <div
              className="
                relative
                flex
                min-h-85
                flex-col
                justify-center
                px-6
                py-9
                sm:px-10
                sm:py-11
                lg:min-h-97.5
                lg:px-12
                xl:px-16
              "
            >

              {/* Eyebrow */}

              <div className="flex items-center gap-3">

                <span className="h-px w-10 bg-[#B7894A]" />

                <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#A4773E]">
                  The Taksham Journal
                </span>

              </div>

              {/* Main Heading */}

              <h2
                className="
                  mt-5
                  max-w-140
                  font-serif
                  text-[40px]
                  font-medium
                  leading-[0.96]
                  tracking-[-0.045em]
                  text-[#211F1C]
                  sm:text-[50px]
                  lg:text-[54px]
                  xl:text-[58px]
                "
              >
                Bring more beauty
                <br />
                <span className="text-[#967A57]">
                  home.
                </span>
              </h2>

              {/* Description */}

              <p
                className="
                  mt-5
                  max-w-450
                  text-[12px]
                  leading-6
                  text-[#71685E]
                  sm:text-[13px]
                "
              >
                New collections, considered interiors, thoughtful
                design ideas and pieces worth discovering — delivered
                occasionally, never excessively.
              </p>

              {/* Editorial Metadata */}

              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-[#D3C0A5]
                    bg-white/40
                    px-3.5
                    py-2
                    backdrop-blur-md
                  "
                >
                  <Sparkles
                    size={12}
                    strokeWidth={1.3}
                    className="text-[#A4773E]"
                  />

                  <span className="text-[9px] font-medium text-[#6E5C48]">
                    Curated inspiration
                  </span>
                </div>

                <span className="text-[10px] text-[#A99A87]">
                  No noise
                </span>

                <span className="h-3 w-px bg-[#D1C2AE]" />

                <span className="text-[10px] text-[#A99A87]">
                  Just beautiful spaces
                </span>

              </div>

              {/* Vertical Detail */}

              <div className="pointer-events-none absolute bottom-8 right-8 hidden flex-col items-center gap-2 lg:flex">

                <span className="font-serif text-[16px] text-[#A68A65]">
                  01
                </span>

                <span className="h-12 w-px bg-[#CDBBA2]" />

                <span className="text-[9px] tracking-[0.2em] text-[#A49788]">
                  02
                </span>

              </div>

            </div>

            <div
              className="
                relative
                flex
                items-center
                bg-[#FCFAF7]/85
                px-5
                py-8
                sm:px-9
                sm:py-9
                lg:px-10
                lg:py-10
                xl:px-14
              "
            >

              {/* Corner */}

              <div
                className="
                  pointer-events-none
                  absolute
                  right-0
                  top-0
                  h-36
                  w-36
                  rounded-bl-[140px]
                  border-b
                  border-l
                  border-[#E2D4C2]
                "
              />

              <div className="pointer-events-none absolute right-7 top-7 hidden sm:block">
                <ArrowUpRight
                  size={18}
                  strokeWidth={1.2}
                  className="text-[#B79A73]"
                />
              </div>

              <div className="relative w-full max-w-162.5">

                {/* Form Intro */}

                <div className="flex items-start justify-between gap-5">

                  <div>

                    <div className="flex items-center gap-2">

                      <span className="h-2 w-2 rounded-full bg-[#B7894A]" />

                      <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#A4773E]">
                        A private invitation
                      </span>

                    </div>

                    <h3
                      className="
                        mt-3
                        font-serif
                        text-[27px]
                        font-medium
                        leading-[1.05]
                        tracking-[-0.035em]
                        text-[#342E27]
                        sm:text-[31px]
                        lg:text-[34px]
                      "
                    >
                      Your next favourite piece
                      <br />
                      <span className="text-[#987B57]">
                        might be waiting.
                      </span>
                    </h3>

                  </div>

                  {/* Mail Icon */}

                  <div
                    className="
                      hidden
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#D7C4AA]
                      bg-[#F7EEE2]
                      shadow-sm
                      sm:flex
                    "
                  >
                    <Mail
                      size={19}
                      strokeWidth={1.2}
                      className="text-[#96754A]"
                    />
                  </div>

                </div>


                <div className="my-5 flex items-center gap-3">

                  <span className="h-px flex-1 bg-[#DDD1C2]" />

                  <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#AA9D8D]">
                    TAKSHAM
                  </span>

                  <span className="h-px flex-1 bg-[#DDD1C2]" />

                </div>

                {/* Form */}

                <form className="flex flex-col gap-3 sm:flex-row">

                  {/* Email */}

                  <div
                    className="
                      group/input
                      flex
                      h-14
                      min-w-0
                      flex-1
                      items-center
                      rounded-[15px]
                      border
                      border-[#D8CCBE]
                      bg-white
                      px-4
                      shadow-[0_6px_25px_rgba(68,51,34,0.05)]
                      transition-all
                      duration-300
                      focus-within:border-[#B7894A]
                      focus-within:shadow-[0_10px_35px_rgba(135,98,54,0.11)]
                    "
                  >

                    <Mail
                      size={17}
                      strokeWidth={1.3}
                      className="
                        mr-3
                        shrink-0
                        text-[#A09689]
                        transition-colors
                        duration-300
                        group-focus-within/input:text-[#A4773E]
                      "
                    />

                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="
                        w-full
                        bg-transparent
                        text-[13px]
                        text-[#292622]
                        outline-none
                        placeholder:text-[#AAA096]
                      "
                    />

                  </div>

                  {/* CTA */}

                  <button
                    type="submit"
                    className="
                      group/button
                      relative
                      flex
                      h-14
                      shrink-0
                      items-center
                      justify-center
                      gap-3
                      overflow-hidden
                      rounded-[15px]
                      border
                      border-[#987343]
                      bg-[#A4773E]
                      px-7
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-white
                      shadow-[0_10px_30px_rgba(128,94,49,0.2)]
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:bg-[#8F6938]
                      hover:shadow-[0_14px_38px_rgba(128,94,49,0.26)]
                      active:translate-y-0
                    "
                  >

                    {/* Shine */}

                    <span
                      className="
                        pointer-events-none
                        absolute
                        -left-10
                        top-0
                        h-full
                        w-8
                        rotate-20
                        bg-white/20
                        blur-sm
                        transition-transform
                        duration-700
                        group-hover/button:translate-x-42.5
                      "
                    />

                    <span className="relative z-10">
                      Join the edit
                    </span>

                    <ArrowRight
                      size={14}
                      strokeWidth={1.5}
                      className="
                        relative
                        z-10
                        transition-transform
                        duration-300
                        group-hover/button:translate-x-1
                      "
                    />

                  </button>

                </form>

                {/* Trust Details */}

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">

                  <div className="flex items-center gap-2">

                    <span className="h-1.5 w-1.5 rounded-full bg-[#A4773E]" />

                    <span className="text-[10px] text-[#81776B]">
                      No spam
                    </span>

                  </div>

                  <span className="h-3 w-px bg-[#D8CCBF]" />

                  <span className="text-[10px] text-[#81776B]">
                    New collection previews
                  </span>

                  <span className="h-3 w-px bg-[#D8CCBF]" />

                  <span className="text-[10px] text-[#81776B]">
                    Design inspiration
                  </span>

                </div>

                {/* Philosophy */}

                <div
                  className="
                    mt-6
                    flex
                    items-center
                    justify-between
                    gap-4
                    rounded-[15px]
                    border
                    border-[#E2D6C7]
                    bg-[#F8F1E7]
                    px-5
                    py-3.5
                  "
                >

                  <div>

                    <p className="text-[8px] font-semibold uppercase tracking-[0.24em] text-[#A4773E]">
                      The philosophy
                    </p>

                    <p className="mt-1.5 font-serif text-[15px] leading-tight text-[#5A4E40] sm:text-[16px]">
                      Less noise. Better inspiration.
                    </p>

                  </div>

                  <Sparkles
                    size={17}
                    strokeWidth={1.2}
                    className="shrink-0 text-[#B7894A]"
                  />

                </div>

              </div>

            </div>

          </div>
        </div>


        <div className="mt-4 flex items-center justify-center gap-3">

          <span className="h-px w-9 bg-[#D7CBBB]" />

          <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-[#A49788]">
            Thoughtfully made for modern living
          </span>

          <span className="h-px w-9 bg-[#D7CBBB]" />

        </div>

      </div>
    </section>
  );
};

export default Newsletter;