import {
  ArrowRight,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

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

interface Room {
  id: string;
  name: string;
  products: string;
  image: string;
}

interface Category {
  name: string;
  image: string;
}

const rooms: Room[] = [
  {
    id: "living-room",
    name: "Living Room",
    products: "234+ Products",
    image: livingRoom,
  },
  {
    id: "bedroom",
    name: "Bedroom",
    products: "178+ Products",
    image: bedroom,
  },
  {
    id: "kitchen",
    name: "Kitchen",
    products: "156+ Products",
    image: kitchen,
  },
  {
    id: "dining-room",
    name: "Dining Room",
    products: "132+ Products",
    image: diningRoom,
  },
  {
    id: "home-office",
    name: "Home Office",
    products: "98+ Products",
    image: homeOffice,
  },
  {
    id: "study-library",
    name: "Study & Library",
    products: "76+ Products",
    image: Study,
  },
  {
    id: "balcony",
    name: "Balcony",
    products: "84+ Products",
    image: Balcony,
  },
  {
    id: "entertainment-room",
    name: "Entertainment Room",
    products: "92+ Products",
    image: Entertainment,
  },
];

const categories: Category[] = [
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
];

const Rooms = () => {
  const navigate =
    useNavigate();

  const handleRoomClick = (
    roomId: string,
  ) => {
    navigate(
      `/rooms/${roomId}`,
    );
  };

  const handleCategoryClick = (
    categoryName: string,
  ) => {
    navigate(
      `/products?category=${encodeURIComponent(
        categoryName.toLowerCase(),
      )}`,
    );
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* ========================================
          HERO
      ======================================== */}

      <section className="border-b border-[#E5DED4] bg-[#FAF8F5]">
        <div className="mx-auto max-w-350 px-4 pb-10 pt-8 sm:px-6 sm:pb-12 sm:pt-10 lg:px-8 lg:pb-16 lg:pt-14">
          {/* Breadcrumb */}

          <div className="mb-8 flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.14em] text-[#A3988B] sm:text-[10px]">
            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
              className="transition-colors hover:text-[#A47D3C]"
            >
              Home
            </button>

            <span>/</span>

            <span className="text-[#3A3733]">
              Rooms
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.2em] text-[#A47D3C] sm:text-[10px]">
                Curated spaces
              </p>

              <h1 className="font-serif text-[34px] font-medium leading-[1.05] tracking-tight text-[#1E1D1B] sm:text-[42px] lg:text-[50px]">
                Shop by Room
              </h1>
            </div>

            <div className="max-w-xl lg:justify-self-end">
              <p className="text-[12px] leading-6 text-[#777067] sm:text-[13px] sm:leading-7">
                Discover thoughtfully curated
                furniture and decor for every
                space in your home. Explore a
                room, find your style, and create
                a space that feels completely
                yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          ROOM COLLECTION
      ======================================== */}

      <section className="bg-[#FAF8F5] py-10 sm:py-12 lg:py-16">
        <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="mb-1 text-[8px] font-medium uppercase tracking-[0.17em] text-[#A3988B] sm:text-[9px]">
                Explore spaces
              </p>

              <h2 className="font-serif text-[24px] font-medium leading-none tracking-tight text-[#1E1D1B] sm:text-[28px]">
                Every room, beautifully
                considered.
              </h2>
            </div>

            <span className="hidden text-[10px] font-medium uppercase tracking-[0.14em] text-[#A3988B] sm:block">
              8 curated spaces
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-3 xl:gap-4">
            {rooms.map(
              (room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() =>
                    handleRoomClick(
                      room.id,
                    )
                  }
                  className="group relative overflow-hidden rounded-[9px] border border-[#E5DED4] bg-white text-left transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#D8C5A8] hover:shadow-[0_14px_35px_rgba(58,46,34,0.10)]"
                >
                  <div className="relative aspect-[0.86] overflow-hidden bg-[#F0ECE6]">
                    <img
                      src={room.image}
                      alt={room.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.055]"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/15 via-transparent to-transparent" />

                    <span className="absolute bottom-2.5 right-2.5 flex h-7 w-7 translate-y-2 items-center justify-center rounded-full bg-white/95 text-[#292521] opacity-0 shadow-[0_4px_15px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowRight
                        size={13}
                        strokeWidth={1.8}
                      />
                    </span>
                  </div>

                  <div className="px-3 py-3">
                    <h3 className="text-[11px] font-semibold leading-tight text-[#282623] sm:text-[12px] md:text-[13px]">
                      {room.name}
                    </h3>

                    <p className="mt-1 text-[9px] font-medium tracking-[0.01em] text-[#888178] sm:text-[10px]">
                      {room.products}
                    </p>
                  </div>

                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#C49A5A] transition-all duration-500 group-hover:w-full" />
                </button>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ========================================
          POPULAR CATEGORIES
      ======================================== */}

      <section className="border-t border-[#E5DED4] bg-[#F7F4EF] py-10 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="mb-1 text-[8px] font-medium uppercase tracking-[0.17em] text-[#A3988B] sm:text-[9px]">
                Furniture & decor
              </p>

              <h2 className="font-serif text-[24px] font-medium leading-none tracking-tight text-[#1E1D1B] sm:text-[28px]">
                Popular Categories
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
              className="group flex items-center gap-1.5 text-[10px] font-medium text-[#3A3733] transition-colors duration-300 hover:text-[#A47D3C] sm:text-[11px]"
            >
              <span>
                View all
              </span>

              <ArrowRight
                size={13}
                strokeWidth={1.8}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8 lg:gap-3 xl:gap-4">
            {categories.map(
              (category) => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() =>
                    handleCategoryClick(
                      category.name,
                    )
                  }
                  className="group relative flex h-29.5 flex-col items-center justify-end overflow-hidden rounded-[9px] border border-[#E5DED4] bg-[#F9F6F1] pb-3 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#D6C2A3] hover:bg-[#FFFDF9] hover:shadow-[0_14px_30px_rgba(58,46,34,0.10)] sm:h-32"
                >
                  <span className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EBDCC5] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30" />

                  <div className="relative flex h-20.5 w-full items-center justify-center overflow-hidden sm:h-22.5">
                    <img
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      className="h-full w-full object-contain px-2 transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                    />
                  </div>

                  <span className="relative z-10 text-[10px] font-medium tracking-[0.01em] text-[#302D29] transition-colors duration-300 group-hover:text-[#A47D3C] sm:text-[11px]">
                    {category.name}
                  </span>

                  <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-[#C49A5A] transition-all duration-500 group-hover:w-9" />
                </button>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ========================================
          INSPIRATION CTA
      ======================================== */}

      <section className="bg-[#FAF8F5]">
        <div className="mx-auto max-w-350 px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-18">
          <div className="relative overflow-hidden rounded-[10px] border border-[#E3DACE] bg-[#F1ECE4] px-6 py-10 sm:px-10 lg:px-14">
            <div className="relative z-10 max-w-xl">
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#A47D3C]">
                Need inspiration?
              </p>

              <h2 className="mt-3 font-serif text-[27px] font-medium leading-tight text-[#1E1D1B] sm:text-[34px]">
                Create a space that
                feels like you.
              </h2>

              <p className="mt-3 text-[11px] leading-6 text-[#777067] sm:text-[12px] sm:leading-7">
                Explore ideas, styling
                inspiration and thoughtfully
                designed spaces from Taksham.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/ideas")
                }
                className="group mt-6 flex items-center gap-2 text-[10px] font-medium text-[#3A3733] transition-colors hover:text-[#A47D3C] sm:text-[11px]"
              >
                Explore ideas

                <ArrowRight
                  size={14}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>

            <span className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full border border-[#D8C7AE]/40" />

            <span className="pointer-events-none absolute -bottom-20 right-16 h-44 w-44 rounded-full border border-[#D8C7AE]/30" />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Rooms;