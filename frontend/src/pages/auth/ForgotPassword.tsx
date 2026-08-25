import {
  ArrowLeft,
  ArrowRight,
  Mail,
} from "lucide-react";

import {
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  Link,
} from "react-router-dom";

import toast from "react-hot-toast";

import AuthService from "../../services/auth.service";

const ForgotPassword = () => {
  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [emailSent, setEmailSent] =
    useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error(
        "Please enter your email address.",
      );

      return;
    }

    try {
      setLoading(true);

      await AuthService.forgotPassword({
        email: email.trim(),
      });

      setEmailSent(true);

      toast.success(
        "Password reset link sent successfully.",
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to send the password reset link. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full overflow-hidden bg-[#F8F5F0]">

      <div className="grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">

        {/* =========================================
            LEFT EDITORIAL SECTION
        ========================================= */}

        <section className="relative hidden overflow-hidden bg-[#29251F] lg:flex">

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
            "
          />

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

            {/* Brand */}

            <Link
              to="/"
              className="
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

            {/* Main Content */}

            <div className="max-w-xl">

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
                  Account Recovery
                </span>
              </div>

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
                We'll help you
                <br />

                <span className="text-[#E0C49C]">
                  find your way back.
                </span>
              </h1>

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
                Enter the email associated with your account
                and we'll send you a secure link to reset
                your password.
              </p>

            </div>

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
              02
            </span>

          </div>
        </section>

        {/* =========================================
            RIGHT FORM SECTION
        ========================================= */}

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

          {/* Mobile Background */}

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

            {/* Mobile Brand */}

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

              {!emailSent ? (
                <>
                  {/* Header */}

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
                        Password Recovery
                      </p>
                    </div>

                    <h1
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
                      Forgot password?
                    </h1>

                    <p
                      className="
                        mt-4
                        max-w-100
                        text-[12px]
                        leading-5
                        text-[#81776C]
                        sm:text-[13px]
                        sm:leading-6
                      "
                    >
                      No worries. Enter your email address and
                      we'll send you a link to reset your password.
                    </p>

                  </div>

                  {/* Form */}

                  <form
                    onSubmit={handleSubmit}
                    className="mt-8 sm:mt-9"
                  >

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

                    <button
                      type="submit"
                      disabled={loading}
                      className="
                        group
                        relative
                        mt-6
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

                          Sending link...
                        </>
                      ) : (
                        <>
                          Send Reset Link

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
                </>
              ) : (
                /* =========================================
                    SUCCESS STATE
                ========================================= */

                <div className="py-5 text-center">

                  <div
                    className="
                      mx-auto
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-full
                      bg-[#F1E8DC]
                    "
                  >
                    <Mail
                      size={22}
                      strokeWidth={1.4}
                      className="text-[#A4773E]"
                    />
                  </div>

                  <p
                    className="
                      mt-6
                      text-[8px]
                      font-semibold
                      uppercase
                      tracking-[0.3em]
                      text-[#A4773E]
                    "
                  >
                    Check Your Inbox
                  </p>

                  <h1
                    className="
                      mt-3
                      font-serif
                      text-[40px]
                      font-medium
                      leading-none
                      tracking-tight
                      text-[#28241F]
                      sm:text-[46px]
                    "
                  >
                    Email sent.
                  </h1>

                  <p
                    className="
                      mx-auto
                      mt-4
                      max-w-90
                      text-[12px]
                      leading-6
                      text-[#81776C]
                    "
                  >
                    If an account exists for{" "}
                    <span className="font-medium text-[#51483F]">
                      {email}
                    </span>
                    , you'll receive a password reset link shortly.
                  </p>

                  <Link
                    to="/login"
                    className="
                      group
                      mt-8
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

                    Back to Sign In
                  </Link>

                </div>
              )}

              {/* Footer */}

              {!emailSent && (
                <div className="mt-9">

                  <div
                    className="
                      flex
                      items-center
                      gap-4
                    "
                  >
                    <div className="h-px flex-1 bg-[#E4DCD2]" />

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

                    <div className="h-px flex-1 bg-[#E4DCD2]" />
                  </div>

                  <div className="mt-5 text-center">

                    <Link
                      to="/login"
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

                      Back to Sign In
                    </Link>

                  </div>

                </div>
              )}

            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ForgotPassword;