import {
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

import {
  useState,
} from "react";
import type{FormEvent} from "react"

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";
import { AxiosError } from "axios";

import AuthService from "../../services/auth.service";

interface ApiErrorResponse {
  message?: string;
}

const Register = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !password ||
      !confirmPassword
    ) {
      toast.error(
        "Please fill in all the fields.",
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

      await AuthService.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });

      toast.success(
        "Account created successfully. Please sign in.",
      );

      navigate("/login", {
        replace: true,
      });

    } catch (error) {
      const axiosError =
        error as AxiosError<ApiErrorResponse>;

      const message =
        axiosError.response?.data?.message ||
        "Unable to create your account. Please try again.";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F5F0]">

      <div className="mx-auto grid min-h-screen max-w-350 lg:grid-cols-2">

        {/* =====================================================
            EDITORIAL SIDE
        ===================================================== */}

        <div className="relative hidden overflow-hidden lg:block">

          <div className="absolute inset-0 bg-[#30251B]" />

          <div className="absolute inset-0 bg-[url('/src/assets/images/products/dining-table.png')] bg-cover bg-center opacity-75" />

          <div className="absolute inset-0 bg-linear-to-r from-[#211A14]/85 via-[#211A14]/45 to-[#211A14]/20" />

          <div className="relative z-10 flex h-full flex-col justify-between p-14 xl:p-20">

            <div className="flex items-center gap-3">

              <Sparkles
                size={15}
                strokeWidth={1.3}
                className="text-[#D1B07A]"
              />

              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#D1B07A]">
                Taksham Living
              </span>

            </div>

            <div className="max-w-120">

              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#D1B07A]">
                Begin your journey
              </p>

              <h1 className="mt-5 font-serif text-[52px] font-medium leading-[0.98] tracking-[-0.045em] text-white xl:text-[64px]">
                Make space
                <br />
                <span className="text-[#D8BC8B]">
                  for what matters.
                </span>
              </h1>

              <p className="mt-6 max-w-105 text-[12px] leading-6 text-white/60">
                Create your Taksham account and discover
                furniture, interiors and ideas designed
                around the way you live.
              </p>

            </div>

            <p className="text-[8px] uppercase tracking-[0.25em] text-white/35">
              Thoughtful furniture · Beautiful living
            </p>

          </div>
        </div>

        {/* =====================================================
            REGISTER FORM
        ===================================================== */}

        <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-20">

          <div className="w-full max-w-110">

            {/* Mobile brand */}

            <div className="mb-9 lg:hidden">

              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#A4773E]">
                Taksham Living
              </p>

            </div>

            <div>

              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A4773E]">
                Create your account
              </p>

              <h2 className="mt-3 font-serif text-[40px] font-medium leading-none tracking-[-0.04em] text-[#29251F] sm:text-[48px]">
                Join Taksham
              </h2>

              <p className="mt-4 text-[12px] leading-5 text-[#81776C]">
                A more personal way to discover beautiful
                spaces and thoughtfully designed furniture.
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-4"
            >

              {/* Name */}

              <div className="grid grid-cols-2 gap-3">

                <div>

                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#5C534A]"
                  >
                    First name
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(
                        event.target.value,
                      )
                    }
                    placeholder="Anand"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[#DDD4C8]
                      bg-white
                      px-3.5
                      text-[13px]
                      text-[#302B25]
                      outline-none
                      transition-all
                      placeholder:text-[#B1A89E]
                      focus:border-[#A4773E]
                      focus:ring-4
                      focus:ring-[#A4773E]/8
                    "
                  />

                </div>

                <div>

                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#5C534A]"
                  >
                    Last name
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(event) =>
                      setLastName(
                        event.target.value,
                      )
                    }
                    placeholder="Kharane"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[#DDD4C8]
                      bg-white
                      px-3.5
                      text-[13px]
                      text-[#302B25]
                      outline-none
                      transition-all
                      placeholder:text-[#B1A89E]
                      focus:border-[#A4773E]
                      focus:ring-4
                      focus:ring-[#A4773E]/8
                    "
                  />

                </div>

              </div>

              {/* Email */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#5C534A]"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value,
                    )
                  }
                  placeholder="you@example.com"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-[#DDD4C8]
                    bg-white
                    px-3.5
                    text-[13px]
                    text-[#302B25]
                    outline-none
                    transition-all
                    placeholder:text-[#B1A89E]
                    focus:border-[#A4773E]
                    focus:ring-4
                    focus:ring-[#A4773E]/8
                  "
                />

              </div>

              {/* Phone */}

              <div>

                <label
                  htmlFor="phone"
                  className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#5C534A]"
                >
                  Phone number
                </label>

                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(
                      event.target.value,
                    )
                  }
                  placeholder="+91 98765 43210"
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-[#DDD4C8]
                    bg-white
                    px-3.5
                    text-[13px]
                    text-[#302B25]
                    outline-none
                    transition-all
                    placeholder:text-[#B1A89E]
                    focus:border-[#A4773E]
                    focus:ring-4
                    focus:ring-[#A4773E]/8
                  "
                />

              </div>

              {/* Password */}

              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#5C534A]"
                >
                  Password
                </label>

                <div className="relative">

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
                    placeholder="Create a password"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[#DDD4C8]
                      bg-white
                      px-3.5
                      pr-12
                      text-[13px]
                      text-[#302B25]
                      outline-none
                      transition-all
                      placeholder:text-[#B1A89E]
                      focus:border-[#A4773E]
                      focus:ring-4
                      focus:ring-[#A4773E]/8
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value,
                      )
                    }
                    aria-label="Toggle password visibility"
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#8D8378] hover:bg-[#F4EFE8]"
                  >
                    {showPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>

                </div>

              </div>

              {/* Confirm Password */}

              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#5C534A]"
                >
                  Confirm password
                </label>

                <div className="relative">

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
                    placeholder="Repeat your password"
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-[#DDD4C8]
                      bg-white
                      px-3.5
                      pr-12
                      text-[13px]
                      text-[#302B25]
                      outline-none
                      transition-all
                      placeholder:text-[#B1A89E]
                      focus:border-[#A4773E]
                      focus:ring-4
                      focus:ring-[#A4773E]/8
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) => !value,
                      )
                    }
                    aria-label="Toggle confirm password visibility"
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[#8D8378] hover:bg-[#F4EFE8]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={15} />
                    ) : (
                      <Eye size={15} />
                    )}
                  </button>

                </div>

              </div>

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
                {loading
                  ? "Creating account..."
                  : "Create account"}

                {!loading && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                    <ArrowRight
                      size={13}
                      strokeWidth={1.6}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </span>
                )}
              </button>

            </form>

            <div className="mt-7 text-center">

              <p className="text-[11px] text-[#81776C]">

                Already have an account?{" "}

                <Link
                  to="/login"
                  className="font-semibold text-[#8A6338] transition hover:text-[#604522]"
                >
                  Sign in
                </Link>

              </p>

            </div>

          </div>
        </div>

      </div>
    </main>
  );
};

export default Register;