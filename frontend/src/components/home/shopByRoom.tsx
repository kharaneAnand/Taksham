import { useState } from "react";

import { ArrowRight } from "lucide-react";

import livingRoom from "../../assets/images/rooms/living-room.png";
import bedroom from "../../assets/images/rooms/bedroom.png";
import kitchen from "../../assets/images/rooms/kitchen.png";
import diningRoom from "../../assets/images/rooms/diningroom.png";
import homeOffice from "../../assets/images/rooms/office.png";
import Study from "../../assets/images/rooms/Study.png";
import Balcony from "../../assets/images/rooms/Balcony.png";
import Entertainment from "../../assets/images/rooms/Entertainment.png";


import sofa from "../../assets/images/categories/sofa.png";
import chair from "../../assets/images/categories/chair.png";
import table from "../../assets/images/categories/Table.png";
import storage from "../../assets/images/categories/Storage.png";
import beds from "../../assets/images/categories/beds.png";
import lighting from "../../assets/images/categories/Lighting.png";
import decor from "../../assets/images/categories/Dacore.png";
import rugs from "../../assets/images/categories/Rugs.png";

import wardrobes from "../../assets/images/categories/wardrobes.png";
import dressers from "../../assets/images/categories/Dressers.png";
import sideTable from "../../assets/images/categories/sidetable.png";
import mirrors from "../../assets/images/categories/mirrors.png";
import curtains from "../../assets/images/categories/curtains.png";
import plants from "../../assets/images/categories/organizers.png";
import shelves from "../../assets/images/categories/shalves.png";
import organizers from "../../assets/images/categories/organizers.png";



const rooms = [
  {
    name: "Living Room",
    products: "234+ Products",
    image: livingRoom,
  },
  {
    name: "Bedroom",
    products: "178+ Products",
    image: bedroom,
  },
  {
    name: "Kitchen",
    products: "156+ Products",
    image: kitchen,
  },
  {
    name: "Dining Room",
    products: "132+ Products",
    image: diningRoom,
  },
  {
    name: "Home Office",
    products: "98+ Products",
    image: homeOffice,
  },
  {
    name: "Study & Library",
    products: "76+ Products",
    image: Study,
  },
  {
    name: "Balcony",
    products: "84+ Products",
    image: Balcony,
  },
  {
    name: "Entertainment Room",
    products: "92+ Products",
    image: Entertainment,
  },
];


const categories = [
  {
    name: "Sofas",
    image: sofa,
  },
  {
    name: "Chairs",
    image: chair,
  },
  {
    name: "Tables",
    image: table,
  },
  {
    name: "Storage",
    image: storage,
  },
  {
    name: "Beds",
    image: beds,
  },
  {
    name: "Lighting",
    image: lighting,
  },
  {
    name: "Decor",
    image: decor,
  },
  {
    name: "Rugs",
    image: rugs,
  },
  {
    name: "Wardrobes",
    image: wardrobes,
  },
  {
    name: "Dressers",
    image: dressers,
  },
  {
    name: "Side Tables",
    image: sideTable,
  },
  {
    name: "Mirrors",
    image: mirrors,
  },
  {
    name: "Curtains",
    image: curtains,
  },
  {
    name: "Plants",
    image: plants,
  },
  {
    name: "Shelves",
    image: shelves,
  },
  {
    name: "Organizers",
    image: organizers,
  },
];




const ShopByRoom = () => {

  const [showAllRooms, setShowAllRooms] = useState(false);

  const [showAllCategories, setShowAllCategories] =
    useState(false);


  const visibleRooms = showAllRooms
    ? rooms
    : rooms.slice(0, 6);


  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 8);


  return (
    <section className="bg-[#FAF8F5] py-12 sm:py-14">


      <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8">


        {/* Header */}

        <div className="mb-5 flex items-end justify-between">

          <div>

            <h2
              className="
                font-serif
                text-[25px]
                font-medium
                leading-none
                tracking-tight
                text-[#1E1D1B]
                sm:text-[28px]
              "
            >
              Shop by Room
            </h2>

          </div>


          <button
            onClick={() =>
              setShowAllRooms((prev) => !prev)
            }
            className="
              group
              flex
              items-center
              gap-1.5
              text-[11px]
              font-medium
              text-[#3A3733]
              transition-colors
              duration-300
              sm:text-[12px]
              hover:text-[#A47D3C]
            "
          >

            <span>
              {showAllRooms
                ? "View less"
                : "View all rooms"}
            </span>

            <ArrowRight
              size={13}
              strokeWidth={1.8}
              className={`
                transition-transform
                duration-300
                ${
                  showAllRooms
                    ? "rotate-180"
                    : "group-hover:translate-x-1"
                }
              `}
            />

          </button>

        </div>


        <div
          className="
            grid
            grid-cols-2
            gap-2.5
            sm:grid-cols-3
            lg:grid-cols-6
            lg:gap-3
            xl:gap-4
          "
        >

          {visibleRooms.map((room) => (

            <button
              key={room.name}
              className="
                group
                relative
                overflow-hidden
                rounded-[9px]
                border
                border-[#E5DED4]
                bg-white
                text-left
                transition-all
                duration-500
                ease-out
                hover:-translate-y-1
                hover:border-[#D8C5A8]
                hover:shadow-[0_14px_35px_rgba(58,46,34,0.10)]
              "
            >


              <div
                className="
                  relative
                  aspect-[0.86]
                  overflow-hidden
                  bg-[#F0ECE6]
                "
              >

                <img
                  src={room.image}
                  alt={room.name}
                  loading="lazy"
                  className="
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-[1.055]
                  "
                />


                {/* Soft Image Overlay */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-linear-to-t
                    from-black/10
                    via-transparent
                    to-transparent
                  "
                />


                {/* Hover Arrow */}

                <span
                  className="
                    absolute
                    bottom-2.5
                    right-2.5
                    flex
                    h-7
                    w-7
                    translate-y-2
                    items-center
                    justify-center
                    rounded-full
                    bg-white/95
                    text-[#292521]
                    opacity-0
                    shadow-[0_4px_15px_rgba(0,0,0,0.15)]
                    backdrop-blur-sm
                    transition-all
                    duration-300
                    group-hover:translate-y-0
                    group-hover:opacity-100
                  "
                >
                  <ArrowRight
                    size={13}
                    strokeWidth={1.8}
                  />
                </span>

              </div>


              {/* Room Details */}

              <div className="px-3 py-3">

                <h3
                  className="
                    text-[11px]
                    font-semibold
                    leading-tight
                    text-[#282623]
                    sm:text-[12px]
                    md:text-[13px]
                  "
                >
                  {room.name}
                </h3>

                <p
                  className="
                    mt-1
                    text-[9px]
                    font-medium
                    tracking-[0.01em]
                    text-[#888178]
                    sm:text-[10px]
                  "
                >
                  {room.products}
                </p>

              </div>


              {/* Bottom Gold Accent */}

              <span
                className="
                  absolute
                  bottom-0
                  left-0
                  h-0.5
                  w-0
                  bg-[#C49A5A]
                  transition-all
                  duration-500
                  group-hover:w-full
                "
              />

            </button>

          ))}

        </div>

      </div>


      <div
        className="
          mx-auto
          mt-12
          max-w-350
          px-4
          sm:mt-14
          sm:px-6
          lg:px-8
        "
      >


        {/* Header */}

        <div className="mb-5 flex items-end justify-between">

          <h2
            className="
              font-serif
              text-[25px]
              font-medium
              leading-none
              tracking-tight
              text-[#1E1D1B]
              sm:text-[28px]
            "
          >
            Popular Categories
          </h2>


          <button
            onClick={() =>
              setShowAllCategories((prev) => !prev)
            }
            className="
              group
              flex
              items-center
              gap-1.5
              text-[11px]
              font-medium
              text-[#3A3733]
              transition-colors
              duration-300
              sm:text-[12px]
              hover:text-[#A47D3C]
            "
          >

            <span>
              {showAllCategories
                ? "View less"
                : "View all categories"}
            </span>

            <ArrowRight
              size={13}
              strokeWidth={1.8}
              className={`
                transition-transform
                duration-300
                ${
                  showAllCategories
                    ? "rotate-180"
                    : "group-hover:translate-x-1"
                }
              `}
            />

          </button>

        </div>


   

        <div
          className="
            grid
            grid-cols-2
            gap-2.5
            sm:grid-cols-4
            lg:grid-cols-8
            lg:gap-3
            xl:gap-4
          "
        >

          {visibleCategories.map((category) => (

            <button
              key={category.name}
              className="
                group
                relative
                flex
                h-29.5
                flex-col
                items-center
                justify-end
                overflow-hidden
                rounded-[9px]
                border
                border-[#E5DED4]
                bg-[#F9F6F1]
                pb-3
                transition-all
                duration-500
                ease-out
                hover:-translate-y-1
                hover:border-[#D6C2A3]
                hover:bg-[#FFFDF9]
                hover:shadow-[0_14px_30px_rgba(58,46,34,0.10)]
                sm:h-32
              "
            >


              <span
                className="
                  pointer-events-none
                  absolute
                  left-1/2
                  top-1/2
                  h-20
                  w-20
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-[#EBDCC5]
                  opacity-0
                  blur-2xl
                  transition-opacity
                  duration-500
                  group-hover:opacity-30
                "
              />


              {/* Category Image */}

              <div
                className="
                  relative
                  flex
                  h-20.5
                  w-full
                  items-center
                  justify-center
                  overflow-hidden
                  sm:h-22.5
                "
              >

                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="
                    h-full
                    w-full
                    object-contain
                    px-2
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-[1.08]
                  "
                />

              </div>



              <span
                className="
                  relative
                  z-10
                  text-[10px]
                  font-medium
                  tracking-[0.01em]
                  text-[#302D29]
                  transition-colors
                  duration-300
                  sm:text-[11px]
                  group-hover:text-[#A47D3C]
                "
              >
                {category.name}
              </span>



              <span
                className="
                  absolute
                  bottom-0
                  left-1/2
                  h-0.5
                  w-0
                  -translate-x-1/2
                  bg-[#C49A5A]
                  transition-all
                  duration-500
                  group-hover:w-9
                "
              />

            </button>

          ))}

        </div>

      </div>

    </section>
  );
};

export default ShopByRoom;