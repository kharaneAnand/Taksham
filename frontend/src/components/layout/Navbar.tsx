import {
  Heart,
  Menu,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import Navigation from "./Navigation";
import { useState } from "react";


const Navbar = () => {
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <>
      <header className="hidden lg:block w-full border-b border-[#ECE8E2] bg-white">
        <div className="mx-auto flex h-20 max-w-8xl items-center px-6">

          {/* Logo */}

          <div className="shrink-0 cursor-pointer">
            <h1 className="text-[40px] font-semibold leading-none tracking-tight">
              तक्षम्
            </h1>

            <p className="mt-1 pl-0.5 text-[12px] tracking-[0.45em] text-neutral-500">
              TAKSHAM
            </p>
          </div>

          {/* Right Section */}

          <div className="ml-10 flex flex-1 items-center gap-4">

            {/* Categories */}

            <button
              className="
                flex
                h-11
                items-center
                gap-2
                rounded-xl
                bg-[#F4E4C8]
                px-6
                text-[14px]
                font-bold
                hover:bg-[#EEDAB8]
              "
            >
              <Menu size={18} />
              Categories
            </button>

            {/* Search */}

            <div className="flex-1">
              <div
                className="
                  flex
                  h-11
                  items-center
                  rounded-xl
                  border
                  border-[#E8E2D8]
                  bg-white
                  px-4
                "
              >
                <Search
                  size={20}
                  className="text-neutral-500"
                />

                <input
                  type="text"
                  placeholder="Search for products, rooms and more..."
                  className="
                    ml-3
                    w-full
                    bg-transparent
                    text-sm
                    outline-none
                    placeholder:text-neutral-400
                  "
                />
              </div>
            </div>

            {/* Book Consultation */}

            <button
              className="
                flex
                h-11
                items-center
                gap-2
                rounded-xl
                border
                border-[#E8E2D8]
                bg-white
                px-6
                text-[14px]
                font-bold
                transition
                hover:bg-[#F8F5F0]
              "
            >
              <Search size={16} />
              Book Consultation
            </button>

            {/* Wishlist */}

            <button
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                transition
                hover:bg-[#F8F5F0]
              "
            >
              <Heart size={22} />
            </button>

            {/* Cart */}

            <button
              className="
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                transition
                hover:bg-[#F8F5F0]
              "
            >
              <ShoppingCart size={22} />

              <span
                className="
                  absolute
                  -right-1
                  top-0
                  flex
                  h-5
                  w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-[#E8B63D]
                  text-[10px]
                  font-semibold
                  text-black
                "
              >
                0
              </span>
            </button>

          </div>

        </div>
        <Navigation />
      </header>

      <div className="lg:hidden bg-[#FAF8F5]">

        {/* Mobile Top Bar */}

        <div className="relative flex h-17 items-center justify-between px-4">

          {/* Menu */}

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}

          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <h1 className="text-[28px] font-semibold leading-none tracking-tight">
              तक्षम्
            </h1>

            <p className="mt-1 text-[7px] tracking-[0.4em] text-neutral-500">
              TAKSHAM
            </p>
          </div>

          {/* Wishlist + Cart */}

          <div className="flex items-center gap-1">

            <button
              aria-label="Wishlist"
              className="flex h-10 w-10 items-center justify-center rounded-xl"
            >
              <Heart size={20} />
            </button>

            <button
              aria-label="Shopping Cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl"
            >
              <ShoppingCart size={20} />

              <span
                className="
                  absolute
                  right-0
                  top-0
                  flex
                  h-4
                  w-4
                  items-center
                  justify-center
                  rounded-full
                  bg-[#E8B63D]
                  text-[8px]
                  font-semibold
                  text-black
                "
              >
                0
              </span>
            </button>

          </div>

        </div>

        {/* Mobile Search */}

        <div className="px-4 pb-3">

          <div
            className="
              flex
              h-11
              items-center
              rounded-xl
              border
              border-[#E8E2D8]
              bg-white
              px-3.5
            "
          >
            <Search
              size={18}
              className="text-neutral-500"
            />

            <input
              type="text"
              placeholder="Search for products, rooms and more..."
              className="
                ml-2.5
                w-full
                bg-transparent
                text-[12px]
                outline-none
                placeholder:text-neutral-400
              "
            />

          </div>

        </div>

        {/* Mobile Menu */}

        {mobileMenuOpen && (
          <div className="border-t border-[#E8E2D8] bg-[#FAF8F5] px-5 pb-6">

            {[
              "Shop by Room",
              "Shop by Product",
              "Collections",
              "Ideas & Inspiration",
              "Interior Services",
              "Projects",
              "Offers",
            ].map((item) => (
              <button
                key={item}
                onClick={() => setMobileMenuOpen(false)}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  border-b
                  border-[#EAE4DC]
                  py-4
                  text-left
                  text-[14px]
                  font-medium
                  text-[#38342F]
                "
              >
                {item}

                <span className="text-[#A4773E]">
                  →
                </span>
              </button>
            ))}

            <button
              className="
                mt-5
                flex
                h-12
                w-full
                items-center
                justify-center
                rounded-xl
                bg-[#181715]
                text-[12px]
                font-semibold
                text-white
              "
            >
              Book Consultation
            </button>

          </div>
        )}

      </div>
    </>
  );
};

export default Navbar;