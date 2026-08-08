import { useState } from "react";

import {
  ArrowRight,
  Heart,
  ShoppingBag,
  Check,
} from "lucide-react";

import lookImage from "../../assets/images/looks/living-room-look.png";
import sofa from "../../assets/images/looks/sofa.png";
import table from "../../assets/images/looks/Coffee Table.png";
import lamp from "../../assets/images/looks/lamp.png";
import chair from "../../assets/images/looks/chair.png";
import pot from "../../assets/images/looks/pot.png";
import rug from "../../assets/images/looks/rug.png";



const lookProducts = [
  {
    id: 1,
    name: "Luna 3 Seater Sofa",
    category: "Seating",
    price: "₹29,990",
    image: sofa,
    position: "left-[45%] top-[49%]",
  },
  {
    id: 2,
    name: "Stoccoma Coffee Table",
    category: "Tables",
    price: "₹14,990",
    image: table,
    position: "left-[48%] top-[72%]",
  },
  {
    id: 3,
    name: "Aira Pendant Lamp",
    category: "Lighting",
    price: "₹4,990",
    image: lamp,
    position: "left-[20%] top-[18%]",
  },
  {
    id: 4,
    name: "Lomals Accent Chair",
    category: "Seating",
    price: "₹5,490",
    image: chair,
    position: "left-[14%] top-[64%]",
  },
  {
    id: 5,
    name: "Lomals Natural Rug",
    category: "Rugs",
    price: "₹6,990",
    image: rug,
    position: "left-[69%] top-[80%]",
  },
  {
    id: 6,
    name: "Samela Plant Pot",
    category: "Decor",
    price: "₹1,490",
    image: pot,
    position: "left-[82%] top-[56%]",
  },
];



const ShopTheLook = () => {
 

  const [activeProduct, setActiveProduct] = useState(1);

  

  const [isProductView, setIsProductView] = useState(false);


  const selectedProduct =
    lookProducts.find(
      (product) => product.id === activeProduct
    ) ?? lookProducts[0];


  const handleSelectProduct = (id: number) => {
    setActiveProduct(id);
    setIsProductView(false);
  };

 

  const handleViewProduct = () => {
    setIsProductView(true);
  };


  const remainingProducts = lookProducts.filter(
    (product) => product.id !== activeProduct
  );

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-[#FAF8F4]
        py-14
        sm:py-16
        lg:py-20
      "
    >

      <div
        className="
          pointer-events-none
          absolute
          -left-48
          top-16
          h-105
          w-105
          rounded-full
          bg-[#E8D7BC]/20
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-48
          -bottom-25
          h-105
          w-105
          rounded-full
          bg-[#DCC6A4]/15
          blur-[120px]
        "
      />


      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-355
          px-4
          sm:px-6
          lg:px-8
          xl:px-10
        "
      >
        
        <div
          className="
            mb-7
            flex
            items-end
            justify-between
            gap-6
            sm:mb-8
            lg:mb-9
          "
        >
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#B7894A]" />

              <span
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.34em]
                  text-[#A4773E]
                  sm:text-[9px]
                "
              >
                Curated Interior
              </span>
            </div>

            <h2
              className="
                mt-2.5
                font-serif
                text-[32px]
                font-medium
                leading-[0.95]
                tracking-[-0.045em]
                text-[#211F1C]
                sm:text-[38px]
                lg:text-[42px]
              "
            >
              Shop the Look
            </h2>

            <p
              className="
                mt-2.5
                max-w-130
                text-[10px]
                leading-5
                text-[#83796D]
                sm:text-[12px]
              "
            >
              A thoughtfully composed space, brought together
              piece by piece.
            </p>
          </div>

          <button
            className="
              group
              hidden
              items-center
              gap-2
              border-b
              border-[#CDBA9E]
              pb-1
              text-[10px]
              font-medium
              text-[#423A31]
              transition-all
              duration-300
              hover:border-[#A4773E]
              hover:text-[#A4773E]
              sm:flex
            "
          >
            View all looks

            <ArrowRight
              size={13}
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
            overflow-hidden
            rounded-[26px]
            border
            border-[#E3D8CA]
            bg-[#FFFCF8]
            shadow-[0_28px_90px_rgba(64,49,32,0.09)]
            lg:rounded-[30px]
          "
        >
          <div
            className="
              grid
              items-stretch
              lg:grid-cols-[minmax(0,1.55fr)_minmax(380px,0.65fr)]
            "
          >

            <div
              className="
                relative
                min-w-0
                self-stretch
                overflow-hidden
                bg-[#EAE3D9]
              "
            >
              <div
                className="
                  relative
                  aspect-3/2
                  w-full
                  overflow-hidden
                  sm:aspect-16/10
                  lg:aspect-3/2
                "
              >
                {/* =================================================
                    ROOM VIEW
                ================================================= */}

                <div
                  className={`
                    absolute
                    inset-0
                    transition-all
                    duration-700
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${
                      isProductView
                        ? "scale-[0.96] opacity-0"
                        : "scale-100 opacity-100"
                    }
                  `}
                >
                  {/* Main room image */}

                  <img
                    src={lookImage}
                    alt="Curated living room interior"
                    className="
                      absolute
                      inset-0
                      h-full
                      w-full
                      object-cover
                      object-center
                    "
                  />

                  {/* Cinematic overlay */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-linear-to-t
                      from-[#21180F]/25
                      via-transparent
                      to-[#FFF9F0]/5
                    "
                  />

                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      bg-linear-to-r
                      from-black/[0.035]
                      via-transparent
                      to-black/2.5
                    "
                  />


                  <div
                    className="
                      absolute
                      left-4
                      top-4
                      flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-white/65
                      bg-white/65
                      px-3.5
                      py-2
                      shadow-[0_8px_25px_rgba(40,30,20,0.10)]
                      backdrop-blur-xl
                      sm:left-5
                      sm:top-5
                    "
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#B7894A]" />

                    <span
                      className="
                        text-[7px]
                        font-semibold
                        uppercase
                        tracking-[0.24em]
                        text-[#5E5040]
                        sm:text-[8px]
                      "
                    >
                      Living Collection
                    </span>
                  </div>


                  <div
                    className="
                      absolute
                      right-4
                      top-4
                      flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-white/55
                      bg-white/55
                      px-3
                      py-2
                      backdrop-blur-xl
                      sm:right-5
                      sm:top-5
                    "
                  >
                    <span className="text-[9px] font-semibold text-[#4E4438]">
                      {String(activeProduct).padStart(2, "0")}
                    </span>

                    <span className="h-px w-5 bg-[#8C7A65]/50" />

                    <span className="text-[9px] text-[#8C7A65]">
                      06
                    </span>
                  </div>


                  {lookProducts.map((product) => {
                    const isActive =
                      product.id === activeProduct;

                    return (
                      <button
                        key={product.id}
                        onClick={() =>
                          handleSelectProduct(product.id)
                        }
                        aria-label={`View ${product.name}`}
                        className={`
                          absolute
                          ${product.position}
                          z-30
                          -translate-x-1/2
                          -translate-y-1/2
                          outline-none
                        `}
                      >
                        {/* Outer active ring */}

                        <span
                          className={`
                            absolute
                            -inset-2.5
                            rounded-full
                            border
                            border-white
                            transition-all
                            duration-500
                            ${
                              isActive
                                ? "scale-100 opacity-100"
                                : "scale-75 opacity-0"
                            }
                          `}
                        />

                        {/* Soft pulse */}

                        {isActive && (
                          <span
                            className="
                              absolute
                              -inset-1
                              animate-ping
                              rounded-full
                              bg-[#B7894A]/20
                            "
                          />
                        )}

                        {/* Main hotspot */}

                        <span
                          className={`
                            relative
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-white
                            shadow-[0_7px_22px_rgba(64,43,20,0.28)]
                            transition-all
                            duration-300
                            sm:h-9
                            sm:w-9
                            ${
                              isActive
                                ? "scale-110 bg-[#B7894A]"
                                : "bg-[#B7894A]/90 hover:scale-110 hover:bg-[#A4773E]"
                            }
                          `}
                        >
                          {isActive ? (
                            <Check
                              size={13}
                              strokeWidth={2}
                              className="text-white"
                            />
                          ) : (
                            <span className="text-[8px] font-semibold text-white">
                              {String(product.id).padStart(
                                2,
                                "0"
                              )}
                            </span>
                          )}
                        </span>

                       

                        <span
                          className={`
                            pointer-events-none
                            absolute
                            bottom-11
                            left-1/2
                            w-max
                            max-w-47.5
                            -translate-x-1/2
                            rounded-[13px]
                            border
                            border-white/70
                            bg-[#FFFCF7]/95
                            px-3
                            py-2.5
                            text-left
                            shadow-[0_15px_40px_rgba(45,34,23,0.17)]
                            backdrop-blur-xl
                            transition-all
                            duration-300
                            ${
                              isActive
                                ? "translate-y-0 opacity-100"
                                : "translate-y-2 opacity-0"
                            }
                          `}
                        >
                          <span className="block text-[7px] uppercase tracking-[0.15em] text-[#A48662]">
                            {product.category}
                          </span>

                          <span className="mt-0.5 block text-[10px] font-semibold text-[#28241F]">
                            {product.name}
                          </span>

                          <span className="mt-0.5 block text-[9px] font-medium text-[#A4773E]">
                            {product.price}
                          </span>
                        </span>
                      </button>
                    );
                  })}


                  <div
                    className="
                      absolute
                      bottom-4
                      left-4
                      right-4
                      flex
                      items-center
                      justify-between
                      sm:bottom-5
                      sm:left-5
                      sm:right-5
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-white/55
                        bg-white/45
                        px-3
                        py-2
                        shadow-[0_5px_20px_rgba(40,30,20,0.08)]
                        backdrop-blur-md
                      "
                    >
                      {lookProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() =>
                            handleSelectProduct(product.id)
                          }
                          aria-label={`Select ${product.name}`}
                          className={`
                            h-1.5
                            rounded-full
                            transition-all
                            duration-500
                            ${
                              product.id === activeProduct
                                ? "w-5 bg-[#A4773E]"
                                : "w-1.5 bg-[#6D5C49]/40 hover:bg-[#6D5C49]/70"
                            }
                          `}
                        />
                      ))}
                    </div>

                    {/* Explore label */}

                    <div
                      className="
                        hidden
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-white/40
                        bg-black/10
                        px-3
                        py-2
                        text-[7px]
                        font-medium
                        uppercase
                        tracking-[0.16em]
                        text-white
                        backdrop-blur-md
                        sm:flex
                      "
                    >
                      <span className="h-1 w-1 rounded-full bg-white/80" />

                      Tap to explore
                    </div>
                  </div>
                </div>

               

                <div
                  className={`
                    absolute
                    inset-0
                    flex
                    flex-col
                    items-center
                    justify-center
                    overflow-hidden
                    bg-[#F3EEE6]
                    px-8
                    transition-all
                    duration-700
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                    ${
                      isProductView
                        ? "scale-100 opacity-100"
                        : "pointer-events-none scale-[1.04] opacity-0"
                    }
                  `}
                >
                  {/* Soft background glow */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      left-1/2
                      top-1/2
                      h-[55%]
                      w-[55%]
                      -translate-x-1/2
                      -translate-y-1/2
                      rounded-full
                      bg-[#D9C2A3]/20
                      blur-[70px]
                    "
                  />

                 

                  <button
                    onClick={() => setIsProductView(false)}
                    className="
                      absolute
                      left-5
                      top-5
                      z-30
                      flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-[#D8CCBD]
                      bg-white/75
                      px-3.5
                      py-2
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-[#5E5040]
                      shadow-[0_8px_25px_rgba(60,45,30,0.08)]
                      backdrop-blur-xl
                      transition-all
                      duration-300
                      hover:bg-white
                      hover:text-[#A4773E]
                    "
                  >
                    <ArrowRight
                      size={12}
                      strokeWidth={1.5}
                      className="rotate-180"
                    />

                    Back to room
                  </button>

                  {/* Product number */}

                  <div
                    className="
                      absolute
                      right-5
                      top-5
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#D8CCBD]
                      bg-white/65
                      backdrop-blur-xl
                    "
                  >
                    <span className="font-serif text-[11px] text-[#A4773E]">
                      {String(selectedProduct.id).padStart(
                        2,
                        "0"
                      )}
                    </span>
                  </div>

             

                  <div
                    className="
                      relative
                      flex
                      h-[58%]
                      w-[86%]
                      items-center
                      justify-center
                      sm:h-[64%]
                      sm:w-[76%]
                    "
                  >
                    {/* Ground shadow */}

                    <div
                      className="
                        absolute
                        bottom-[8%]
                        h-7
                        w-[55%]
                        rounded-full
                        bg-[#6E5942]/15
                        blur-2xl
                      "
                    />

                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="
                        relative
                        z-10
                        max-h-full
                        max-w-full
                        object-contain
                        drop-shadow-[0_25px_30px_rgba(62,45,29,0.14)]
                        transition-transform
                        duration-700
                      "
                    />
                  </div>

                 

                  <div className="relative z-20 mt-1 text-center">
                    <p
                      className="
                        text-[7px]
                        font-semibold
                        uppercase
                        tracking-[0.25em]
                        text-[#A4773E]
                      "
                    >
                      {selectedProduct.category}
                    </p>

                    <h3
                      className="
                        mt-1.5
                        font-serif
                        text-[22px]
                        tracking-[-0.035em]
                        text-[#29251F]
                        sm:text-[26px]
                      "
                    >
                      {selectedProduct.name}
                    </h3>

                    <p
                      className="
                        mt-1
                        text-[12px]
                        font-semibold
                        text-[#A4773E]
                      "
                    >
                      {selectedProduct.price}
                    </p>

                    <button
                      className="
                        group
                        mt-3
                        flex
                        items-center
                        gap-2
                        mx-auto
                        rounded-full
                        border
                        border-[#CDBA9E]
                        bg-white/65
                        px-4
                        py-2
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-[#5E5040]
                        backdrop-blur-md
                        transition-all
                        duration-300
                        hover:border-[#A4773E]
                        hover:bg-white
                        hover:text-[#A4773E]
                      "
                    >
                      View Details

                      <ArrowRight
                        size={11}
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
              </div>
            </div>


            <div
              className="
                flex
                min-w-0
                min-h-full
                flex-col
                justify-center
                bg-[#FDFBF8]
                p-5
                sm:p-6
                lg:p-6
                xl:p-7
              "
            >
            

              <div
                className="
                  flex
                  items-start
                  justify-between
                  border-b
                  border-[#E8DED2]
                  pb-4
                "
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#B7894A]" />

                    <p
                      className="
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[0.22em]
                        text-[#A4773E]
                      "
                    >
                      Complete the room
                    </p>
                  </div>

                  <h3
                    className="
                      mt-2
                      font-serif
                      text-[21px]
                      font-medium
                      tracking-[-0.03em]
                      text-[#29251F]
                      sm:text-[22px]
                    "
                  >
                    Items in this look
                  </h3>

                  <p className="mt-1 text-[9px] text-[#968B7F]">
                    Six pieces selected for this space
                  </p>
                </div>

                {/* Count */}

                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#DED0BD]
                    bg-[#F6EFE5]
                  "
                >
                  <span className="font-serif text-[12px] text-[#A4773E]">
                    06
                  </span>
                </div>
              </div>

              <div
                className="
                  relative
                  mt-4
                  overflow-hidden
                  rounded-[18px]
                  border
                  border-[#E5D8C8]
                  bg-[#F7F1E8]
                  p-2.5
                "
              >
                {/* Decorative glow */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-8
                    -top-8
                    h-24
                    w-24
                    rounded-full
                    bg-[#C49A61]/10
                    blur-2xl
                  "
                />

                <div className="relative flex items-center gap-3">
                  {/* Product thumbnail */}

                  <div
                    className="
                      h-15.5
                      w-15.5
                      shrink-0
                      overflow-hidden
                      rounded-[13px]
                      border
                      border-[#E0D3C3]
                      bg-[#EEE8DF]
                    "
                  >
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="
                        h-full
                        w-full
                        object-contain
                        p-1.5
                        transition-transform
                        duration-500
                      "
                    />
                  </div>

                  {/* Product information */}

                  <div className="min-w-0 flex-1">
                    <div
                      className="
                        flex
                        items-center
                        gap-1.5
                        text-[7px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-[#A4773E]
                      "
                    >
                      <span className="h-1 w-1 rounded-full bg-[#B7894A]" />

                      Selected piece
                    </div>

                    <p
                      className="
                        mt-1
                        truncate
                        font-serif
                        text-[13px]
                        text-[#29251F]
                      "
                    >
                      {selectedProduct.name}
                    </p>

                    <p className="mt-1 text-[10px] font-semibold text-[#A4773E]">
                      {selectedProduct.price}
                    </p>

                    <button
                      onClick={handleViewProduct}
                      className="
                        group
                        mt-2
                        flex
                        items-center
                        gap-1.5
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-widest
                        text-[#6B5138]
                        transition-colors
                        duration-300
                        hover:text-[#A4773E]
                      "
                    >
                      View product

                      <ArrowRight
                        size={11}
                        strokeWidth={1.5}
                        className="
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                      />
                    </button>
                  </div>

                  {/* Wishlist */}

                  <button
                    aria-label="Add selected product to wishlist"
                    className="
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#DCCDBA]
                      bg-white/70
                      text-[#806F5D]
                      transition-all
                      duration-300
                      hover:border-[#B7894A]
                      hover:bg-[#B7894A]
                      hover:text-white
                    "
                  >
                    <Heart
                      size={14}
                      strokeWidth={1.5}
                    />
                  </button>
                </div>
              </div>

              {/* =================================================
                  PRODUCT LIST
              ================================================= */}

              <div className="mt-3">
                {remainingProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() =>
                      handleSelectProduct(product.id)
                    }
                    className="
                      group
                      flex
                      w-full
                      items-center
                      gap-2.5
                      border-b
                      border-[#E9E0D5]
                      py-2.5
                      text-left
                      transition-all
                      duration-300
                      last:border-b-0
                      hover:rounded-[11px]
                      hover:bg-[#FAF6F0]
                      hover:px-2
                    "
                  >
                    {/* Number */}

                    <span
                      className="
                        flex
                        h-6
                        w-6
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#EEE7DE]
                        text-[7px]
                        font-semibold
                        text-[#877A6B]
                        transition-all
                        duration-300
                        group-hover:bg-[#E5D7C5]
                        group-hover:text-[#9A703A]
                      "
                    >
                      {String(product.id).padStart(2, "0")}
                    </span>

                    {/* Image */}

                    <div
                      className="
                        h-10
                        w-10
                        shrink-0
                        overflow-hidden
                        rounded-[9px]
                        border
                        border-[#E4DBD0]
                        bg-[#F1ECE5]
                      "
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="
                          h-full
                          w-full
                          object-contain
                          p-1
                          transition-transform
                          duration-500
                          group-hover:scale-110
                        "
                      />
                    </div>

                    {/* Details */}

                    <div className="min-w-0 flex-1">
                      <p
                        className="
                          truncate
                          text-[9px]
                          font-semibold
                          text-[#292622]
                          transition-colors
                          duration-300
                          group-hover:text-[#9A703A]
                          sm:text-[10px]
                        "
                      >
                        {product.name}
                      </p>

                      <p className="mt-0.5 text-[8px] text-[#978C80]">
                        {product.category}
                      </p>

                      <p className="mt-0.5 text-[9px] font-semibold text-[#A4773E]">
                        {product.price}
                      </p>
                    </div>

                    {/* Wishlist */}

                    <span
                      className="
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-[#887B6D]
                        transition-all
                        duration-300
                        group-hover:bg-[#F0E7DB]
                        group-hover:text-[#A4773E]
                      "
                    >
                      <Heart
                        size={13}
                        strokeWidth={1.5}
                      />
                    </span>
                  </button>
                ))}
              </div>

              {/* =================================================
                  COLLECTION FOOTER
              ================================================= */}

              <div
                className="
                  mt-4
                  border-t
                  border-[#E4DACD]
                  pt-4
                "
              >
                <div className="mb-3 flex items-end justify-between">
                  <div>
                    <p
                      className="
                        text-[7px]
                        uppercase
                        tracking-[0.17em]
                        text-[#968B7F]
                      "
                    >
                      Complete collection
                    </p>

                    <p className="mt-1 text-[9px] text-[#6F665C]">
                      6 pieces · One cohesive space
                    </p>
                  </div>

                  <p
                    className="
                      font-serif
                      text-[18px]
                      font-medium
                      text-[#29251F]
                    "
                  >
                    ₹63,940
                  </p>
                </div>

                {/* =================================================
                    ADD ALL TO CART
                ================================================= */}

                <button
                  className="
                    group
                    relative
                    flex
                    h-12
                    w-full
                    items-center
                    justify-center
                    gap-2
                    overflow-hidden
                    rounded-xl
                    bg-[#6B5138]
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.08em]
                    text-white
                    shadow-[0_10px_26px_rgba(91,67,43,0.17)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#5A422E]
                    hover:shadow-[0_15px_35px_rgba(91,67,43,0.23)]
                    active:translate-y-0
                  "
                >
                  {/* Shine */}

                  <span
                    className="
                      absolute
                      inset-y-0
                      -left-full
                      w-1/2
                      skew-x-[-20deg]
                      bg-white/10
                      transition-all
                      duration-700
                      group-hover:left-[120%]
                    "
                  />

                  <ShoppingBag
                    size={14}
                    strokeWidth={1.6}
                  />

                  <span>Add All to Cart</span>

                  <span className="text-white/35">
                    •
                  </span>

                  <span>06 Items</span>

                  <ArrowRight
                    size={13}
                    className="
                      ml-0.5
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </button>

                <p
                  className="
                    mt-2.5
                    text-center
                    text-[7px]
                    tracking-[0.04em]
                    text-[#9A9085]
                  "
                >
                  Thoughtfully selected for a beautifully
                  balanced home.
                </p>
              </div>
            </div>
          </div>
        </div>


        <div className="mt-4 flex justify-center sm:hidden">
          <button
            className="
              group
              flex
              items-center
              gap-2
              border-b
              border-[#CDBA9E]
              pb-1.5
              text-[9px]
              font-medium
              text-[#423A31]
            "
          >
            View all looks

            <ArrowRight
              size={12}
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
  );
};

export default ShopTheLook;