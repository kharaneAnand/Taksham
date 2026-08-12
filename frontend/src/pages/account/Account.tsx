import {
  Camera,
  CheckCircle2,
  Edit3,
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  Phone,
  ShieldCheck,
  User,
  X,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import AuthService from "../../services/auth.service";

import type {
  ChangePasswordInput,
  UpdateProfileInput,
} from "../../types/auth";

import axios from "axios";

/* =========================================================
   TYPES
========================================================= */

type ToastType = "success" | "error";

interface ToastState {
  type: ToastType;
  message: string;
}

/* =========================================================
   COMPONENT
========================================================= */

const Account = () => {
  const { user, loading, setUser } = useAuth();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const [toast, setToast] =
    useState<ToastState | null>(null);

  const [passwordOpen, setPasswordOpen] =
    useState(false);

  const [passwordLoading, setPasswordLoading] =
    useState(false);

  /* Password visibility */

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  /* Profile form */

  const [form, setForm] =
    useState<UpdateProfileInput>({
      firstName: "",
      lastName: "",
      phone: "",
    });

  /* Password form */

  const [passwordForm, setPasswordForm] =
    useState<ChangePasswordInput>({
      currentPassword: "",
      newPassword: "",
    });

  /* =========================================================
     TOAST
  ========================================================= */

  const showToast = (
    type: ToastType,
    message: string,
  ) => {
    setToast({
      type,
      message,
    });
  };

  const closeToast = () => {
    setToast(null);
  };

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 4500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [toast]);

  /* =========================================================
     ERROR MESSAGE HELPER
  ========================================================= */

  const getErrorMessage = (
    error: unknown,
    fallback: string,
  ) => {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data;

      if (
        data &&
        typeof data === "object" &&
        "message" in data &&
        typeof data.message === "string"
      ) {
        return data.message;
      }

      if (error.response?.status === 401) {
        return "Your session has expired. Please sign in again.";
      }

      if (error.response?.status === 400) {
        return "Please check the information you entered.";
      }

      if (error.response?.status === 404) {
        return "The requested resource was not found.";
      }

      if (error.response?.status === 500) {
        return "Something went wrong on the server. Please try again.";
      }
    }

    if (error instanceof Error && error.message) {
      return error.message;
    }

    return fallback;
  };

  /* =========================================================
     EDIT PROFILE
  ========================================================= */

  const startEditing = () => {
    if (!user) return;

    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    });

    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
  };

  /* =========================================================
     PROFILE UPDATE
  ========================================================= */

  const handleProfileUpdate = async () => {
    try {
      setSaving(true);

      const updatedUser =
        await AuthService.updateProfile(form);

      setUser(updatedUser);
      setEditing(false);

      showToast(
        "success",
        "Your profile has been updated successfully.",
      );
    } catch (error) {
      console.error(
        "PROFILE UPDATE ERROR:",
        error,
      );

      showToast(
        "error",
        getErrorMessage(
          error,
          "Unable to update your profile. Please try again.",
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     AVATAR
  ========================================================= */

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setAvatarLoading(true);

      const updatedUser =
        await AuthService.updateAvatar(file);

      setUser(updatedUser);

      showToast(
        "success",
        "Profile photo updated successfully.",
      );
    } catch (error) {
      console.error(
        "AVATAR UPDATE ERROR:",
        error,
      );

      showToast(
        "error",
        getErrorMessage(
          error,
          "Unable to update your profile photo.",
        ),
      );
    } finally {
      setAvatarLoading(false);
      event.target.value = "";
    }
  };

  /* =========================================================
     DELETE AVATAR
  ========================================================= */

  const handleDeleteAvatar = async () => {
    try {
      setAvatarLoading(true);

      const updatedUser =
        await AuthService.deleteAvatar();

      setUser(updatedUser);

      showToast(
        "success",
        "Profile photo removed successfully.",
      );
    } catch (error) {
      console.error(
        "AVATAR DELETE ERROR:",
        error,
      );

      showToast(
        "error",
        getErrorMessage(
          error,
          "Unable to remove your profile photo.",
        ),
      );
    } finally {
      setAvatarLoading(false);
    }
  };

  /* =========================================================
     CHANGE PASSWORD
  ========================================================= */

  const handlePasswordChange = async () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword
    ) {
      showToast(
        "error",
        "Please enter both passwords.",
      );

      return;
    }

    if (
      passwordForm.newPassword.length < 8
    ) {
      showToast(
        "error",
        "Your new password must contain at least 8 characters.",
      );

      return;
    }

    try {
      setPasswordLoading(true);

      await AuthService.changePassword(
        passwordForm,
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
      });

      setShowCurrentPassword(false);
      setShowNewPassword(false);

      setPasswordOpen(false);

      showToast(
        "success",
        "Your password has been changed successfully.",
      );
    } catch (error) {
      console.error(
        "CHANGE PASSWORD ERROR:",
        error,
      );

      showToast(
        "error",
        getErrorMessage(
          error,
          "Unable to change your password. Please try again.",
        ),
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF8F5]">
        <div className="flex min-h-[70vh] items-center justify-center px-5">
          <div className="flex items-center gap-3 text-[#81776C]">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#D9C9B3] border-t-[#8F6838]" />

            <span className="text-sm">
              Loading your account...
            </span>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     NO USER
  ========================================================= */

  if (!user) {
    return (
      <main className="min-h-screen bg-[#FAF8F5]">
        <div className="flex min-h-[70vh] items-center justify-center px-5">
          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EFE4D5] text-[#8F6838]">
              <User
                size={24}
                strokeWidth={1.4}
              />
            </span>

            <h1 className="mt-5 font-serif text-4xl tracking-[-0.03em] text-[#302B25]">
              Account unavailable
            </h1>

            <p className="mt-3 text-sm text-[#81776C]">
              Please sign in to view your account.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const initials = (
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}` ||
    user.email?.[0] ||
    "U"
  ).toUpperCase();

  return (
    <main className="min-h-screen overflow-hidden bg-[#FAF8F5] text-[#302B25]">

      {/* =====================================================
          TOAST
      ===================================================== */}

      {toast && (
        <div
          className="
            fixed
            right-5
            top-5
            z-[100]
            w-[calc(100%-40px)]
            max-w-[390px]
            animate-[slideIn_0.3s_ease-out]
          "
        >
          <div
            className={`
              relative
              overflow-hidden
              rounded-[17px]
              border
              bg-white
              p-4
              shadow-[0_20px_60px_rgba(45,35,25,0.16)]
              backdrop-blur-xl
              ${
                toast.type === "success"
                  ? "border-[#D5E2D1]"
                  : "border-[#E8D2CD]"
              }
            `}
          >

            <div className="flex items-start gap-3">

              <div
                className={`
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  ${
                    toast.type === "success"
                      ? "bg-[#E5F0E2] text-[#557650]"
                      : "bg-[#F9E9E6] text-[#985C50]"
                  }
                `}
              >
                {toast.type === "success" ? (
                  <CheckCircle2
                    size={17}
                    strokeWidth={1.7}
                  />
                ) : (
                  <AlertCircle
                    size={17}
                    strokeWidth={1.7}
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">

                <p
                  className={`
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    ${
                      toast.type === "success"
                        ? "text-[#557650]"
                        : "text-[#985C50]"
                    }
                  `}
                >
                  {toast.type === "success"
                    ? "Success"
                    : "Something went wrong"}
                </p>

                <p className="mt-1 text-[12px] leading-5 text-[#4A433B]">
                  {toast.message}
                </p>

              </div>

              <button
                type="button"
                onClick={closeToast}
                aria-label="Close notification"
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-[#9A9187]
                  transition
                  hover:bg-[#F5F0EA]
                  hover:text-[#51483F]
                "
              >
                <X size={14} />
              </button>

            </div>

            <div
              className={`
                absolute
                bottom-0
                left-0
                h-[2px]
                animate-[toastProgress_4.5s_linear_forwards]
                ${
                  toast.type === "success"
                    ? "bg-[#6F916A]"
                    : "bg-[#A96A5C]"
                }
              `}
              style={{
                width: "100%",
              }}
            />

          </div>
        </div>
      )}

      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#D9B36A]/[0.055] blur-3xl" />
        <div className="absolute -right-40 top-[45%] h-96 w-96 rounded-full bg-[#8A765C]/[0.045] blur-3xl" />
      </div>

      {/* =====================================================
          PREMIUM HEADER
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-[#E6DDD2] bg-[#F5EFE7]">

        <div className="absolute right-0 top-0 h-full w-[35%] opacity-30">
          <div className="absolute right-[-100px] top-[-140px] h-[340px] w-[340px] rounded-full border border-[#C7A77A]/30" />
          <div className="absolute right-[-50px] top-[-90px] h-[240px] w-[240px] rounded-full border border-[#C7A77A]/20" />
        </div>

        <div className="relative mx-auto max-w-[1240px] px-5 pb-9 pt-8 sm:px-8 sm:pb-11 sm:pt-10 lg:px-10 lg:pb-14 lg:pt-12">

          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="flex items-center gap-2">
                <span className="h-px w-7 bg-[#B7894A]" />

                <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A4773E]">
                  Personal Space
                </p>
              </div>

              <h1
                className="
                  mt-4
                  font-serif
                  text-[43px]
                  font-medium
                  leading-[0.94]
                  tracking-[-0.055em]
                  text-[#29251F]
                  sm:text-[55px]
                  lg:text-[64px]
                "
              >
                My Account
              </h1>

              <p className="mt-4 max-w-[510px] text-[12px] leading-6 text-[#81776C] sm:text-[13px]">
                Everything about your Taksham experience,
                thoughtfully kept in one place.
              </p>

            </div>

            <div className="flex items-center gap-3 self-start rounded-full border border-[#DDD0C0] bg-white/60 px-3 py-2 backdrop-blur-md lg:self-auto">

              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#D8C1A0] font-serif text-sm text-[#5A452E]">

                {user.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}

              </div>

              <div className="pr-2">
                <p className="text-[11px] font-semibold text-[#39332C]">
                  {user.firstName} {user.lastName}
                </p>

                <p className="mt-0.5 text-[8px] text-[#978D81]">
                  {user.isVerified
                    ? "Verified account"
                    : "Account"}
                </p>
              </div>

              {user.isVerified && (
                <CheckCircle2
                  size={14}
                  className="text-[#6D8768]"
                />
              )}

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="relative mx-auto max-w-[1240px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-12">

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">

          {/* =================================================
              PROFILE CARD
          ================================================= */}

          <div className="overflow-hidden rounded-[25px] border border-[#E2D8CC] bg-white shadow-[0_18px_60px_rgba(55,43,31,0.055)]">

            <div className="relative overflow-hidden border-b border-[#ECE5DC] px-5 py-5 sm:px-7 sm:py-6">

              <div className="absolute right-[-40px] top-[-60px] h-32 w-32 rounded-full border border-[#D7C4AA]/30" />

              <div className="relative flex items-center justify-between gap-4">

                <div>

                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#A4773E]">
                    Personal information
                  </p>

                  <h2 className="mt-1.5 font-serif text-[27px] tracking-[-0.025em] text-[#302B25]">
                    Profile
                  </h2>

                </div>

                {!editing && (
                  <button
                    type="button"
                    onClick={startEditing}
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-[#DCCFC0]
                      bg-[#FBF8F4]
                      px-4
                      py-2.5
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.1em]
                      text-[#6E573C]
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:border-[#BDA47F]
                      hover:bg-[#F5EDE2]
                      hover:shadow-[0_8px_20px_rgba(80,60,40,0.08)]
                    "
                  >
                    <Edit3
                      size={13}
                      strokeWidth={1.5}
                    />

                    Edit

                    <ArrowUpRight
                      size={12}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </button>
                )}

              </div>

            </div>

            <div className="p-5 sm:p-7">

              {/* AVATAR */}

              <div className="relative overflow-hidden rounded-[20px] border border-[#E8DED3] bg-[#FAF7F2] p-4 sm:p-5">

                <div className="flex flex-col items-center gap-5 sm:flex-row">

                  <div className="relative">

                    <div className="absolute -inset-2 rounded-full border border-[#C9A878]/20" />

                    <div className="relative flex h-[94px] w-[94px] items-center justify-center overflow-hidden rounded-full border-[5px] border-white bg-[#D8C1A0] font-serif text-[25px] text-[#5A452E] shadow-[0_10px_30px_rgba(70,50,30,0.12)] sm:h-[106px] sm:w-[106px]">

                      {user.avatar?.url ? (
                        <img
                          src={user.avatar.url}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials
                      )}

                      {avatarLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        </div>
                      )}

                    </div>

                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      disabled={avatarLoading}
                      aria-label="Change profile photo"
                      className="
                        absolute
                        bottom-0
                        right-0
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        border-2
                        border-white
                        bg-[#8F6B3F]
                        text-white
                        shadow-[0_5px_15px_rgba(70,50,30,0.2)]
                        transition
                        hover:scale-105
                        hover:bg-[#795832]
                        disabled:opacity-50
                      "
                    >
                      <Camera size={14} />
                    </button>

                  </div>

                  <div className="min-w-0 flex-1 text-center sm:text-left">

                    <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#A4773E]">
                      Taksham Member
                    </p>

                    <h3 className="mt-1.5 font-serif text-[23px] tracking-[-0.02em] text-[#39332C]">
                      {user.firstName} {user.lastName}
                    </h3>

                    <p className="mt-1 truncate text-[11px] text-[#91877C]">
                      {user.email}
                    </p>

                    <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">

                      <button
                        type="button"
                        onClick={handleAvatarClick}
                        disabled={avatarLoading}
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-full
                          bg-[#8F6B3F]
                          px-3.5
                          py-2
                          text-[8px]
                          font-semibold
                          uppercase
                          tracking-[0.08em]
                          text-white
                          transition
                          hover:bg-[#795832]
                          disabled:opacity-50
                        "
                      >
                        <Camera size={12} />
                        Change Photo
                      </button>

                      {user.avatar?.url && (
                        <button
                          type="button"
                          onClick={handleDeleteAvatar}
                          disabled={avatarLoading}
                          className="
                            rounded-full
                            border
                            border-[#E0D3C7]
                            bg-white
                            px-3.5
                            py-2
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-[0.08em]
                            text-[#8C5549]
                            transition
                            hover:bg-[#FBF1EF]
                            disabled:opacity-50
                          "
                        >
                          Remove
                        </button>
                      )}

                    </div>

                  </div>

                </div>

              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />

              {/* FIELDS */}

              <div className="mt-7 grid gap-4 sm:grid-cols-2">

                {/* First Name */}

                <div className="rounded-[15px] border border-[#E9E1D8] bg-[#FCFAF7] p-4">

                  <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.14em] text-[#95897C]">
                    First Name
                  </label>

                  {editing ? (
                    <input
                      value={form.firstName ?? ""}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          firstName:
                            event.target.value,
                        })
                      }
                      className="
                        h-11
                        w-full
                        rounded-[10px]
                        border
                        border-[#DCD2C5]
                        bg-white
                        px-3
                        text-[13px]
                        text-[#39332C]
                        outline-none
                        transition
                        focus:border-[#A4773E]
                        focus:ring-2
                        focus:ring-[#A4773E]/10
                      "
                    />
                  ) : (
                    <p className="text-[14px] font-medium text-[#39332C]">
                      {user.firstName}
                    </p>
                  )}

                </div>

                {/* Last Name */}

                <div className="rounded-[15px] border border-[#E9E1D8] bg-[#FCFAF7] p-4">

                  <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.14em] text-[#95897C]">
                    Last Name
                  </label>

                  {editing ? (
                    <input
                      value={form.lastName ?? ""}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          lastName:
                            event.target.value,
                        })
                      }
                      className="
                        h-11
                        w-full
                        rounded-[10px]
                        border
                        border-[#DCD2C5]
                        bg-white
                        px-3
                        text-[13px]
                        text-[#39332C]
                        outline-none
                        transition
                        focus:border-[#A4773E]
                        focus:ring-2
                        focus:ring-[#A4773E]/10
                      "
                    />
                  ) : (
                    <p className="text-[14px] font-medium text-[#39332C]">
                      {user.lastName}
                    </p>
                  )}

                </div>

                {/* Email */}

                <div className="rounded-[15px] border border-[#E9E1D8] bg-[#FCFAF7] p-4">

                  <label className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#95897C]">
                    <Mail size={12} />
                    Email
                  </label>

                  <p className="truncate text-[14px] font-medium text-[#39332C]">
                    {user.email}
                  </p>

                </div>

                {/* Phone */}

                <div className="rounded-[15px] border border-[#E9E1D8] bg-[#FCFAF7] p-4">

                  <label className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#95897C]">
                    <Phone size={12} />
                    Phone
                  </label>

                  {editing ? (
                    <input
                      value={form.phone ?? ""}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          phone:
                            event.target.value,
                        })
                      }
                      className="
                        h-11
                        w-full
                        rounded-[10px]
                        border
                        border-[#DCD2C5]
                        bg-white
                        px-3
                        text-[13px]
                        text-[#39332C]
                        outline-none
                        transition
                        focus:border-[#A4773E]
                        focus:ring-2
                        focus:ring-[#A4773E]/10
                      "
                    />
                  ) : (
                    <p className="text-[14px] font-medium text-[#39332C]">
                      {user.phone || "Not added"}
                    </p>
                  )}

                </div>

              </div>

              {/* EDIT ACTIONS */}

              {editing && (
                <div className="mt-6 flex flex-col-reverse gap-2.5 border-t border-[#EEE7DE] pt-6 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={saving}
                    className="
                      flex
                      h-11
                      items-center
                      justify-center
                      gap-2
                      rounded-full
                      border
                      border-[#DCD2C5]
                      bg-white
                      px-5
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.08em]
                      text-[#665C52]
                      transition
                      hover:bg-[#F7F3EE]
                    "
                  >
                    <X size={14} />
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleProfileUpdate}
                    disabled={saving}
                    className="
                      flex
                      h-11
                      items-center
                      justify-center
                      rounded-full
                      bg-[#8F6B3F]
                      px-6
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.08em]
                      text-white
                      shadow-[0_8px_20px_rgba(143,107,63,0.2)]
                      transition
                      hover:bg-[#795832]
                      disabled:opacity-50
                    "
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>
              )}

            </div>
          </div>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <div className="space-y-6">

            {/* SECURITY */}

            <div className="overflow-hidden rounded-[25px] border border-[#E2D8CC] bg-white shadow-[0_18px_60px_rgba(55,43,31,0.05)]">

              <div className="border-b border-[#ECE5DC] bg-[#FBF8F4] p-5 sm:p-6">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EFE3D3] text-[#8B693F]">
                    <ShieldCheck
                      size={20}
                      strokeWidth={1.4}
                    />
                  </div>

                  <div>

                    <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#A4773E]">
                      Protected
                    </p>

                    <h2 className="mt-1 font-serif text-[24px] tracking-[-0.02em] text-[#302B25]">
                      Security
                    </h2>

                  </div>

                </div>

              </div>

              <div className="p-5 sm:p-6">

                <div className="rounded-[17px] border border-[#E9E1D8] bg-[#FCFAF7] p-4">

                  <div className="flex items-center justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EFE4D5] text-[#8B693F]">
                        <KeyRound
                          size={16}
                          strokeWidth={1.5}
                        />
                      </div>

                      <div className="min-w-0">

                        <p className="text-[11px] font-semibold text-[#40382F]">
                          Password
                        </p>

                        <p className="mt-0.5 text-[8px] text-[#9A9187]">
                          Keep your account secure
                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setPasswordOpen(
                          !passwordOpen,
                        );

                        if (passwordOpen) {
                          setShowCurrentPassword(false);
                          setShowNewPassword(false);
                        }
                      }}
                      className="
                        shrink-0
                        rounded-full
                        px-2
                        py-1
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[0.08em]
                        text-[#8B693F]
                        transition
                        hover:bg-[#EFE4D5]
                      "
                    >
                      {passwordOpen
                        ? "Close"
                        : "Change"}
                    </button>

                  </div>

                  {passwordOpen && (
                    <div className="mt-5 space-y-3 border-t border-[#E6DED4] pt-5">

                      {/* CURRENT PASSWORD */}

                      <div className="relative">

                        <input
                          type={
                            showCurrentPassword
                              ? "text"
                              : "password"
                          }
                          placeholder="Current password"
                          value={
                            passwordForm.currentPassword
                          }
                          onChange={(event) =>
                            setPasswordForm({
                              ...passwordForm,
                              currentPassword:
                                event.target.value,
                            })
                          }
                          autoComplete="current-password"
                          className="
                            h-11
                            w-full
                            rounded-[10px]
                            border
                            border-[#DCD2C5]
                            bg-white
                            px-3
                            pr-11
                            text-[12px]
                            text-[#39332C]
                            outline-none
                            transition
                            placeholder:text-[#AAA097]
                            focus:border-[#A4773E]
                            focus:ring-2
                            focus:ring-[#A4773E]/10
                          "
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(
                              !showCurrentPassword,
                            )
                          }
                          aria-label={
                            showCurrentPassword
                              ? "Hide current password"
                              : "Show current password"
                          }
                          className="
                            absolute
                            right-3
                            top-1/2
                            flex
                            -translate-y-1/2
                            items-center
                            justify-center
                            text-[#8F806F]
                            transition
                            hover:text-[#6F5435]
                          "
                        >
                          {showCurrentPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>

                      </div>

                      {/* NEW PASSWORD */}

                      <div className="relative">

                        <input
                          type={
                            showNewPassword
                              ? "text"
                              : "password"
                          }
                          placeholder="New password"
                          value={
                            passwordForm.newPassword
                          }
                          onChange={(event) =>
                            setPasswordForm({
                              ...passwordForm,
                              newPassword:
                                event.target.value,
                            })
                          }
                          autoComplete="new-password"
                          className="
                            h-11
                            w-full
                            rounded-[10px]
                            border
                            border-[#DCD2C5]
                            bg-white
                            px-3
                            pr-11
                            text-[12px]
                            text-[#39332C]
                            outline-none
                            transition
                            placeholder:text-[#AAA097]
                            focus:border-[#A4773E]
                            focus:ring-2
                            focus:ring-[#A4773E]/10
                          "
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowNewPassword(
                              !showNewPassword,
                            )
                          }
                          aria-label={
                            showNewPassword
                              ? "Hide new password"
                              : "Show new password"
                          }
                          className="
                            absolute
                            right-3
                            top-1/2
                            flex
                            -translate-y-1/2
                            items-center
                            justify-center
                            text-[#8F806F]
                            transition
                            hover:text-[#6F5435]
                          "
                        >
                          {showNewPassword ? (
                            <EyeOff size={16} />
                          ) : (
                            <Eye size={16} />
                          )}
                        </button>

                      </div>

                      <button
                        type="button"
                        onClick={handlePasswordChange}
                        disabled={passwordLoading}
                        className="
                          mt-1
                          flex
                          h-11
                          w-full
                          items-center
                          justify-center
                          rounded-full
                          bg-[#8F6B3F]
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.1em]
                          text-white
                          shadow-[0_7px_18px_rgba(143,107,63,0.18)]
                          transition
                          hover:bg-[#795832]
                          disabled:opacity-50
                        "
                      >
                        {passwordLoading
                          ? "Updating..."
                          : "Update Password"}
                      </button>

                    </div>
                  )}

                </div>

              </div>
            </div>

            {/* =================================================
                VERIFICATION
            ================================================= */}

            <div className="relative overflow-hidden rounded-[25px] border border-[#E2D8CC] bg-white p-5 shadow-[0_18px_60px_rgba(55,43,31,0.05)] sm:p-6">

              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#E4F0E1]/50 blur-2xl" />

              <div className="relative flex items-start gap-3">

                <div
                  className={`
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    ${
                      user.isVerified
                        ? "bg-[#E4F0E1] text-[#52704D]"
                        : "bg-[#F6E8D4] text-[#A4773E]"
                    }
                  `}
                >
                  <CheckCircle2
                    size={18}
                    strokeWidth={1.5}
                  />
                </div>

                <div className="min-w-0">

                  <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#A4773E]">
                    Account status
                  </p>

                  <h3 className="mt-1 font-serif text-[21px] tracking-[-0.02em] text-[#302B25]">
                    {user.isVerified
                      ? "Email verified"
                      : "Email not verified"}
                  </h3>

                  <p className="mt-2 text-[9px] leading-5 text-[#91877C]">
                    {user.isVerified
                      ? "Your email address has been successfully verified and your account is protected."
                      : "Please verify your email address to keep your account secure."}
                  </p>

                </div>

              </div>

              <div className="relative mt-5 flex items-center gap-2 border-t border-[#EEE7DE] pt-4">

                <span
                  className={`
                    h-1.5
                    w-1.5
                    rounded-full
                    ${
                      user.isVerified
                        ? "bg-[#6F916A]"
                        : "bg-[#B7894A]"
                    }
                  `}
                />

                <span className="text-[8px] font-medium uppercase tracking-[0.12em] text-[#978D82]">
                  {user.isVerified
                    ? "Account protected"
                    : "Verification required"}
                </span>

              </div>

            </div>

            {/* TAKSHAM NOTE */}

            <div className="rounded-[25px] border border-[#DCCCB9] bg-[#F3EBDD] p-5 sm:p-6">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#9A7138]">
                    Taksham
                  </p>

                  <h3 className="mt-2 font-serif text-[22px] leading-tight tracking-[-0.02em] text-[#40362A]">
                    Beautiful spaces,
                    <br />
                    thoughtfully lived.
                  </h3>

                </div>

                <span className="font-serif text-[25px] text-[#A4773E]/50">
                  तक्षम्
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          TOAST ANIMATIONS
      ===================================================== */}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-12px) translateX(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(0);
          }
        }

        @keyframes toastProgress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>

    </main>
  );
};

export default Account;