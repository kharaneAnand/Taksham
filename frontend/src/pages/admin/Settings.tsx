import {
  Bell,
  CreditCard,
  Loader2,
  RefreshCw,
  Save,
  Settings2,
  Store,
  Truck,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import toast from "react-hot-toast";

import {
  getSettings,
  updateSettings,
} from "../../api/settings.api";

import type {
  Settings as SettingsType,
  UpdateSettingsPayload,
} from "../../api/settings.api";

/*
 * ========================================
 * Editable Settings
 * ========================================
 */

type EditableSettings = {
  storeName: string;

  email: string;

  phone: string;

  address: string;

  currency: string;

  currencySymbol: string;

  taxRate: number;

  standardDeliveryEnabled: boolean;

  standardDeliveryCharge: number;

  standardDeliveryMinDays: number;

  standardDeliveryMaxDays: number;

  expressDeliveryEnabled: boolean;

  expressDeliveryCharge: number;

  expressDeliveryMinDays: number;

  expressDeliveryMaxDays: number;

  codEnabled: boolean;

  onlinePaymentEnabled: boolean;

  lowStockNotifications: boolean;

  newOrderNotifications: boolean;
};

type EditableSettingsField =
  keyof EditableSettings;

/*
 * ========================================
 * Initial Settings
 * ========================================
 */

const createInitialSettings =
  (): SettingsType => ({
    _id: "",

    storeName: "",

    email: "",

    phone: "",

    address: "",

    currency: "INR",

    currencySymbol: "₹",

    taxRate: 0,

    standardDeliveryEnabled: true,

    standardDeliveryCharge: 0,

    standardDeliveryMinDays: 4,

    standardDeliveryMaxDays: 7,

    expressDeliveryEnabled: true,

    expressDeliveryCharge: 0,

    expressDeliveryMinDays: 1,

    expressDeliveryMaxDays: 3,

    codEnabled: true,

    onlinePaymentEnabled: true,

    lowStockNotifications: true,

    newOrderNotifications: true,

    createdAt: "",

    updatedAt: "",
  });

/*
 * ========================================
 * Get Editable Settings
 * ========================================
 */

const getEditableSettings = (
  settings: SettingsType,
): EditableSettings => ({
  storeName:
    settings.storeName,

  email:
    settings.email,

  phone:
    settings.phone,

  address:
    settings.address,

  currency:
    settings.currency,

  currencySymbol:
    settings.currencySymbol,

  taxRate:
    Number(settings.taxRate),

  standardDeliveryEnabled:
    settings.standardDeliveryEnabled,

  standardDeliveryCharge:
    Number(
      settings.standardDeliveryCharge,
    ),

  standardDeliveryMinDays:
    Number(
      settings.standardDeliveryMinDays,
    ),

  standardDeliveryMaxDays:
    Number(
      settings.standardDeliveryMaxDays,
    ),

  expressDeliveryEnabled:
    settings.expressDeliveryEnabled,

  expressDeliveryCharge:
    Number(
      settings.expressDeliveryCharge,
    ),

  expressDeliveryMinDays:
    Number(
      settings.expressDeliveryMinDays,
    ),

  expressDeliveryMaxDays:
    Number(
      settings.expressDeliveryMaxDays,
    ),

  codEnabled:
    settings.codEnabled,

  onlinePaymentEnabled:
    settings.onlinePaymentEnabled,

  lowStockNotifications:
    settings.lowStockNotifications,

  newOrderNotifications:
    settings.newOrderNotifications,
});

/*
 * ========================================
 * Settings Page
 * ========================================
 */

const Settings = () => {
  const [
    settings,
    setSettings,
  ] = useState<SettingsType>(
    createInitialSettings,
  );

  const [
    originalSettings,
    setOriginalSettings,
  ] = useState<SettingsType>(
    createInitialSettings,
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  /*
   * ========================================
   * Load Settings
   * ========================================
   */

  const loadSettings =
    useCallback(
      async (
        showRefreshState = false,
      ) => {
        try {
          if (showRefreshState) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          setError("");

          const data =
            await getSettings();

          setSettings(data);

          setOriginalSettings(data);

          if (showRefreshState) {
            toast.success(
              "Settings refreshed successfully",
            );
          }
        } catch (loadError) {
          console.error(
            "Failed to load settings:",
            loadError,
          );

          const message =
            loadError instanceof Error
              ? loadError.message
              : "Failed to load settings";

          setError(message);

          if (showRefreshState) {
            toast.error(message);
          }
        } finally {
          setLoading(false);

          setRefreshing(false);
        }
      },
      [],
    );

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  /*
   * ========================================
   * Handle Field Change
   * ========================================
   */

  const handleChange = <
    K extends EditableSettingsField,
  >(
    field: K,
    value: EditableSettings[K],
  ) => {
    setSettings(
      (previous) => ({
        ...previous,

        [field]: value,
      }) as SettingsType,
    );
  };

  /*
   * ========================================
   * Check Unsaved Changes
   * ========================================
   */

  const hasChanges =
    useMemo(
      () => {
        const current =
          getEditableSettings(
            settings,
          );

        const original =
          getEditableSettings(
            originalSettings,
          );

        return (
          JSON.stringify(current) !==
          JSON.stringify(original)
        );
      },
      [
        settings,
        originalSettings,
      ],
    );

  /*
   * ========================================
   * Save Settings
   * ========================================
   */

  const handleSave =
    async () => {
      if (!hasChanges) {
        toast(
          "No changes to save",
        );

        return;
      }

      try {
        setSaving(true);

        const payload:
          UpdateSettingsPayload =
            getEditableSettings(
              settings,
            );

        const updatedSettings =
          await updateSettings(
            payload,
          );

        setSettings(
          updatedSettings,
        );

        setOriginalSettings(
          updatedSettings,
        );

        toast.success(
          "Settings saved successfully",
        );
      } catch (saveError) {
        console.error(
          "Failed to save settings:",
          saveError,
        );

        const message =
          saveError instanceof Error
            ? saveError.message
            : "Failed to save settings";

        toast.error(message);
      } finally {
        setSaving(false);
      }
    };

  /*
   * ========================================
   * Reset Settings
   * ========================================
   */

  const handleReset = () => {
    setSettings(
      originalSettings,
    );

    toast.success(
      "Changes discarded",
    );
  };

  /*
   * ========================================
   * Loading State
   * ========================================
   */

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <Loader2
            size={36}
            className="mx-auto animate-spin text-[#A4773E]"
          />

          <p className="mt-4 text-sm text-[#777067]">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  /*
   * ========================================
   * Error State
   * ========================================
   */

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-[#E1DAD0] bg-white p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8ECEA]">
            <Settings2
              size={25}
              className="text-[#A4574D]"
            />
          </div>

          <h2 className="mt-5 font-serif text-2xl text-[#29251F]">
            Unable to Load Settings
          </h2>

          <p className="mt-3 text-sm text-[#777067]">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              loadSettings(true)
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#29251F] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white"
          >
            <RefreshCw size={15} />

            Try Again
          </button>
        </div>
      </div>
    );
  }

  /*
   * ========================================
   * Main Page
   * ========================================
   */

  return (
    <div className="space-y-7">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A4773E]">
            Store Management
          </p>

          <h1 className="mt-2 font-serif text-4xl tracking-[-0.03em] text-[#29251F]">
            Settings
          </h1>

          <p className="mt-2 text-sm text-[#777067]">
            Manage store, delivery, payment and notification settings.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              loadSettings(true)
            }
            disabled={
              refreshing ||
              saving
            }
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#DDD4C8] bg-white px-4 text-xs font-semibold text-[#5F584F]"
          >
            <RefreshCw
              size={15}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={
              !hasChanges ||
              saving
            }
            className="inline-flex h-11 items-center rounded-xl border border-[#DDD4C8] bg-white px-4 text-xs font-semibold text-[#5F584F] disabled:opacity-50"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={
              !hasChanges ||
              saving
            }
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#29251F] px-5 text-xs font-semibold text-white disabled:opacity-60"
          >
            {saving ? (
              <Loader2
                size={15}
                className="animate-spin"
              />
            ) : (
              <Save size={15} />
            )}

            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </div>

      {/* UNSAVED CHANGES */}

      {hasChanges && (
        <div className="flex items-center justify-between rounded-xl border border-[#E5D4B8] bg-[#FCF7EE] px-4 py-3">
          <p className="text-xs text-[#80613C]">
            You have unsaved changes.
          </p>

          <span className="h-2 w-2 rounded-full bg-[#B7894A]" />
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          {/* STORE INFORMATION */}

          <SettingsSection
            icon={<Store size={19} />}
            eyebrow="Business"
            title="Store Information"
            description="Basic information used across your store."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <TextField
                label="Store Name"
                value={settings.storeName}
                onChange={(value) =>
                  handleChange(
                    "storeName",
                    value,
                  )
                }
              />

              <TextField
                label="Store Email"
                type="email"
                value={settings.email}
                onChange={(value) =>
                  handleChange(
                    "email",
                    value,
                  )
                }
              />

              <TextField
                label="Phone Number"
                value={settings.phone}
                onChange={(value) =>
                  handleChange(
                    "phone",
                    value,
                  )
                }
              />

              <TextField
                label="Currency"
                value={settings.currency}
                onChange={(value) =>
                  handleChange(
                    "currency",
                    value,
                  )
                }
              />

              <TextField
                label="Currency Symbol"
                value={settings.currencySymbol}
                onChange={(value) =>
                  handleChange(
                    "currencySymbol",
                    value,
                  )
                }
              />
            </div>

            <div className="mt-5">
              <TextAreaField
                label="Store Address"
                value={settings.address}
                onChange={(value) =>
                  handleChange(
                    "address",
                    value,
                  )
                }
              />
            </div>
          </SettingsSection>

          {/* STANDARD DELIVERY */}

          <SettingsSection
            icon={<Truck size={19} />}
            eyebrow="Delivery"
            title="Standard Delivery"
            description="Configure the normal delivery option shown during checkout."
          >
            <div className="space-y-5">
              <ToggleField
                label="Enable Standard Delivery"
                description="Allow customers to select standard delivery."
                checked={
                  settings.standardDeliveryEnabled
                }
                onChange={(value) =>
                  handleChange(
                    "standardDeliveryEnabled",
                    value,
                  )
                }
              />

              <div className="grid gap-5 md:grid-cols-3">
                <NumberField
                  label="Delivery Charge"
                  value={
                    settings.standardDeliveryCharge
                  }
                  prefix={
                    settings.currencySymbol
                  }
                  min={0}
                  onChange={(value) =>
                    handleChange(
                      "standardDeliveryCharge",
                      value,
                    )
                  }
                />

                <NumberField
                  label="Minimum Days"
                  value={
                    settings.standardDeliveryMinDays
                  }
                  min={0}
                  onChange={(value) =>
                    handleChange(
                      "standardDeliveryMinDays",
                      value,
                    )
                  }
                />

                <NumberField
                  label="Maximum Days"
                  value={
                    settings.standardDeliveryMaxDays
                  }
                  min={
                    settings.standardDeliveryMinDays
                  }
                  onChange={(value) =>
                    handleChange(
                      "standardDeliveryMaxDays",
                      value,
                    )
                  }
                />
              </div>
            </div>
          </SettingsSection>

          {/* EXPRESS DELIVERY */}

          <SettingsSection
            icon={<Truck size={19} />}
            eyebrow="Delivery"
            title="Express Delivery"
            description="Configure the faster delivery option shown during checkout."
          >
            <div className="space-y-5">
              <ToggleField
                label="Enable Express Delivery"
                description="Allow customers to select express delivery."
                checked={
                  settings.expressDeliveryEnabled
                }
                onChange={(value) =>
                  handleChange(
                    "expressDeliveryEnabled",
                    value,
                  )
                }
              />

              <div className="grid gap-5 md:grid-cols-3">
                <NumberField
                  label="Delivery Charge"
                  value={
                    settings.expressDeliveryCharge
                  }
                  prefix={
                    settings.currencySymbol
                  }
                  min={0}
                  onChange={(value) =>
                    handleChange(
                      "expressDeliveryCharge",
                      value,
                    )
                  }
                />

                <NumberField
                  label="Minimum Days"
                  value={
                    settings.expressDeliveryMinDays
                  }
                  min={0}
                  onChange={(value) =>
                    handleChange(
                      "expressDeliveryMinDays",
                      value,
                    )
                  }
                />

                <NumberField
                  label="Maximum Days"
                  value={
                    settings.expressDeliveryMaxDays
                  }
                  min={
                    settings.expressDeliveryMinDays
                  }
                  onChange={(value) =>
                    handleChange(
                      "expressDeliveryMaxDays",
                      value,
                    )
                  }
                />
              </div>
            </div>
          </SettingsSection>

          {/* TAX */}

          <SettingsSection
            icon={<Settings2 size={19} />}
            eyebrow="Commerce"
            title="Tax Settings"
            description="Set the default tax percentage."
          >
            <NumberField
              label="Tax Rate"
              value={settings.taxRate}
              suffix="%"
              min={0}
              max={100}
              onChange={(value) =>
                handleChange(
                  "taxRate",
                  value,
                )
              }
            />
          </SettingsSection>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          {/* PAYMENT */}

          <SettingsSection
            icon={<CreditCard size={19} />}
            eyebrow="Checkout"
            title="Payment Methods"
            description="Choose available payment options."
          >
            <div className="space-y-4">
              <ToggleField
                label="Cash on Delivery"
                description="Allow customers to place COD orders."
                checked={
                  settings.codEnabled
                }
                onChange={(value) =>
                  handleChange(
                    "codEnabled",
                    value,
                  )
                }
              />

              <ToggleField
                label="Online Payments"
                description="Allow customers to pay online."
                checked={
                  settings.onlinePaymentEnabled
                }
                onChange={(value) =>
                  handleChange(
                    "onlinePaymentEnabled",
                    value,
                  )
                }
              />
            </div>
          </SettingsSection>

          {/* NOTIFICATIONS */}

          <SettingsSection
            icon={<Bell size={19} />}
            eyebrow="Alerts"
            title="Notifications"
            description="Control administrative notifications."
          >
            <div className="space-y-4">
              <ToggleField
                label="Low Stock Alerts"
                description="Get notified about low inventory."
                checked={
                  settings.lowStockNotifications
                }
                onChange={(value) =>
                  handleChange(
                    "lowStockNotifications",
                    value,
                  )
                }
              />

              <ToggleField
                label="New Order Alerts"
                description="Get notified when customers place orders."
                checked={
                  settings.newOrderNotifications
                }
                onChange={(value) =>
                  handleChange(
                    "newOrderNotifications",
                    value,
                  )
                }
              />
            </div>
          </SettingsSection>

          {/* SUMMARY */}

          <div className="rounded-2xl border border-[#E1DAD0] bg-[#29251F] p-6 text-white">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#C7A875]">
              Delivery Summary
            </p>

            <h2 className="mt-2 font-serif text-2xl">
              {settings.storeName ||
                "Your Store"}
            </h2>

            <div className="mt-5 space-y-3 border-t border-white/10 pt-5">
              <SummaryRow
                label="Standard"
                value={
                  settings.standardDeliveryEnabled
                    ? `${settings.currencySymbol}${settings.standardDeliveryCharge} · ${settings.standardDeliveryMinDays}-${settings.standardDeliveryMaxDays} days`
                    : "Disabled"
                }
              />

              <SummaryRow
                label="Express"
                value={
                  settings.expressDeliveryEnabled
                    ? `${settings.currencySymbol}${settings.expressDeliveryCharge} · ${settings.expressDeliveryMinDays}-${settings.expressDeliveryMaxDays} days`
                    : "Disabled"
                }
              />

              <SummaryRow
                label="Tax Rate"
                value={`${settings.taxRate}%`}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

/*
 * ========================================
 * Settings Section
 * ========================================
 */

interface SettingsSectionProps {
  icon: ReactNode;

  eyebrow: string;

  title: string;

  description: string;

  children: ReactNode;
}

const SettingsSection = ({
  icon,
  eyebrow,
  title,
  description,
  children,
}: SettingsSectionProps) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#E1DAD0] bg-white">
      <div className="border-b border-[#ECE6DE] bg-[#FCFAF7] px-5 py-5 sm:px-6">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3EEE7] text-[#A4773E]">
            {icon}
          </div>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A4773E]">
              {eyebrow}
            </p>

            <h2 className="mt-1 font-serif text-xl text-[#29251F]">
              {title}
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#777067]">
              {description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>
    </section>
  );
};

/*
 * ========================================
 * Text Field
 * ========================================
 */

interface TextFieldProps {
  label: string;

  value: string;

  onChange: (
    value: string,
  ) => void;

  type?: string;
}

const TextField = ({
  label,
  value,
  onChange,
  type = "text",
}: TextFieldProps) => {
  return (
    <label className="block">
      <span className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8A8176]">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="h-11 w-full rounded-xl border border-[#DED7CE] bg-[#FCFBF9] px-3.5 text-sm text-[#29251F] outline-none"
      />
    </label>
  );
};

/*
 * ========================================
 * Number Field
 * ========================================
 */

interface NumberFieldProps {
  label: string;

  value: number;

  onChange: (
    value: number,
  ) => void;

  prefix?: string;

  suffix?: string;

  min?: number;

  max?: number;
}

const NumberField = ({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min,
  max,
}: NumberFieldProps) => {
  return (
    <label className="block">
      <span className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8A8176]">
        {label}
      </span>

      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#777067]">
            {prefix}
          </span>
        )}

        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(event) =>
            onChange(
              Number(
                event.target.value,
              ) || 0,
            )
          }
          className={`h-11 w-full rounded-xl border border-[#DED7CE] bg-[#FCFBF9] text-sm text-[#29251F] outline-none ${
            prefix
              ? "pl-9"
              : "pl-3.5"
          } ${
            suffix
              ? "pr-10"
              : "pr-3.5"
          }`}
        />

        {suffix && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#777067]">
            {suffix}
          </span>
        )}
      </div>
    </label>
  );
};

/*
 * ========================================
 * Text Area Field
 * ========================================
 */

interface TextAreaFieldProps {
  label: string;

  value: string;

  onChange: (
    value: string,
  ) => void;
}

const TextAreaField = ({
  label,
  value,
  onChange,
}: TextAreaFieldProps) => {
  return (
    <label className="block">
      <span className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8A8176]">
        {label}
      </span>

      <textarea
        value={value}
        rows={4}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="w-full resize-y rounded-xl border border-[#DED7CE] bg-[#FCFBF9] px-3.5 py-3 text-sm text-[#29251F] outline-none"
      />
    </label>
  );
};

/*
 * ========================================
 * Toggle Field
 * ========================================
 */

interface ToggleFieldProps {
  label: string;

  description: string;

  checked: boolean;

  onChange: (
    value: boolean,
  ) => void;
}

const ToggleField = ({
  label,
  description,
  checked,
  onChange,
}: ToggleFieldProps) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#E7E0D7] bg-[#FCFBF9] p-4">
      <div>
        <p className="text-sm font-semibold text-[#29251F]">
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-[#777067]">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() =>
          onChange(!checked)
        }
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked
            ? "bg-[#567B5A]"
            : "bg-[#D7D0C6]"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked
              ? "translate-x-6"
              : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

/*
 * ========================================
 * Summary Row
 * ========================================
 */

interface SummaryRowProps {
  label: string;

  value: string;
}

const SummaryRow = ({
  label,
  value,
}: SummaryRowProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-white/55">
        {label}
      </span>

      <span className="text-right text-xs font-semibold text-white">
        {value}
      </span>
    </div>
  );
};

export default Settings;