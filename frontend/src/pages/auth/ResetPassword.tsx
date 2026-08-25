import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
} from "lucide-react";

import {
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import AuthService from "../../services/auth.service";

const ResetPassword = () => {
  const navigate = useNavigate();

  const { token } =
    useParams<{ token: string }>();

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!token) {
      toast.error(
        "This password reset link is invalid.",
      );
      return;
    }

    if (!password || !confirmPassword) {
      toast.error(
        "Please fill in both password fields.",
      );
      return;
    }

    if (password.length < 6) {
      toast.error(
        "Password must be at least 6 characters long.",
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error(
        "Passwords do not match.",
      );
      return;
    }

    try {
      setLoading(true);

      await AuthService.resetPassword(
        token,
        {
          password,
        },
      );

      toast.success(
        "Password reset successfully. Please sign in.",
      );

      navigate(
        "/login",
        {
          replace: true,
        },
      );
    } catch (error: any) {
      toast.error(
        error?.message ||
          error?.response?.data?.message ||
          "Unable to reset your password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      <div className="mx-auto grid min-h-screen max-w-350 lg:grid-cols-2">

        {/* =============================================
            EDITORIAL SIDE
        ============================================= */}

        <section className="relative hidden overflow-hidden lg:block">

          <div className="absolute inset-0 bg-[#29251F]" />

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
              opacity-60
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-linear-to-br
              from-[#171512]/85
              via-[#29251F]/55
              to-[#171512]/90
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -left-20
              top-1/3
              h-80
              w-80
              rounded-full
              bg-[#B7894A]/10
              blur-[100px]
            "
          />

          <div
            className="
              relative
              z-10
              flex
              h-full
              flex-col
              justify-between
              p-14
              xl:p-20
            "
          >

            {/* Brand */}

            <Link
              to="/"
              className="w-fit"
            >
              <div
                className="
                  font-serif
                  text-[34px]
                  leading-none
                  tracking-[-0.055em]
                  text-white
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

            {/* Main content */}

            <div className="max-w-125">

              <div
                className="
                  mb-5
                  flex
                  items-center
                  gap-3
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
                    tracking-[0.3em]
                    text-[#D3AA73]
                  "
                >
                  Secure your account
                </span>
              </div>

              <h1
                className="
                  font-serif
                  text-[54px]
                  font-medium
                  leading-[0.94]
                  tracking-[-0.055em]
                  text-white
                  xl:text-[68px]
                "
              >
                Create a new
                <br />

                <span className="text-[#E0C49C]">
                  beginning.
                </span>
              </h1>

              <p
                className="
                  mt-6
                  max-w-105
                  text-[13px]
                  leading-6
                  text-white/60
                "
              >
                Choose a new password to secure your
                Taksham account and continue creating
                beautiful spaces.
              </p>

            </div>

            {/* Footer */}

            <div
              className="
                flex
                items-center
                gap-3
                text-white/40
              "
            >
              <Check
                size={14}
                strokeWidth={1.5}
              />

              <span
                className="
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.2em]
                "
              >
                Secure account recovery
              </span>
            </div>

          </div>

        </section>


        {/* =============================================
            RESET PASSWORD FORM
        ============================================= */}

        <section
          className="
            flex
            min-h-screen
            items-center
            justify-center
            px-6
            py-10
            sm:px-10
            lg:px-14
            xl:px-20
          "
        >

          <div className="w-full max-w-110">

            {/* Mobile Brand */}

            <Link
              to="/"
              className="
                mb-10
                inline-block
                lg:hidden
              "
            >
              <div
                className="
                  font-serif
                  text-[30px]
                  leading-none
                  tracking-[-0.055em]
                  text-[#29251F]
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
                  tracking-[0.36em]
                  text-[#978D82]
                "
              >
                Furniture & Interiors
              </div>
            </Link>


            {/* Header */}

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
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.28em]
                  text-[#A4773E]
                "
              >
                Reset password
              </p>
            </div>

            <h1
              className="
                mt-4
                font-serif
                text-[42px]
                font-medium
                leading-[0.95]
                tracking-[-0.045em]
                text-[#29251F]
                sm:text-[50px]
              "
            >
              Create a new
              <br />
              password.
            </h1>

            <p
              className="
                mt-5
                max-w-105
                text-[12px]
                leading-6
                text-[#81776C]
              "
            >
              Your new password should be different from
              your previous password and easy for you to
              remember securely.
            </p>


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="
                mt-9
                space-y-5
              "
            >

              {/* New Password */}

              <div>

                <label
                  htmlFor="password"
                  className="
                    mb-2
                    block
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-[#5C534A]
                  "
                >
                  New password
                </label>

                <div className="relative">

                  <Lock
                    size={16}
                    strokeWidth={1.4}
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
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value,
                      )
                    }
                    placeholder="Create a new password"
                    disabled={loading}
                    className="
                      h-13
                      w-full
                      rounded-xl
                      border
                      border-[#DDD4C8]
                      bg-white
                      pl-11
                      pr-12
                      text-[13px]
                      text-[#302B25]
                      outline-none
                      transition-all
                      placeholder:text-[#B1A89E]
                      hover:border-[#C8B79F]
                      focus:border-[#A4773E]
                      focus:ring-4
                      focus:ring-[#A4773E]/8
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value,
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
                      right-3
                      top-1/2
                      flex
                      h-8
                      w-8
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-lg
                      text-[#8D8378]
                      transition
                      hover:bg-[#F4EFE8]
                    "
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                </div>

              </div>


              {/* Confirm Password */}

              <div>

                <label
                  htmlFor="confirmPassword"
                  className="
                    mb-2
                    block
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-[#5C534A]
                  "
                >
                  Confirm new password
                </label>

                <div className="relative">

                  <KeyRound
                    size={16}
                    strokeWidth={1.4}
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
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value,
                      )
                    }
                    placeholder="Repeat your new password"
                    disabled={loading}
                    className="
                      h-13
                      w-full
                      rounded-xl
                      border
                      border-[#DDD4C8]
                      bg-white
                      pl-11
                      pr-12
                      text-[13px]
                      text-[#302B25]
                      outline-none
                      transition-all
                      placeholder:text-[#B1A89E]
                      hover:border-[#C8B79F]
                      focus:border-[#A4773E]
                      focus:ring-4
                      focus:ring-[#A4773E]/8
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) => !value,
                      )
                    }
                    disabled={loading}
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      flex
                      h-8
                      w-8
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-lg
                      text-[#8D8378]
                      transition
                      hover:bg-[#F4EFE8]
                    "
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                </div>

              </div>


              {/* Password hint */}

              <p
                className="
                  text-[10px]
                  leading-5
                  text-[#9A9086]
                "
              >
                Use at least 6 characters for your new
                password.
              </p>


              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  mt-2
                  flex
                  h-13
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  bg-[#29251F]
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-white
                  shadow-[0_12px_30px_rgba(45,37,29,0.12)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#3A342D]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
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

                    Resetting password...
                  </>
                ) : (
                  <>
                    Reset password

                    <ArrowRight
                      size={14}
                      strokeWidth={1.6}
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-0.5
                      "
                    />
                  </>
                )}
              </button>

            </form>


            {/* Back to login */}

            <div className="mt-8 text-center">

              <Link
                to="/login"
                className="
                  group
                  inline-flex
                  items-center
                  gap-2
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[#8A8075]
                  transition-colors
                  hover:text-[#A4773E]
                "
              >
                <ArrowLeft
                  size={13}
                  strokeWidth={1.5}
                  className="
                    transition-transform
                    duration-300
                    group-hover:-translate-x-0.5
                  "
                />

                Back to sign in
              </Link>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
};

export default ResetPassword;