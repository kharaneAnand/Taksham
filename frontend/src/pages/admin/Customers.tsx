import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Eye,
  Mail,
  Phone,
  RefreshCw,
  Search,
  SlidersHorizontal,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  getAllCustomers,
} from "../../api/adminCustomer.api";

import type {
  Customer,
  CustomerSort,
} from "../../types/customer";

/*
 * ========================================
 * Types
 * ========================================
 */

type VerificationFilter =
  | "all"
  | "verified"
  | "unverified";

/*
 * ========================================
 * Constants
 * ========================================
 */

const ITEMS_PER_PAGE = 10;

/*
 * ========================================
 * Format Date
 * ========================================
 */

const formatDate = (
  date: string | Date,
) => {
  return new Date(
    date,
  ).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
};

/*
 * ========================================
 * Get Customer Name
 * ========================================
 */

const getCustomerName = (
  customer: Customer,
) => {
  return `${customer.firstName} ${customer.lastName}`.trim();
};

/*
 * ========================================
 * Get Initials
 * ========================================
 */

const getInitials = (
  customer: Customer,
) => {
  const first =
    customer.firstName?.charAt(0) || "";

  const last =
    customer.lastName?.charAt(0) || "";

  return (
    `${first}${last}`.toUpperCase() ||
    "U"
  );
};

/*
 * ========================================
 * Component
 * ========================================
 */

const Customers = () => {
  const navigate =
    useNavigate();

  /*
   * ----------------------------------------
   * Data
   * ----------------------------------------
   */

  const [
    customers,
    setCustomers,
  ] = useState<Customer[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  /*
   * ----------------------------------------
   * Filters
   * ----------------------------------------
   */

  const [
    searchInput,
    setSearchInput,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    verificationFilter,
    setVerificationFilter,
  ] =
    useState<VerificationFilter>(
      "all",
    );

  const [
    sort,
    setSort,
  ] =
    useState<CustomerSort>(
      "newest",
    );

  /*
   * ----------------------------------------
   * Pagination
   * ----------------------------------------
   */

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    totalCustomers,
    setTotalCustomers,
  ] = useState(0);

  const [
    totalPages,
    setTotalPages,
  ] = useState(1);

  const [
    hasNextPage,
    setHasNextPage,
  ] = useState(false);

  const [
    hasPreviousPage,
    setHasPreviousPage,
  ] = useState(false);

  /*
   * ========================================
   * Load Customers
   * ========================================
   */

  const loadCustomers =
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

        const result =
          await getAllCustomers({
            page,
            limit: ITEMS_PER_PAGE,

            ...(search.trim()
              ? {
                  search:
                    search.trim(),
                }
              : {}),

            ...(verificationFilter !==
            "all"
              ? {
                  isVerified:
                    verificationFilter ===
                    "verified"?"true" : "false",
                }
              : {}),

            sort,
          });

        setCustomers(
          result.customers,
        );

        setTotalCustomers(
          result.pagination
            .totalCustomers,
        );

        setTotalPages(
          result.pagination
            .totalPages || 1,
        );

        setHasNextPage(
          result.pagination
            .hasNextPage,
        );

        setHasPreviousPage(
          result.pagination
            .hasPreviousPage,
        );
      } catch (error) {
        console.error(
          "Failed to load customers:",
          error,
        );

        const message =
          error instanceof Error
            ? error.message
            : "Failed to load customers";

        setError(message);

        if (showRefreshState) {
          toast.error(message);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  /*
   * ========================================
   * Effects
   * ========================================
   */

  useEffect(() => {
    loadCustomers();
  }, [
    page,
    search,
    verificationFilter,
    sort,
  ]);

  /*
   * ========================================
   * Search Submit
   * ========================================
   */

  const handleSearchSubmit = (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    const nextSearch =
      searchInput.trim();

    if (
      page === 1 &&
      search === nextSearch
    ) {
      loadCustomers(true);
      return;
    }

    setPage(1);
    setSearch(nextSearch);
  };

  /*
   * ========================================
   * Clear Search
   * ========================================
   */

  const handleClearSearch =
    () => {
      setSearchInput("");
      setSearch("");
      setPage(1);
    };

  /*
   * ========================================
   * Verification Change
   * ========================================
   */

  const handleVerificationChange =
    (
      value: VerificationFilter,
    ) => {
      setPage(1);

      setVerificationFilter(
        value,
      );
    };

  /*
   * ========================================
   * Sort Change
   * ========================================
   */

  const handleSortChange =
    (
      value: CustomerSort,
    ) => {
      setPage(1);

      setSort(value);
    };

  /*
   * ========================================
   * View Customer
   * ========================================
   */

  const handleViewCustomer =
    (
      customerId: string,
    ) => {
      navigate(
        `/admin/customers/${customerId}`,
      );
    };

  /*
   * ========================================
   * Pagination Range
   * ========================================
   */

  const startCustomer =
    totalCustomers === 0
      ? 0
      : (page - 1) *
          ITEMS_PER_PAGE +
        1;

  const endCustomer =
    Math.min(
      page * ITEMS_PER_PAGE,
      totalCustomers,
    );

  /*
   * ========================================
   * Loading
   * ========================================
   */

  if (
    loading &&
    customers.length === 0
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-5 h-11 w-11 animate-spin rounded-full border-2 border-[#29251F] border-t-transparent" />

          <p className="text-sm text-[#777067]">
            Loading customers...
          </p>
        </div>
      </div>
    );
  }

  /*
   * ========================================
   * Error
   * ========================================
   */

  if (
    error &&
    customers.length === 0
  ) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="max-w-md rounded-3xl border border-[#E1DAD0] bg-white px-8 py-10 text-center">
          <CircleAlert
            size={36}
            strokeWidth={1.4}
            className="mx-auto text-[#B86A52]"
          />

          <h2 className="mt-5 font-serif text-2xl text-[#29251F]">
            Unable to Load Customers
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#777067]">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              loadCustomers()
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#29251F] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#3C362E]"
          >
            <RefreshCw size={15} />

            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* ====================================
          HEADER
      ==================================== */}

      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0E9DF]">
              <Users
                size={18}
                strokeWidth={1.5}
                className="text-[#806A4D]"
              />
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#A4773E]">
              Customer Management
            </p>
          </div>

          <h1 className="mt-4 font-serif text-4xl tracking-[-0.03em] text-[#29251F] sm:text-5xl">
            Customers
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#777067]">
            Manage your customers,
            review their accounts, and
            quickly access customer
            information.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            loadCustomers(true)
          }
          disabled={refreshing}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#DDD4C8] bg-white px-4 text-xs font-semibold uppercase tracking-wider text-[#5F584F] transition hover:border-[#B7894A] hover:text-[#29251F] disabled:cursor-not-allowed disabled:opacity-60"
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
      </div>

      {/* ====================================
          STATS
      ==================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* Total */}

        <div className="rounded-2xl border border-[#E1DAD0] bg-white p-5 shadow-[0_8px_30px_rgba(68,53,37,0.035)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8176]">
                Total Customers
              </p>

              <p className="mt-3 font-serif text-3xl text-[#29251F]">
                {totalCustomers.toLocaleString(
                  "en-IN",
                )}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0E9DF]">
              <Users
                size={18}
                strokeWidth={1.4}
                className="text-[#806A4D]"
              />
            </div>
          </div>

          <p className="mt-4 text-xs text-[#8A8176]">
            Registered customer accounts
          </p>
        </div>

        {/* Current Page */}

        <div className="rounded-2xl border border-[#E1DAD0] bg-white p-5 shadow-[0_8px_30px_rgba(68,53,37,0.035)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8176]">
                Showing
              </p>

              <p className="mt-3 font-serif text-3xl text-[#29251F]">
                {customers.length}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF2E9]">
              <UserRound
                size={18}
                strokeWidth={1.4}
                className="text-[#61704F]"
              />
            </div>
          </div>

          <p className="mt-4 text-xs text-[#8A8176]">
            Customers on this page
          </p>
        </div>

        {/* Page */}

        <div className="rounded-2xl border border-[#E1DAD0] bg-white p-5 shadow-[0_8px_30px_rgba(68,53,37,0.035)] sm:col-span-2 xl:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8A8176]">
                Current Page
              </p>

              <p className="mt-3 font-serif text-3xl text-[#29251F]">
                {page}
                <span className="mx-1 text-lg text-[#AAA198]">
                  /
                </span>
                <span className="text-xl text-[#756D63]">
                  {totalPages}
                </span>
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4EEE5]">
              <SlidersHorizontal
                size={18}
                strokeWidth={1.4}
                className="text-[#806A4D]"
              />
            </div>
          </div>

          <p className="mt-4 text-xs text-[#8A8176]">
            Browse your customer database
          </p>
        </div>
      </div>

      {/* ====================================
          CUSTOMER LIST
      ==================================== */}

      <section className="overflow-hidden rounded-2xl border border-[#E1DAD0] bg-white shadow-[0_8px_30px_rgba(68,53,37,0.035)]">
        {/* ------------------------------------
            Section Header
        ------------------------------------ */}

        <div className="border-b border-[#ECE6DE] px-5 py-5 sm:px-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#A4773E]">
                Customer Directory
              </p>

              <h2 className="mt-1 font-serif text-2xl text-[#29251F]">
                All Customers
              </h2>
            </div>

            <p className="text-xs text-[#8A8176]">
              {totalCustomers === 0
                ? "No customers found"
                : `Showing ${startCustomer}-${endCustomer} of ${totalCustomers.toLocaleString(
                    "en-IN",
                  )} customers`}
            </p>
          </div>
        </div>

        {/* ==================================
            FILTERS
        ================================== */}

        <div className="border-b border-[#ECE6DE] bg-[#FCFAF7] p-5 sm:p-6">
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_180px_180px]">
            {/* Search */}

            <form
              onSubmit={
                handleSearchSubmit
              }
              className="relative"
            >
              <Search
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9A9288]"
              />

              <input
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(
                    event.target.value,
                  )
                }
                placeholder="Search by name, email or phone..."
                className="h-12 w-full rounded-xl border border-[#DDD6CC] bg-white pl-11 pr-20 text-sm text-[#29251F] outline-none transition placeholder:text-[#AAA198] focus:border-[#A4773E] focus:ring-4 focus:ring-[#A4773E]/10"
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={
                    handleClearSearch
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#8A8176] transition hover:bg-[#F1ECE5] hover:text-[#29251F]"
                >
                  Clear
                </button>
              )}
            </form>

            {/* Verification */}

            <select
              value={
                verificationFilter
              }
              onChange={(event) =>
                handleVerificationChange(
                  event.target
                    .value as VerificationFilter,
                )
              }
              className="h-12 w-full rounded-xl border border-[#DDD6CC] bg-white px-4 text-sm font-medium text-[#5F584F] outline-none transition focus:border-[#A4773E] focus:ring-4 focus:ring-[#A4773E]/10"
            >
              <option value="all">
                All Customers
              </option>

              <option value="verified">
                Verified
              </option>

              <option value="unverified">
                Unverified
              </option>
            </select>

            {/* Sort */}

            <select
              value={sort}
              onChange={(event) =>
                handleSortChange(
                  event.target
                    .value as CustomerSort,
                )
              }
              className="h-12 w-full rounded-xl border border-[#DDD6CC] bg-white px-4 text-sm font-medium text-[#5F584F] outline-none transition focus:border-[#A4773E] focus:ring-4 focus:ring-[#A4773E]/10"
            >
              <option value="newest">
                Newest First
              </option>

              <option value="oldest">
                Oldest First
              </option>

              <option value="name_asc">
                Name: A to Z
              </option>

              <option value="name_desc">
                Name: Z to A
              </option>
            </select>
          </div>
        </div>

        {/* ==================================
            DESKTOP TABLE
        ================================== */}

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#ECE6DE] bg-[#FCFAF7]">
                <th className="px-6 py-4 text-left text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8A8176]">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8A8176]">
                  Contact
                </th>

                <th className="px-5 py-4 text-left text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8A8176]">
                  Verification
                </th>

                <th className="px-5 py-4 text-left text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8A8176]">
                  Joined
                </th>

                <th className="px-6 py-4 text-right text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8A8176]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {customers.map(
                (customer) => (
                  <tr
                    key={customer._id}
                    className="border-b border-[#F0ECE6] transition last:border-b-0 hover:bg-[#FCFAF7]"
                  >
                    {/* Customer */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[#E1DAD0] bg-[#F0E9DF]">
                          {customer.avatar
                            ?.url ? (
                            <img
                              src={
                                customer.avatar
                                  .url
                              }
                              alt={getCustomerName(
                                customer,
                              )}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs font-bold tracking-wide text-[#806A4D]">
                              {getInitials(
                                customer,
                              )}
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#29251F]">
                            {getCustomerName(
                              customer,
                            )}
                          </p>

                          <p className="mt-1 truncate text-xs text-[#8A8176]">
                            ID:{" "}
                            {customer._id.slice(
                              -8,
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}

                    <td className="px-5 py-5">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-[#5F584F]">
                          <Mail
                            size={13}
                            className="text-[#A4773E]"
                          />

                          <span>
                            {
                              customer.email
                            }
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#8A8176]">
                          <Phone
                            size={13}
                            className="text-[#AAA198]"
                          />

                          <span>
                            {
                              customer.phone ||
                                "No phone added"
                            }
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Verification */}

                    <td className="px-5 py-5">
                      {customer.isVerified ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EAF2E8] px-3 py-1.5 text-[10px] font-semibold text-[#587142]">
                          <CheckCircle2
                            size={13}
                          />

                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F7ECE8] px-3 py-1.5 text-[10px] font-semibold text-[#A4574D]">
                          <XCircle
                            size={13}
                          />

                          Unverified
                        </span>
                      )}
                    </td>

                    {/* Joined */}

                    <td className="px-5 py-5">
                      <p className="text-xs font-medium text-[#5F584F]">
                        {formatDate(
                          customer.createdAt,
                        )}
                      </p>

                      <p className="mt-1 text-[10px] text-[#AAA198]">
                        Customer since signup
                      </p>
                    </td>

                    {/* Action */}

                    <td className="px-6 py-5 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          handleViewCustomer(
                            customer._id,
                          )
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-[#DDD4C8] bg-white px-3.5 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#5F584F] transition hover:border-[#A4773E] hover:bg-[#29251F] hover:text-white"
                      >
                        <Eye size={14} />

                        View
                      </button>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        {/* ==================================
            MOBILE CARDS
        ================================== */}

        <div className="divide-y divide-[#ECE6DE] lg:hidden">
          {customers.map(
            (customer) => (
              <div
                key={customer._id}
                className="p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#E1DAD0] bg-[#F0E9DF]">
                    {customer.avatar
                      ?.url ? (
                      <img
                        src={
                          customer.avatar
                            .url
                        }
                        alt={getCustomerName(
                          customer,
                        )}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#806A4D]">
                        {getInitials(
                          customer,
                        )}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-[#29251F]">
                        {getCustomerName(
                          customer,
                        )}
                      </p>

                      {customer.isVerified ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF2E8] px-2.5 py-1 text-[9px] font-semibold text-[#587142]">
                          <CheckCircle2
                            size={11}
                          />

                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F7ECE8] px-2.5 py-1 text-[9px] font-semibold text-[#A4574D]">
                          <XCircle
                            size={11}
                          />

                          Unverified
                        </span>
                      )}
                    </div>

                    <div className="mt-3 space-y-2">
                      <p className="flex items-center gap-2 text-xs text-[#777067]">
                        <Mail
                          size={13}
                          className="shrink-0 text-[#A4773E]"
                        />

                        <span className="truncate">
                          {
                            customer.email
                          }
                        </span>
                      </p>

                      <p className="flex items-center gap-2 text-xs text-[#777067]">
                        <Phone
                          size={13}
                          className="shrink-0 text-[#AAA198]"
                        />

                        {
                          customer.phone ||
                            "No phone added"
                        }
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-[10px] text-[#AAA198]">
                        Joined{" "}
                        {formatDate(
                          customer.createdAt,
                        )}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleViewCustomer(
                            customer._id,
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#29251F] px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-white"
                      >
                        <Eye size={13} />

                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>

        {/* ==================================
            EMPTY STATE
        ================================== */}

        {customers.length === 0 && (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0E9DF]">
              <Users
                size={25}
                strokeWidth={1.3}
                className="text-[#806A4D]"
              />
            </div>

            <h3 className="mt-5 font-serif text-2xl text-[#29251F]">
              No Customers Found
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8A8176]">
              We couldn't find any
              customers matching your
              current filters.
            </p>

            {(search ||
              verificationFilter !==
                "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setSearch("");
                  setVerificationFilter(
                    "all",
                  );
                  setPage(1);
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#DDD4C8] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-[#5F584F] transition hover:bg-[#F4EEE5]"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* ==================================
            PAGINATION
        ================================== */}

        {customers.length > 0 && (
          <div className="flex flex-col justify-between gap-4 border-t border-[#ECE6DE] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <p className="text-xs text-[#8A8176]">
              Page{" "}
              <span className="font-semibold text-[#5F584F]">
                {page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#5F584F]">
                {totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={
                  !hasPreviousPage ||
                  loading
                }
                onClick={() =>
                  setPage(
                    (currentPage) =>
                      Math.max(
                        1,
                        currentPage - 1,
                      ),
                  )
                }
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#DDD6CC] bg-white px-3 text-xs font-medium text-[#5F584F] transition hover:border-[#B7894A] hover:text-[#29251F] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft
                  size={16}
                />

                Previous
              </button>

              <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-[#29251F] px-3 text-xs font-semibold text-white">
                {page}
              </div>

              <button
                type="button"
                disabled={
                  !hasNextPage ||
                  loading
                }
                onClick={() =>
                  setPage(
                    (currentPage) =>
                      Math.min(
                        totalPages,
                        currentPage + 1,
                      ),
                  )
                }
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#DDD6CC] bg-white px-3 text-xs font-medium text-[#5F584F] transition hover:border-[#B7894A] hover:text-[#29251F] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next

                <ChevronRight
                  size={16}
                />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Customers;