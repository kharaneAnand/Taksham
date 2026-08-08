import hero1 from "../../../assets/images/hero/hero-01.png";
import hero2 from "../../../assets/images/hero/hero-02.png";
import hero3 from "../../../assets/images/hero/hero-03.png";
import hero4 from "../../../assets/images/hero/hero-04.png";
import hero5 from "../../../assets/images/hero/hero-05.png";

import { useEffect, useState } from "react";

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
    <section className="relative h-140 overflow-hidden  bg-[#FAF8F5]">

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
  );
};

export default Hero;