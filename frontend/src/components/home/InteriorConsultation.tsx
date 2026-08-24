import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import consultationImage from "../../assets/images/looks/interior-consultation.png";

const InteriorConsultation = () => {
  const navigate = useNavigate();
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF8F5] py-12 sm:py-14 lg:py-16">
      <div className="relative mx-auto max-w-370 px-4 sm:px-6 lg:px-8 xl:px-10">
        <div
          className="
            relative
            min-h-115
            overflow-hidden
            rounded-[26px]
            border
            border-white/10
            bg-[#302820]
            shadow-[0_30px_90px_rgba(30,20,10,0.18)]
            lg:min-h-125
          "
        >
          {/* Background Image */}

          <img
            src={consultationImage}
            alt="Taksham interior design consultation"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
          />

          {/* Overlays */}

          <div className="absolute inset-0 bg-linear-to-r from-[#1D1711]/90 via-[#1D1711]/65 to-[#1D1711]/10" />

          <div className="absolute inset-0 bg-linear-to-t from-[#17120E]/40 via-transparent to-transparent" />

          {/* Content */}

          <div className="relative z-10 flex min-h-115 items-center px-7 py-10 sm:px-10 lg:min-h-125 lg:px-16">
            <div className="max-w-145">
              <div className="flex items-center gap-3">
                <Sparkles
                  size={15}
                  strokeWidth={1.3}
                  className="text-[#D1B07A]"
                />

                <span className="text-[8px] font-semibold uppercase tracking-[0.34em] text-[#D1B07A]">
                  Interior Services
                </span>
              </div>

              <h2
                className="
                  mt-4
                  font-serif
                  text-[38px]
                  font-medium
                  leading-[0.98]
                  tracking-[-0.045em]
                  text-white
                  sm:text-[48px]
                  lg:text-[56px]
                "
              >
                Your dream space,
                <br />
                <span className="text-[#D8BC8B]">
                  designed around you.
                </span>
              </h2>

              <p
                className="
                  mt-5
                  max-w-120
                  text-[11px]
                  leading-6
                  text-white/65
                  sm:text-[12px]
                "
              >
                From a single room to an entire home, our design
                specialists help bring your vision together with
                thoughtful furniture, styling and space planning.
              </p>

              {/* CTA */}

              <button
              onClick={()=>navigate("/interior-services")}
                className="
                  group
                  mt-7
                  flex
                  items-center
                  gap-3
                  rounded-full
                  bg-white
                  px-6
                  py-3.5
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[#33291F]
                  shadow-[0_12px_35px_rgba(0,0,0,0.18)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#F4E8D7]
                "
              >
                Book a Consultation

                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#6B5138] text-white">
                  <ArrowRight
                    size={12}
                    strokeWidth={1.6}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </span>
              </button>

              {/* Small reassurance */}

              <div className="mt-6 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D1B07A]" />

                <span className="text-[8px] tracking-[0.08em] text-white/45">
                  Personalised guidance · Thoughtful design · Expert support
                </span>
              </div>
            </div>
          </div>

          {/* Decorative Number */}

          <div className="absolute bottom-6 right-7 hidden items-center gap-3 sm:flex">
            <span className="text-[8px] uppercase tracking-[0.25em] text-white/35">
              Design your space
            </span>

            <span className="h-px w-10 bg-white/20" />

            <span className="font-serif text-[18px] text-white/45">
              01
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteriorConsultation;