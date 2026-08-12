import {
  ChevronDown,
  Heart,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
  ArrowRight,
  Package,
  Settings,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Navigation from "./Navigation";

interface AuthUser {
  id?: string | number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;

  avatar?: {
    url?: string;
    publicId?: string;
  };

  profileImage?: string;
}

const API_BASE_URL = "http://localhost:5001";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [accountOpen, setAccountOpen] =
    useState(false);

  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  const accountRef = useRef<HTMLDivElement | null>(null);



  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/auth/me`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          },
        );

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();


        const currentUser =
          data?.user ??
          data?.data?.user ??
          data?.data ??
          data;

        if (
          currentUser &&
          typeof currentUser === "object"
        ) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(
          "Failed to fetch authenticated user:",
          error,
        );

        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    getCurrentUser();
  }, []);



  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent,
    ) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(
          event.target as Node,
        )
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);



  const displayName =
    user?.firstName ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "Account";

  const fullName = [
    user?.firstName,
    user?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const initials = (
    user?.firstName?.charAt(0) ||
    user?.name?.charAt(0) ||
    user?.email?.charAt(0) ||
    "U"
  ).toUpperCase();

  const avatar =
    user?.avatar?.url ||
    user?.profileImage ||
    "";

  const handleLogout = async () => {
    try {
      await fetch(
        `${API_BASE_URL}/api/v1/auth/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        },
      );
    } catch (error) {
      console.error(
        "Logout request failed:",
        error,
      );
    } finally {
      setUser(null);
      setAccountOpen(false);
      setMobileMenuOpen(false);

      window.location.href = "/";
    }
  };



  return (
    <>


      <header
        className="
          hidden
          w-full
          border-b
          border-[#ECE8E2]
          bg-[#FEFDFC]
          lg:block
        "
      >
        <div
          className="
            mx-auto
            flex
            h-20
            max-w-[1800px]
            items-center
            px-6
            xl:px-8
            2xl:px-10
          "
        >


          <div
            className="
              shrink-0
              cursor-pointer
              select-none
            "
          >
            <h1
              className="
                font-serif
                text-[40px]
                font-medium
                leading-none
                tracking-[-0.045em]
                text-[#25211D]
              "
            >
              तक्षम्
            </h1>

            <p
              className="
                mt-1
                pl-0.5
                text-[11px]
                font-medium
                tracking-[0.45em]
                text-[#8F867C]
              "
            >
              TAKSHAM
            </p>
          </div>


          <div
            className="
              ml-10
              flex
              min-w-0
              flex-1
              items-center
              gap-3
              xl:gap-4
            "
          >


            <button
              className="
                group
                flex
                h-11
                shrink-0
                items-center
                gap-2
                rounded-xl
                border
                border-[#E8D8BF]
                bg-[#F4E4C8]
                px-5
                text-[13px]
                font-semibold
                text-[#51432F]
                shadow-[0_4px_15px_rgba(100,75,40,0.05)]
                transition-all
                duration-300
                hover:border-[#D7BD98]
                hover:bg-[#EFDBB8]
                hover:shadow-[0_7px_20px_rgba(100,75,40,0.08)]
                active:scale-[0.98]
              "
            >
              <Menu
                size={17}
                strokeWidth={1.7}
              />

              Categories

              <ChevronDown
                size={14}
                strokeWidth={1.6}
                className="
                  transition-transform
                  duration-300
                  group-hover:translate-y-0.5
                "
              />
            </button>


            <div className="min-w-0 flex-1">
              <div
                className="
                  group
                  flex
                  h-11
                  items-center
                  rounded-xl
                  border
                  border-[#E8E2D8]
                  bg-white
                  px-4
                  shadow-[0_3px_12px_rgba(60,45,30,0.025)]
                  transition-all
                  duration-300
                  focus-within:border-[#C9A774]
                  focus-within:shadow-[0_5px_20px_rgba(120,90,50,0.06)]
                "
              >
                <Search
                  size={19}
                  strokeWidth={1.6}
                  className="
                    shrink-0
                    text-[#8E877F]
                    transition-colors
                    group-focus-within:text-[#A4773E]
                  "
                />

                <input
                  type="text"
                  placeholder="Search for products, rooms and more..."
                  className="
                    ml-3
                    min-w-0
                    w-full
                    bg-transparent
                    text-[13px]
                    text-[#302B25]
                    outline-none
                    placeholder:text-[#AAA39A]
                  "
                />
              </div>
            </div>


            <button
              className="
                flex
                h-11
                shrink-0
                items-center
                gap-2
                rounded-xl
                border
                border-[#E5DDD2]
                bg-white
                px-5
                text-[13px]
                font-semibold
                text-[#514940]
                shadow-[0_3px_12px_rgba(60,45,30,0.025)]
                transition-all
                duration-300
                hover:border-[#CDBA9F]
                hover:bg-[#F8F5F0]
                hover:text-[#8D683C]
                active:scale-[0.98]
              "
            >
              <Settings
                size={16}
                strokeWidth={1.5}
              />

              Book Consultation
            </button>


            <button
              aria-label="Wishlist"
              className="
                group
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                text-[#39342E]
                transition-all
                duration-300
                hover:bg-[#F8F5F0]
                hover:text-[#9A7138]
                active:scale-95
              "
            >
              <Heart
                size={21}
                strokeWidth={1.5}
                className="
                  transition-transform
                  duration-300
                  group-hover:scale-105
                "
              />
            </button>


            <button
              aria-label="Shopping Cart"
              className="
                group
                relative
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                text-[#39342E]
                transition-all
                duration-300
                hover:bg-[#F8F5F0]
                hover:text-[#9A7138]
                active:scale-95
              "
            >
              <ShoppingCart
                size={21}
                strokeWidth={1.5}
                className="
                  transition-transform
                  duration-300
                  group-hover:-translate-y-0.5
                "
              />

              <span
                className="
                  absolute
                  -right-0.5
                  -top-0.5
                  flex
                  h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  border-2
                  border-[#FEFDFC]
                  bg-[#B7894A]
                  px-1
                  text-[8px]
                  font-bold
                  text-white
                "
              >
                0
              </span>
            </button>


            <div
              ref={accountRef}
              className="
                relative
                ml-1
                shrink-0
              "
            >

              {authLoading ? (
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#E6DED4]
                    bg-[#F8F5F0]
                  "
                >
                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-[#D8C7AF]
                      border-t-[#A4773E]
                    "
                  />
                </div>
              ) : user ? (

                <button
                  type="button"
                  onClick={() =>
                    setAccountOpen(
                      (previous) =>
                        !previous,
                    )
                  }
                  className="
                    group
                    flex
                    h-11
                    items-center
                    gap-2.5
                    rounded-full
                    border
                    border-[#E5DDD3]
                    bg-[#F9F6F1]
                    py-1
                    pl-1
                    pr-3
                    shadow-[0_4px_14px_rgba(60,45,30,0.04)]
                    transition-all
                    duration-300
                    hover:border-[#CDB998]
                    hover:bg-[#F4EBDD]
                    active:scale-[0.98]
                  "
                >

                  {/* Avatar */}

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-full
                      border
                      border-white
                      bg-[#D8C1A0]
                      text-[11px]
                      font-semibold
                      text-[#5A452E]
                      shadow-sm
                    "
                  >
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={displayName}
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  <div className="max-w-25 text-left">
                    <p
                      className="
                        truncate
                        text-[11px]
                        font-semibold
                        leading-tight
                        text-[#39332C]
                      "
                    >
                      {displayName}
                    </p>

                    <p
                      className="
                        mt-0.5
                        text-[7px]
                        font-medium
                        uppercase
                        tracking-[0.12em]
                        text-[#A09487]
                      "
                    >
                      My Account
                    </p>
                  </div>

                  <ChevronDown
                    size={14}
                    strokeWidth={1.6}
                    className={`
                      text-[#827568]
                      transition-transform
                      duration-300
                      ${
                        accountOpen
                          ? "rotate-180"
                          : ""
                      }
                    `}
                  />
                </button>

              ) : (

                <a
                  href="/login"
                  className="
                    flex
                    h-11
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-[#DCCBB3]
                    bg-[#F7EFE2]
                    px-5
                    text-[11px]
                    font-semibold
                    uppercase
                    tracking-[0.13em]
                    text-[#6B5133]
                    shadow-[0_4px_14px_rgba(100,75,40,0.05)]
                    transition-all
                    duration-300
                    hover:border-[#BFA176]
                    hover:bg-[#EFE0CA]
                    hover:text-[#76552F]
                    active:scale-[0.98]
                  "
                >
                  <User
                    size={15}
                    strokeWidth={1.5}
                  />

                  Sign In
                </a>
              )}


              {user && accountOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-[calc(100%+12px)]
                    z-100
                    w-73
                    overflow-hidden
                    rounded-[20px]
                    border
                    border-[#E4D9CB]
                    bg-[#FEFCF9]
                    shadow-[0_22px_60px_rgba(58,43,28,0.14)]
                    animate-[fadeUp_.2s_ease-out]
                  "
                >

                  {/* User header */}

                  <div
                    className="
                      border-b
                      border-[#ECE4DA]
                      bg-[#F8F3EB]
                      p-4
                    "
                  >
                    <div className="flex items-center gap-3">

                      <div
                        className="
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          overflow-hidden
                          rounded-full
                          border-2
                          border-white
                          bg-[#D8C1A0]
                          text-[13px]
                          font-semibold
                          text-[#5A452E]
                          shadow-sm
                        "
                      >
                        {avatar ? (
                          <img
                            src={avatar}
                            alt={displayName}
                            className="
                              h-full
                              w-full
                              object-cover
                            "
                          />
                        ) : (
                          initials
                        )}
                      </div>

                      <div className="min-w-0">

                        <p
                          className="
                            truncate
                            font-serif
                            text-[18px]
                            font-medium
                            tracking-[-0.02em]
                            text-[#302A24]
                          "
                        >
                          {fullName ||
                            displayName}
                        </p>

                        <p
                          className="
                            mt-0.5
                            truncate
                            text-[9px]
                            text-[#91877C]
                          "
                        >
                          {user.email}
                        </p>

                      </div>

                    </div>
                  </div>

                  {/* Account links */}

                  <div className="p-2">

                    <a
                      href="/account"
                      className="
                        group
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        transition-all
                        duration-200
                        hover:bg-[#F7F1E8]
                      "
                    >
                      <span
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full
                          bg-[#EFE3D3]
                          text-[#8B693F]
                        "
                      >
                        <User
                          size={14}
                          strokeWidth={1.5}
                        />
                      </span>

                      <span className="flex-1">
                        <span
                          className="
                            block
                            text-[11px]
                            font-semibold
                            text-[#40382F]
                          "
                        >
                          My Account
                        </span>

                        <span
                          className="
                            mt-0.5
                            block
                            text-[8px]
                            text-[#9A9187]
                          "
                        >
                          Profile & preferences
                        </span>
                      </span>

                      <ArrowRight
                        size={13}
                        className="
                          text-[#B09C84]
                          transition-transform
                          duration-200
                          group-hover:translate-x-0.5
                        "
                      />
                    </a>

                    <a
                      href="/orders"
                      className="
                        group
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        transition-all
                        duration-200
                        hover:bg-[#F7F1E8]
                      "
                    >
                      <span
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full
                          bg-[#EFE3D3]
                          text-[#8B693F]
                        "
                      >
                        <Package
                          size={14}
                          strokeWidth={1.5}
                        />
                      </span>

                      <span className="flex-1">
                        <span
                          className="
                            block
                            text-[11px]
                            font-semibold
                            text-[#40382F]
                          "
                        >
                          My Orders
                        </span>

                        <span
                          className="
                            mt-0.5
                            block
                            text-[8px]
                            text-[#9A9187]
                          "
                        >
                          Track your purchases
                        </span>
                      </span>

                      <ArrowRight
                        size={13}
                        className="
                          text-[#B09C84]
                          transition-transform
                          duration-200
                          group-hover:translate-x-0.5
                        "
                      />
                    </a>

                    <a
                      href="/wishlist"
                      className="
                        group
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        transition-all
                        duration-200
                        hover:bg-[#F7F1E8]
                      "
                    >
                      <span
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full
                          bg-[#EFE3D3]
                          text-[#8B693F]
                        "
                      >
                        <Heart
                          size={14}
                          strokeWidth={1.5}
                        />
                      </span>

                      <span className="flex-1">
                        <span
                          className="
                            block
                            text-[11px]
                            font-semibold
                            text-[#40382F]
                          "
                        >
                          Wishlist
                        </span>

                        <span
                          className="
                            mt-0.5
                            block
                            text-[8px]
                            text-[#9A9187]
                          "
                        >
                          Your saved pieces
                        </span>
                      </span>

                      <ArrowRight
                        size={13}
                        className="
                          text-[#B09C84]
                          transition-transform
                          duration-200
                          group-hover:translate-x-0.5
                        "
                      />
                    </a>

                  </div>

                  {/* Logout */}

                  <div
                    className="
                      border-t
                      border-[#ECE4DA]
                      p-2
                    "
                  >
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-3
                        py-3
                        text-left
                        transition-all
                        duration-200
                        hover:bg-[#F8EDEA]
                      "
                    >
                      <span
                        className="
                          flex
                          h-8
                          w-8
                          items-center
                          justify-center
                          rounded-full
                          bg-[#F2E0DB]
                          text-[#9A6255]
                        "
                      >
                        <LogOut
                          size={14}
                          strokeWidth={1.5}
                        />
                      </span>

                      <span
                        className="
                          text-[11px]
                          font-semibold
                          text-[#8C5549]
                        "
                      >
                        Sign Out
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <Navigation />
      </header>


      {/* =====================================================
          MOBILE NAVBAR
      ===================================================== */}

      <div
        className="
          lg:hidden
          bg-[#FAF8F5]
        "
      >



        <div
          className="
            relative
            flex
            h-17
            items-center
            justify-between
            px-4
          "
        >

          {/* Menu */}

          <button
            onClick={() =>
              setMobileMenuOpen(
                (previous) =>
                  !previous,
              )
            }
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              text-[#39342E]
              transition-all
              duration-200
              hover:bg-[#F0EAE1]
              active:scale-95
            "
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X
                size={22}
                strokeWidth={1.7}
              />
            ) : (
              <Menu
                size={22}
                strokeWidth={1.7}
              />
            )}
          </button>



          <div
            className="
              absolute
              left-1/2
              -translate-x-1/2
              text-center
              select-none
            "
          >
            <h1
              className="
                font-serif
                text-[29px]
                font-medium
                leading-none
                tracking-[-0.04em]
                text-[#25211D]
              "
            >
              तक्षम्
            </h1>

            <p
              className="
                mt-1
                text-[7px]
                font-medium
                tracking-[0.4em]
                text-[#8D847B]
              "
            >
              TAKSHAM
            </p>
          </div>



          <div className="flex items-center gap-0.5">

            {/* Wishlist */}

            <button
              aria-label="Wishlist"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                text-[#39342E]
                transition-all
                duration-200
                hover:bg-[#F0EAE1]
                hover:text-[#9A7138]
                active:scale-95
              "
            >
              <Heart
                size={20}
                strokeWidth={1.5}
              />
            </button>


            {/* Cart */}

            <button
              aria-label="Shopping Cart"
              className="
                relative
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                text-[#39342E]
                transition-all
                duration-200
                hover:bg-[#F0EAE1]
                hover:text-[#9A7138]
                active:scale-95
              "
            >
              <ShoppingCart
                size={20}
                strokeWidth={1.5}
              />

              <span
                className="
                  absolute
                  right-0
                  top-0
                  flex
                  h-4
                  min-w-4
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#FAF8F5]
                  bg-[#B7894A]
                  px-0.5
                  text-[8px]
                  font-bold
                  text-white
                "
              >
                0
              </span>
            </button>


            {!authLoading && (
              user ? (
                <button
                  type="button"
                  onClick={() =>
                    setMobileMenuOpen(
                      true,
                    )
                  }
                  className="
                    ml-1
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-full
                    border-2
                    border-white
                    bg-[#D8C1A0]
                    text-[10px]
                    font-bold
                    text-[#5A452E]
                    shadow-sm
                    active:scale-95
                  "
                  aria-label="My account"
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={displayName}
                      className="
                        h-full
                        w-full
                        object-cover
                      "
                    />
                  ) : (
                    initials
                  )}
                </button>
              ) : (
                <a
                  href="/login"
                  aria-label="Sign in"
                  className="
                    ml-1
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-[#F1E4D2]
                    text-[#76572F]
                    transition-all
                    active:scale-95
                  "
                >
                  <User
                    size={18}
                    strokeWidth={1.5}
                  />
                </a>
              )
            )}

          </div>
        </div>




        <div className="px-4 pb-3">

          <div
            className="
              group
              flex
              h-11
              items-center
              rounded-xl
              border
              border-[#E8E2D8]
              bg-white
              px-3.5
              shadow-[0_3px_12px_rgba(60,45,30,0.025)]
              transition-all
              duration-300
              focus-within:border-[#C9A774]
              focus-within:shadow-[0_5px_18px_rgba(120,90,50,0.05)]
            "
          >
            <Search
              size={18}
              strokeWidth={1.6}
              className="
                shrink-0
                text-[#8E877F]
                group-focus-within:text-[#A4773E]
              "
            />

            <input
              type="text"
              placeholder="Search for products, rooms and more..."
              className="
                ml-2.5
                w-full
                bg-transparent
                text-[12px]
                text-[#302B25]
                outline-none
                placeholder:text-[#AAA39A]
              "
            />
          </div>
        </div>




        {mobileMenuOpen && (
          <div
            className="
              border-t
              border-[#E8E2D8]
              bg-[#FAF8F5]
              px-5
              pb-6
            "
          >



            {user && (
              <div
                className="
                  my-4
                  rounded-[18px]
                  border
                  border-[#E3D7C8]
                  bg-[#F5EBDD]
                  p-4
                "
              >
                <div className="flex items-center gap-3">

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-full
                      border-2
                      border-white
                      bg-[#D8C1A0]
                      text-[12px]
                      font-bold
                      text-[#5A452E]
                    "
                  >
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={displayName}
                        className="
                          h-full
                          w-full
                          object-cover
                        "
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  <div className="min-w-0">

                    <p
                      className="
                        font-serif
                        text-[18px]
                        font-medium
                        tracking-[-0.02em]
                        text-[#302A24]
                      "
                    >
                      {fullName ||
                        displayName}
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-[9px]
                        text-[#8F8275]
                      "
                    >
                      {user.email}
                    </p>

                  </div>

                </div>

                <div
                  className="
                    mt-4
                    grid
                    grid-cols-3
                    gap-2
                  "
                >
                  <a
                    href="/account"
                    className="
                      flex
                      flex-col
                      items-center
                      gap-1.5
                      rounded-[11px]
                      bg-white/65
                      py-2.5
                      text-[8px]
                      font-medium
                      text-[#625342]
                    "
                  >
                    <User
                      size={14}
                      strokeWidth={1.5}
                    />
                    Account
                  </a>

                  <a
                    href="/orders"
                    className="
                      flex
                      flex-col
                      items-center
                      gap-1.5
                      rounded-[11px]
                      bg-white/65
                      py-2.5
                      text-[8px]
                      font-medium
                      text-[#625342]
                    "
                  >
                    <Package
                      size={14}
                      strokeWidth={1.5}
                    />
                    Orders
                  </a>

                  <a
                    href="/wishlist"
                    className="
                      flex
                      flex-col
                      items-center
                      gap-1.5
                      rounded-[11px]
                      bg-white/65
                      py-2.5
                      text-[8px]
                      font-medium
                      text-[#625342]
                    "
                  >
                    <Heart
                      size={14}
                      strokeWidth={1.5}
                    />
                    Wishlist
                  </a>
                </div>
              </div>
            )}


            {/* =================================================
                NAVIGATION LINKS
            ================================================= */}

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
                onClick={() =>
                  setMobileMenuOpen(false)
                }
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
                  transition-colors
                  hover:text-[#A4773E]
                "
              >
                {item}

                <ArrowRight
                  size={15}
                  strokeWidth={1.5}
                  className="
                    text-[#A4773E]
                  "
                />
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
                gap-2
                rounded-xl
                bg-[#8F6B3F]
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-white
                shadow-[0_10px_25px_rgba(143,107,63,0.18)]
                transition-all
                duration-300
                hover:bg-[#795832]
                active:scale-[0.98]
              "
            >
              Book Consultation

              <ArrowRight
                size={13}
                strokeWidth={1.5}
              />
            </button>




            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="
                  mt-3
                  flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-[#E6D8D1]
                  bg-[#F9F1EE]
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[#925F53]
                  transition-all
                  hover:bg-[#F4E5E0]
                  active:scale-[0.98]
                "
              >
                <LogOut
                  size={14}
                  strokeWidth={1.5}
                />

                Sign Out
              </button>
            )}

          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;