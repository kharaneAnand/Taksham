import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

import {
  useState,
  type FormEvent,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import AuthService from "../../services/auth.service";

// Update this path if your image is located elsewhere.
import registerBackground from "../../assets/images/looks/interior-consultation.png";

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
        "Account created! Please check your email to verify your account.",
      );

      navigate("/login", {
        replace: true,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create your account. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F3EFE9]">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">

        {/* =====================================================
            FULL IMAGE / EDITORIAL SIDE
        ===================================================== */}

        <section className="relative hidden min-h-screen overflow-hidden lg:block">

          {/* Background Image */}

          <img
            src={registerBackground}
            alt="Beautiful Taksham interior"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Main dark overlay */}

          <div className="absolute inset-0 bg-[#1F1812]/55" />

          {/* Left to right depth */}

          <div className="absolute inset-0 bg-linear-to-r from-[#17110D]/75 via-[#211913]/35 to-transparent" />

          {/* Bottom gradient */}

          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-[#17110D]/75 via-[#17110D]/20 to-transparent" />

          {/* Decorative glow */}

          <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-[#C49A63]/10 blur-3xl" />

          <div className="absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-[#D5B077]/10 blur-3xl" />

          {/* Content */}

          <div className="relative z-10 flex min-h-screen flex-col justify-between p-10 xl:p-16">

            {/* Brand */}

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-md">
                <Sparkles
                  size={16}
                  strokeWidth={1.4}
                  className="text-[#E1C18D]"
                />
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[#E1C18D]">
                  Taksham
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-[0.18em] text-white/40">
                  Furniture · Interiors · Living
                </p>
              </div>
            </div>

            {/* Main Copy */}

            <div className="max-w-155 pb-8">

              <div className="mb-6 flex items-center gap-3">
                <span className="h-px w-10 bg-[#D9B67D]" />

                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#E1C18D]">
                  Create your space
                </p>
              </div>

              <h1 className="font-serif text-[62px] font-medium leading-[0.94] tracking-[-0.055em] text-white xl:text-[82px]">
                A home should
                <br />

                feel like
                <br />

                <span className="italic text-[#DFC08B]">
                  you.
                </span>
              </h1>

              <p className="mt-8 max-w-115 text-[13px] leading-7 text-white/65 xl:text-[14px]">
                Create your account and step into a world
                of thoughtful furniture, timeless interiors
                and spaces designed around the way you live.
              </p>

              {/* Benefits */}

              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">

                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#D9B67D]/35 bg-[#D9B67D]/10">
                    <CheckCircle2
                      size={12}
                      className="text-[#DFC08B]"
                    />
                  </div>

                  <span className="text-[10px] text-white/65">
                    Curated collections
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#D9B67D]/35 bg-[#D9B67D]/10">
                    <CheckCircle2
                      size={12}
                      className="text-[#DFC08B]"
                    />
                  </div>

                  <span className="text-[10px] text-white/65">
                    Seamless shopping
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#D9B67D]/35 bg-[#D9B67D]/10">
                    <CheckCircle2
                      size={12}
                      className="text-[#DFC08B]"
                    />
                  </div>

                  <span className="text-[10px] text-white/65">
                    Made for your home
                  </span>
                </div>

              </div>
            </div>

            {/* Footer */}

            <div className="flex items-end justify-between border-t border-white/10 pt-6">
              <p className="text-[8px] uppercase tracking-[0.25em] text-white/35">
                Thoughtfully designed for beautiful living
              </p>

              <p className="font-serif text-xl italic text-[#DFC08B]/80">
                Since 2026
              </p>
            </div>

          </div>
        </section>

        {/* =====================================================
            REGISTER SIDE
        ===================================================== */}

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8F5F0] px-5 py-10 sm:px-10 lg:px-14 xl:px-20">

          {/* Subtle background decorations */}

          <div className="pointer-events-none absolute -right-40 -top-40 h-100 w-100 rounded-full bg-[#E9DDCC]/45 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-48 -left-48 h-120 w-120 rounded-full bg-[#E5D7C5]/30 blur-3xl" />

          <div className="relative z-10 w-full max-w-115">

            {/* Mobile Brand */}

            <div className="mb-10 flex items-center gap-3 lg:hidden">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#29251F]">
                <Sparkles
                  size={15}
                  className="text-[#D9B67D]"
                />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#29251F]">
                  Taksham
                </p>

                <p className="mt-1 text-[8px] uppercase tracking-[0.18em] text-[#968B7E]">
                  Beautiful Living
                </p>
              </div>

            </div>

            {/* Heading */}

            <div>

              <div className="flex items-center gap-3">

                <span className="h-px w-8 bg-[#A4773E]" />

                <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A4773E]">
                  Your journey begins here
                </p>

              </div>

              <h2 className="mt-5 font-serif text-[45px] font-medium leading-[0.95] tracking-[-0.045em] text-[#29251F] sm:text-[56px]">
                Create your
                <br />

                <span className="italic text-[#8A6338]">
                  Taksham account.
                </span>
              </h2>

              <p className="mt-5 max-w-105 text-[12px] leading-6 text-[#81776C]">
                Join us and discover furniture and interiors
                chosen to make everyday living feel a little
                more beautiful.
              </p>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="mt-9 space-y-4"
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
                      setFirstName(event.target.value)
                    }
                    placeholder="Anand"
                    disabled={loading}
                    className="h-13 w-full rounded-xl border border-[#DED5C9] bg-white/85 px-4 text-[13px] text-[#302B25] outline-none transition-all placeholder:text-[#B7AEA4] focus:border-[#A4773E] focus:bg-white focus:ring-4 focus:ring-[#A4773E]/8 disabled:cursor-not-allowed disabled:opacity-60"
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
                      setLastName(event.target.value)
                    }
                    placeholder="Kharane"
                    disabled={loading}
                    className="h-13 w-full rounded-xl border border-[#DED5C9] bg-white/85 px-4 text-[13px] text-[#302B25] outline-none transition-all placeholder:text-[#B7AEA4] focus:border-[#A4773E] focus:bg-white focus:ring-4 focus:ring-[#A4773E]/8 disabled:cursor-not-allowed disabled:opacity-60"
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
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  disabled={loading}
                  className="h-13 w-full rounded-xl border border-[#DED5C9] bg-white/85 px-4 text-[13px] text-[#302B25] outline-none transition-all placeholder:text-[#B7AEA4] focus:border-[#A4773E] focus:bg-white focus:ring-4 focus:ring-[#A4773E]/8 disabled:cursor-not-allowed disabled:opacity-60"
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
                    setPhone(event.target.value)
                  }
                  placeholder="+91 98765 43210"
                  disabled={loading}
                  className="h-13 w-full rounded-xl border border-[#DED5C9] bg-white/85 px-4 text-[13px] text-[#302B25] outline-none transition-all placeholder:text-[#B7AEA4] focus:border-[#A4773E] focus:bg-white focus:ring-4 focus:ring-[#A4773E]/8 disabled:cursor-not-allowed disabled:opacity-60"
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
                      setPassword(event.target.value)
                    }
                    placeholder="Create a password"
                    disabled={loading}
                    className="h-13 w-full rounded-xl border border-[#DED5C9] bg-white/85 px-4 pr-13 text-[13px] text-[#302B25] outline-none transition-all placeholder:text-[#B7AEA4] focus:border-[#A4773E] focus:bg-white focus:ring-4 focus:ring-[#A4773E]/8 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value,
                      )
                    }
                    disabled={loading}
                    aria-label="Toggle password visibility"
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#8D8378] transition hover:bg-[#F1EBE3] hover:text-[#4A423A] disabled:cursor-not-allowed"
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
                    disabled={loading}
                    className="h-13 w-full rounded-xl border border-[#DED5C9] bg-white/85 px-4 pr-13 text-[13px] text-[#302B25] outline-none transition-all placeholder:text-[#B7AEA4] focus:border-[#A4773E] focus:bg-white focus:ring-4 focus:ring-[#A4773E]/8 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) => !value,
                      )
                    }
                    disabled={loading}
                    aria-label="Toggle confirm password visibility"
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#8D8378] transition hover:bg-[#F1EBE3] hover:text-[#4A423A] disabled:cursor-not-allowed"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>

                </div>

              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="group mt-3 flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#29251F] px-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_14px_35px_rgba(45,37,29,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3A342D] hover:shadow-[0_18px_40px_rgba(45,37,29,0.22)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  "Creating account..."
                ) : (
                  <>
                    Create account

                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D9B67D] text-[#29251F] transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRight
                        size={14}
                        strokeWidth={1.8}
                      />
                    </span>
                  </>
                )}
              </button>

            </form>

            {/* Login */}

            <div className="mt-8 flex items-center justify-center gap-2 text-center">

              <p className="text-[11px] text-[#81776C]">
                Already have an account?
              </p>

              <Link
                to="/login"
                className="text-[11px] font-semibold text-[#8A6338] transition hover:text-[#604522]"
              >
                Sign in
              </Link>

            </div>

            <p className="mt-8 text-center text-[8px] uppercase tracking-[0.2em] text-[#B0A69B]">
              By creating an account, you become part of the Taksham story.
            </p>

          </div>
        </section>

      </div>
    </main>
  );
};

export default Register;