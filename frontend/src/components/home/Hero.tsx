import hero1 from "../../assets/images/hero/hero-01.png";
import hero2 from "../../assets/images/hero/hero-02.png";
import hero3 from "../../assets/images/hero/hero-03.png";
import hero4 from "../../assets/images/hero/hero-04.png";
import hero5 from "../../assets/images/hero/hero-05.png";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const heroImages = [
  hero1,
  hero2,
  hero3,
  hero4,
  hero5,
];

const Hero = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide(
      (prev) => (prev + 1) % heroImages.length
    );
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        prev === 0
          ? heroImages.length - 1
          : prev - 1
    );
  };

  return (
    <>
      <section className="hidden lg:block relative h-150 overflow-hidden  bg-[#FAF8F5]">

        {/* Background Image */}

        <img
          key={currentSlide}
          src={heroImages[currentSlide]}
          alt="Luxury Interior"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            animate-[heroZoom_5s_linear_forwards]
          "
        />

        {/* Gradient Overlay */}

        <div
          className="
            pointer-events-none
            absolute
            inset-y-0
            left-0
            w-1/2
            bg-linear-to-r
            from-[#FAF8F5]
            via-[#FAF8F5]/95
            via-40%
            to-transparent
          "
        />

        {/* Hero Content */}

        <div className="relative z-20 flex h-full items-center">

          <div className="ml-10 max-w-130">

            <h1
              key={`title-${currentSlide}`}
              className="
                text-[72px]
                font-serif
                font-medium
                leading-[1.02]
                tracking-[-0.04em]
                text-[#1F1F1F]
                drop-shadow-[0_4px_18px_rgba(255,255,255,0.35)]
                animate-[fadeUp_.7s_ease]
              "
            >
              Create
              <br />
              your dream
              <br />
              home
            </h1>

            <p
              className="
                mt-10
                max-w-lg
                text-[20px]
                leading-8
                text-[#5D5B58]
                animate-[fadeUp_.9s_ease]
              "
            >
              Stylish furniture, smart storage and inspiring
              ideas for every room.
            </p>

            <div
              className="
                mt-10
                flex
                gap-4
                animate-[fadeUp_1.1s_ease]
              "
            >
              <button
                type="button"
                onClick={() =>
                  navigate("/products")
                }
                className="
                  rounded-xl
                  bg-[#111]
                  px-8
                  py-4
                  font-semibold
                  text-white
                  shadow-lg
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:bg-black
                  hover:shadow-2xl
                "
              >
                Shop Products
              </button>

            <button
              type="button"
              onClick={() =>
                navigate("/rooms")
              }
              className="
                rounded-xl
                border
                border-[#D7CEC2]
                bg-white/90
                px-8
                py-4
                font-semibold
                backdrop-blur
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-white
                hover:shadow-lg
              "
            >
              Explore Rooms
            </button>

            </div>

          </div>

        </div>

        {/* Premium Badge */}

        <div
          className="
            absolute
            right-10
            top-10
            rounded-2xl
            bg-[#556B50]/95
            px-6
            py-4
            shadow-2xl
            backdrop-blur-md
          "
        >
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/70">
            NEW ARRIVALS
          </p>

          <p className="mt-1 text-lg font-medium text-white">
            Just In
          </p>

        </div>

        {/* Premium Slider */}

        <div
          className="
            absolute
            bottom-8
            right-8
            z-30
            flex
            items-center
            gap-6
            rounded-full
            border
            border-white/40
            bg-white/70
            px-6
            py-3
            shadow-xl
            backdrop-blur-xl
          "
        >

          <span className="text-lg font-semibold tracking-[0.18em] text-[#222]">
            {String(currentSlide + 1).padStart(2, "0")}
          </span>

          <div className="relative h-0.5 w-28 overflow-hidden rounded-full bg-black/15">

            <div
              className="
                absolute
                left-0
                top-0
                h-full
                rounded-full
                bg-[#C8A86B]
                transition-all
                duration-700
              "
              style={{
                width: `${((currentSlide + 1) / heroImages.length) * 100}%`,
              }}
            />

          </div>

          <span className="text-lg tracking-[0.18em] text-[#777]">
            {String(heroImages.length).padStart(2, "0")}
          </span>

          <button
            onClick={prevSlide}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-[#DDD2C5]
              bg-white
              transition-all
              duration-300
              hover:-translate-x-1
              hover:shadow-lg
            "
          >
            <ArrowLeft size={18} />
          </button>

          <button
            onClick={nextSlide}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-[#DDD2C5]
              bg-white
              transition-all
              duration-300
              hover:translate-x-1
              hover:shadow-lg
            "
          >
            <ArrowRight size={18} />
          </button>
            </div>

      </section>




<section
  className="
    relative
    isolate
    h-72
    overflow-hidden
    bg-[#FAF8F5]
    sm:h-79
    lg:hidden
  "
>



  <img
    key={`mobile-hero-${currentSlide}`}
    src={heroImages[currentSlide]}
    alt="Luxury Interior"
    className="
      absolute
      inset-0
      h-full
      w-full
      object-cover
      object-[72%_center]
      animate-[heroZoom_5s_linear_forwards]
      sm:object-[68%_center]
    "
  />


  <div
    className="
      pointer-events-none
      absolute
      inset-0
      z-1
      bg-[#B89568]/[0.035]
      mix-blend-multiply
    "
  />

  

  <div
    className="
      pointer-events-none
      absolute
      inset-y-0
      left-0
      z-10
      w-[62%]
      bg-linear-to-r
      from-[#FAF8F5]
      via-[#FAF8F5]/98
      via-55%
      to-transparent
      sm:w-[58%]
    "
  />


  <div
    className="
      pointer-events-none
      absolute
      -left-16
      top-1/2
      z-10
      h-70
      w-70
      -translate-y-1/2
      rounded-full
      bg-[#E8D6BA]/20
      blur-[65px]
    "
  />



  <div
    className="
      pointer-events-none
      absolute
      inset-x-0
      bottom-0
      z-10
      h-16
      bg-linear-t-to-t
      from-[#FAF8F5]/70
      to-transparent
    "
  />



  <div
    className="
      absolute
      inset-y-0
      left-0
      z-20
      flex
      w-[46%]
      items-center
      px-4
      sm:w-[44%]
      sm:px-6
    "
  >

    <div className="relative w-full">

      {/* Decorative vertical accent */}

      <div
        className="
          absolute
          -left-4
          top-0
          h-14.5
          w-0.5
          rounded-full
          bg-linear-to-b
          from-[#B7894A]
          to-transparent
          sm:-left-5
        "
      />



      <div
        key={`label-${currentSlide}`}
        className="
          mb-2
          flex
          items-center
          gap-1.5
          animate-[fadeUp_.5s_ease]
        "
      >

        <span className="h-px w-5 bg-[#B7894A]" />

        <span
          className="
            text-[6px]
            font-semibold
            uppercase
            tracking-[0.24em]
            text-[#96703D]
            sm:text-[7px]
          "
        >
          Taksham Interiors
        </span>

      </div>


      <h1
        key={`mobile-title-${currentSlide}`}
        className="
          font-serif
          text-[27px]
          font-medium
          leading-[0.96]
          tracking-[-0.052em]
          text-[#201E1B]
          drop-shadow-[0_2px_10px_rgba(255,255,255,0.35)]
          animate-[fadeUp_.65s_ease]
          sm:text-[32px]
        "
      >
        Create your
        <br />
        dream
        <br />
        <span className="text-[#9A7138]">
          home.
        </span>
      </h1>


      <p
        key={`mobile-description-${currentSlide}`}
        className="
          mt-2.5
          max-w-44
          text-[8px]
          leading-[1.55]
          text-[#625C54]
          sm:max-w-50
          sm:text-[9px]
        "
      >
        Stylish furniture, smart storage and inspiring ideas
        for every room.
      </p>

    

      <div
        className="
          mt-3
          flex
          gap-1.5
          animate-[fadeUp_.9s_ease]
        "
      >

        {/* Primary */}

        <button
          type="button"
          onClick={() =>
            navigate("/products")
          }
          className="
            group
            flex
            h-8
            items-center
            justify-center
            gap-1
            rounded-[7px]
            bg-[#8F6B3F]
            px-3
            text-[7px]
            font-semibold
            text-white
            shadow-[0_7px_18px_rgba(143,107,63,0.24)]
            transition-all
            duration-300
            hover:bg-[#795832]
            hover:shadow-[0_9px_22px_rgba(143,107,63,0.30)]
            active:scale-95
            sm:h-9
            sm:px-3.5
            sm:text-[8px]
          "
        >
          Shop Products

          <ArrowRight
            size={9}
            strokeWidth={1.8}
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
          navigate("/rooms")
        }
        className="
          flex
          h-8
          items-center
          justify-center
          rounded-[7px]
          border
          border-[#CDBB9F]
          bg-[#FBF6EE]/90
          px-3
          text-[7px]
          font-semibold
          text-[#634B30]
          shadow-[0_5px_14px_rgba(80,60,40,0.06)]
          backdrop-blur-md
          transition-all
          duration-300
          hover:border-[#B89460]
          hover:bg-[#F3E7D6]
          active:scale-95
          sm:h-9
          sm:px-3.5
          sm:text-[8px]
        "
      >
        Explore Rooms
      </button>

      </div>

    </div>

  </div>


  <div
    className="
      absolute
      right-4
      top-4
      z-20
      rounded-full
      border
      border-white/50
      bg-white/65
      px-2.5
      py-1.5
      shadow-[0_5px_18px_rgba(60,45,30,0.08)]
      backdrop-blur-md
    "
  >

    <div className="flex items-center gap-1.5">

      <span className="h-1.5 w-1.5 rounded-full bg-[#B7894A]" />

      <span
        className="
          text-[6px]
          font-semibold
          uppercase
          tracking-[0.18em]
          text-[#665A4B]
        "
      >
        New Arrivals
      </span>

    </div>

  </div>


  <div
    className="
      absolute
      bottom-3
      right-4
      z-30
      flex
      items-center
      gap-2
      rounded-full
      border
      border-white/60
      bg-[#FBF8F3]/80
      px-2.5
      py-1.5
      shadow-[0_8px_24px_rgba(58,45,31,0.12)]
      backdrop-blur-xl
      sm:bottom-4
      sm:right-6
      sm:px-3
      sm:py-2
    "
  >

    {/* Current */}

    <span
      className="
        font-serif
        text-[12px]
        font-medium
        text-[#2A251F]
        sm:text-[14px]
      "
    >
      {String(currentSlide + 1).padStart(2, "0")}
    </span>

    {/* Progress */}

    <div
      className="
        relative
        h-0.5
        w-9
        overflow-hidden
        rounded-full
        bg-[#D7CABB]
        sm:w-12
      "
    >

      <div
        className="
          absolute
          inset-y-0
          left-0
          rounded-full
          bg-[#B7894A]
          shadow-[0_0_8px_rgba(183,137,74,0.35)]
          transition-all
          duration-700
          ease-out
        "
        style={{
          width: `${((currentSlide + 1) / heroImages.length) * 100}%`,
        }}
      />

    </div>

    {/* Total */}

    <span
      className="
        text-[7px]
        font-medium
        tracking-[0.12em]
        text-[#8B8176]
        sm:text-[9px]
      "
    >
      {String(heroImages.length).padStart(2, "0")}
    </span>

    {/* Previous */}

    <button
      onClick={prevSlide}
      aria-label="Previous slide"
      className="
        ml-0.5
        flex
        h-6
        w-6
        items-center
        justify-center
        rounded-full
        border
        border-[#D7C9B7]
        bg-[#FFFDF9]
        text-[#675A4B]
        shadow-sm
        transition-all
        duration-300
        hover:border-[#B7894A]
        hover:text-[#9A7138]
        active:scale-90
        sm:h-7
        sm:w-7
      "
    >
      <ArrowLeft
        size={11}
        strokeWidth={1.7}
      />
    </button>

    {/* Next */}

    <button
      onClick={nextSlide}
      aria-label="Next slide"
      className="
        flex
        h-6
        w-6
        items-center
        justify-center
        rounded-full
        bg-[#8F6B3F]
        text-white
        shadow-[0_4px_12px_rgba(143,107,63,0.22)]
        transition-all
        duration-300
        hover:bg-[#795832]
        active:scale-90
        sm:h-7
        sm:w-7
      "
    >
      <ArrowRight
        size={11}
        strokeWidth={1.7}
      />
    </button>

  </div>

</section>

    </>
  );
};

export default Hero;