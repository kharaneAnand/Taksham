import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight , ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const loggedInUser = await login({
        email: email.trim(),
        password,
      });

      toast.success("Welcome back!");

      if (loggedInUser.role === "admin") {
        navigate("/admin", {
          replace: true,
        });
      } else {
        navigate("/", {
          replace: true,
        });
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.message ||
        "Unable to login. Please check your credentials.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <main className="min-h-screen w-full overflow-hidden bg-[#F8F5F0]">
    <div className="grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">



      <section className="relative hidden overflow-hidden bg-[#29251F] lg:flex">

        {/* Background Image */}

        <img
          src="/src/assets/images/hero/hero-03.png"
          alt="Taksham interiors"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            object-center
            opacity-[0.78]
            transition-transform
            duration-2000
            hover:scale-[1.025]
          "
        />

        {/* Warm overlay */}

        <div
          className="
            absolute
            inset-0
            bg-linear-to-br
            from-[#171512]/80
            via-[#24201B]/45
            to-[#171512]/90
          "
        />

        {/* Soft warm glow */}

        <div
          className="
            pointer-events-none
            absolute
            -left-24
            top-1/3
            h-72
            w-72
            rounded-full
            bg-[#B7894A]/10
            blur-[90px]
          "
        />

        {/* Decorative line */}

        <div
          className="
            absolute
            bottom-0
            left-1/2
            top-0
            hidden
            w-px
            -translate-x-1/2
            bg-linear-to-b
            from-transparent
            via-white/10
            to-transparent
            xl:block
          "
        />

        {/* Content */}

        <div
          className="
            relative
            z-10
            flex
            w-full
            flex-col
            justify-between
            p-10
            xl:p-14
            2xl:p-16
          "
        >


          <Link
            to="/"
            className="
              group
              w-fit
              transition-opacity
              duration-300
              hover:opacity-85
            "
          >
            <div
              className="
                font-serif
                text-[32px]
                leading-none
                tracking-[-0.055em]
                text-white
                xl:text-[36px]
              "
            >
              TAKSHAM
            </div>

            <div
              className="
                mt-1.5
                text-[7px]
                font-medium
                uppercase
                tracking-[0.38em]
                text-white/55
              "
            >
              Furniture & Interiors
            </div>
          </Link>


          <div className="max-w-xl">

            {/* Small label */}

            <div
              className="
                mb-5
                flex
                items-center
                gap-2.5
              "
            >
              <span
                className="
                  h-px
                  w-8
                  bg-[#C69A5B]
                "
              />

              <span
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.32em]
                  text-[#D3AA73]
                "
              >
                Welcome Home
              </span>
            </div>

            {/* Heading */}

            <h1
              className="
                max-w-145
                font-serif
                text-[54px]
                font-medium
                leading-[0.91]
                tracking-[-0.055em]
                text-white
                xl:text-[68px]
                2xl:text-[74px]
              "
            >
              Spaces made
              <br />
              <span className="text-[#E0C49C]">
                for living.
              </span>
            </h1>

            {/* Description */}

            <p
              className="
                mt-6
                max-w-108
                text-[13px]
                leading-6
                text-white/60
                xl:text-[14px]
              "
            >
              Discover thoughtfully designed furniture and
              interiors created to make everyday living feel
              a little more beautiful.
            </p>

            {/* Bottom detail */}

            <div
              className="
                mt-8
                flex
                items-center
                gap-4
              "
            >
              <div className="flex -space-x-2">
                <span
                  className="
                    h-7
                    w-7
                    rounded-full
                    border-2
                    border-[#29251F]
                    bg-[#C8B49A]
                  "
                />

                <span
                  className="
                    h-7
                    w-7
                    rounded-full
                    border-2
                    border-[#29251F]
                    bg-[#9E8668]
                  "
                />

                <span
                  className="
                    h-7
                    w-7
                    rounded-full
                    border-2
                    border-[#29251F]
                    bg-[#665744]
                  "
                />
              </div>

              <span
                className="
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-white/45
                "
              >
                Thoughtfully designed spaces
              </span>
            </div>
          </div>

          {/* Decorative number */}

          <span
            className="
              absolute
              bottom-12
              right-12
              font-serif
              text-[90px]
              leading-none
              tracking-[-0.08em]
              text-white/5.5
              select-none
              xl:right-16
            "
          >
            01
          </span>
        </div>
      </section>



      <section
        className="
          relative
          flex
          min-h-screen
          items-center
          justify-center
          overflow-hidden
          px-5
          py-8
          sm:px-8
          sm:py-12
          lg:px-12
          xl:px-20
        "
      >


        <div
          className="
            pointer-events-none
            absolute
            inset-x-0
            top-0
            h-53
            overflow-hidden
            lg:hidden
          "
        >
          <img
            src="/src/assets/images/hero/hero-03.png"
            alt=""
            className="
              h-full
              w-full
              object-cover
              object-center
              opacity-35
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-linear-to-b
              from-[#EDE4D7]/20
              via-[#F8F5F0]/60
              to-[#F8F5F0]
            "
          />
        </div>


        <div
          className="
            relative
            z-10
            w-full
            max-w-118
          "
        >


          <div
            className="
              mb-10
              flex
              items-center
              justify-between
              lg:hidden
            "
          >

            <Link
              to="/"
              className="
                inline-block
                transition-opacity
                hover:opacity-75
              "
            >
              <span
                className="
                  block
                  font-serif
                  text-[30px]
                  leading-none
                  tracking-[-0.055em]
                  text-[#29251F]
                "
              >
                TAKSHAM
              </span>

              <span
                className="
                  mt-1.5
                  block
                  text-[7px]
                  font-medium
                  uppercase
                  tracking-[0.36em]
                  text-[#978D82]
                "
              >
                Furniture & Interiors
              </span>
            </Link>

            <span
              className="
                font-serif
                text-[30px]
                text-[#B7894A]/20
              "
            >
              तक्षम्
            </span>
          </div>



          <div
            className="
              rounded-[26px]
              border
              border-[#E4DCD2]
              bg-[#FCFAF7]/90
              p-6
              shadow-[0_20px_60px_rgba(63,49,34,0.06)]
              backdrop-blur-xl
              sm:rounded-[30px]
              sm:p-8
              lg:border-0
              lg:bg-transparent
              lg:p-0
              lg:shadow-none
              lg:backdrop-blur-none
            "
          >

            <div>

              <div
                className="
                  flex
                  items-center
                  gap-2.5
                "
              >
                <span
                  className="
                    h-px
                    w-7
                    bg-[#B7894A]
                  "
                />

                <p
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.3em]
                    text-[#A4773E]
                    sm:text-[9px]
                  "
                >
                  Welcome Back
                </p>
              </div>

              <h2
                className="
                  mt-3
                  font-serif
                  text-[42px]
                  font-medium
                  leading-[0.95]
                  tracking-tighter
                  text-[#28241F]
                  sm:text-[48px]
                  lg:text-[54px]
                "
              >
                Sign in
              </h2>

              <p
                className="
                  mt-4
                  max-w-95
                  text-[12px]
                  leading-5
                  text-[#81776C]
                  sm:text-[13px]
                  sm:leading-6
                "
              >
                Sign in to continue to your Taksham account
                and keep creating beautiful spaces.
              </p>
            </div>



            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5 sm:mt-9"
            >


              <div>

                <label
                  htmlFor="email"
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.17em]
                    text-[#5F574F]
                  "
                >
                  Email Address

                  <span
                    className="
                      normal-case
                      tracking-normal
                      text-[8px]
                      font-normal
                      text-[#A69C91]
                    "
                  >
                    Required
                  </span>
                </label>

                <div className="relative">

                  <Mail
                    size={16}
                    strokeWidth={1.45}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-[#A4773E]
                    "
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                    className="
                      h-14
                      w-full
                      rounded-[14px]
                      border
                      border-[#DDD4C8]
                      bg-white/90
                      pl-11
                      pr-4
                      text-[13px]
                      font-medium
                      text-[#302B25]
                      outline-none
                      transition-all
                      duration-300
                      placeholder:text-[#B2A99F]
                      hover:border-[#C8B79F]
                      hover:shadow-[0_5px_18px_rgba(70,55,40,0.035)]
                      focus:border-[#A4773E]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#A4773E]/10
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />
                </div>
              </div>



              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.17em]
                      text-[#5F574F]
                    "
                  >
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="
                      text-[9px]
                      font-medium
                      text-[#A4773E]
                      transition-colors
                      hover:text-[#76552F]
                    "
                  >
                    Forgot password?
                  </Link>

                </div>

                <div className="relative">

                  <Lock
                    size={16}
                    strokeWidth={1.45}
                    className="
                      pointer-events-none
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-[#A4773E]
                    "
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                    className="
                      h-14
                      w-full
                      rounded-[14px]
                      border
                      border-[#DDD4C8]
                      bg-white/90
                      pl-11
                      pr-12
                      text-[13px]
                      font-medium
                      text-[#302B25]
                      outline-none
                      transition-all
                      duration-300
                      placeholder:text-[#B2A99F]
                      hover:border-[#C8B79F]
                      hover:shadow-[0_5px_18px_rgba(70,55,40,0.035)]
                      focus:border-[#A4773E]
                      focus:bg-white
                      focus:ring-4
                      focus:ring-[#A4773E]/10
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous,
                      )
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="
                      absolute
                      right-2.5
                      top-1/2
                      flex
                      h-9
                      w-9
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-[10px]
                      text-[#8F857A]
                      transition-all
                      duration-200
                      hover:bg-[#F4EFE8]
                      hover:text-[#51483F]
                      active:scale-95
                    "
                  >
                    {showPassword ? (
                      <EyeOff
                        size={16}
                        strokeWidth={1.5}
                      />
                    ) : (
                      <Eye
                        size={16}
                        strokeWidth={1.5}
                      />
                    )}
                  </button>
                </div>
              </div>


              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  relative
                  mt-2
                  flex
                  h-14
                  w-full
                  items-center
                  justify-center
                  gap-3
                  overflow-hidden
                  rounded-[14px]
                  bg-[#8F6B3F]
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-white
                  shadow-[0_12px_30px_rgba(143,107,63,0.20)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#795832]
                  hover:shadow-[0_18px_35px_rgba(143,107,63,0.24)]
                  active:translate-y-0
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {/* Button shine */}

                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    -left-1/2
                    w-1/3
                    skew-x-[-20deg]
                    bg-white/10
                    transition-all
                    duration-700
                    group-hover:left-[120%]
                  "
                />

                {loading ? (
                  <>
                    <span
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/30
                        border-t-white
                      "
                    />

                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In

                    <ArrowRight
                      size={15}
                      strokeWidth={1.5}
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    />
                  </>
                )}
              </button>
            </form>



            <div className="mt-7 text-center">

              <p
                className="
                  text-[11px]
                  text-[#81776C]
                  sm:text-[12px]
                "
              >
                Don't have an account?{" "}

                <Link
                  to="/register"
                  className="
                    font-semibold
                    text-[#A4773E]
                    underline-offset-4
                    transition-all
                    hover:text-[#76552F]
                    hover:underline
                  "
                >
                  Create one
                </Link>
              </p>

            </div>




            <div
              className="
                mt-9
                flex
                items-center
                gap-4
              "
            >
              <div className="h-px flex-1 bg-[#E4DCD2]" />

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span className="h-1 w-1 rounded-full bg-[#B7894A]/60" />

                <span
                  className="
                    text-[7px]
                    font-medium
                    uppercase
                    tracking-[0.25em]
                    text-[#A69C91]
                  "
                >
                  Taksham
                </span>

                <span className="h-1 w-1 rounded-full bg-[#B7894A]/60" />
              </div>

              <div className="h-px flex-1 bg-[#E4DCD2]" />
            </div>


            <div className="mt-5 text-center">

              <Link
                to="/"
                className="
                  group
                  inline-flex
                  items-center
                  gap-2
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-[#8A8075]
                  transition-colors
                  hover:text-[#A4773E]
                "
              >
                <ArrowLeft
                  size={12}
                  strokeWidth={1.4}
                  className="
                    transition-transform
                    duration-300
                    group-hover:-translate-x-0.5
                  "
                />

                Continue Shopping
              </Link>

            </div>

          </div>
        </div>
      </section>
    </div>
  </main>
);
};

export default Login;