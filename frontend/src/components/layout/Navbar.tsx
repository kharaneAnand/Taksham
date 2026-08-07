import {
  Heart,
  Menu,
  Search,
  ShoppingCart,
} from "lucide-react";
import Navigation from "./Navigation";


const Navbar = () => {
  return (
    <header className="w-full border-b border-[#ECE8E2] bg-white">
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
  );
};

export default Navbar;