import {
  ArrowRight,
  CalendarDays,
  Check,
  Copy,
  Sparkles,
  Tag,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getActiveOffers,
} from "../../api/offer.api";

import type {
  Offer,
} from "../../types/offer";

const Offers = () => {
  const navigate = useNavigate();

  const [offers, setOffers] =
    useState<Offer[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [copiedOfferId, setCopiedOfferId] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await getActiveOffers();

        if (!cancelled) {
          setOffers(data);
        }
      } catch (error) {
        console.error(
          "Failed to fetch active offers:",
          error,
        );

        if (!cancelled) {
          setOffers([]);

          setError(
            error instanceof Error
              ? error.message
              : "Unable to load offers",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void fetchOffers();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeOffers = useMemo(() => {
    const now = new Date();

    return offers.filter((offer) => {
      if (!offer.isActive) {
        return false;
      }

      const startDate =
        new Date(offer.startDate);

      const endDate =
        new Date(offer.endDate);

      return (
        now >= startDate &&
        now <= endDate
      );
    });
  }, [offers]);

  const formatDate = (
    date: string,
  ) => {
    return new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    ).format(new Date(date));
  };

  const getDiscountLabel = (
    offer: Offer,
  ) => {
    if (
      offer.discountType ===
      "percentage"
    ) {
      return `${offer.discountValue}% OFF`;
    }

    return `₹${offer.discountValue.toLocaleString(
      "en-IN",
    )} OFF`;
  };

  const getAppliesToLabel = (
    offer: Offer,
  ) => {
    if (
      offer.appliesTo === "all"
    ) {
      return "Applicable on all products";
    }

    if (
      offer.appliesTo === "products"
    ) {
      const count =
        offer.productIds.length;

      return `Applicable on ${count} ${
        count === 1
          ? "selected product"
          : "selected products"
      }`;
    }

    const count =
      offer.collectionIds.length;

    return `Applicable on ${count} ${
      count === 1
        ? "selected collection"
        : "selected collections"
    }`;
  };

  const handleCopyOffer = async (
    offer: Offer,
  ) => {
    try {
      await navigator.clipboard.writeText(
        offer.name,
      );

      setCopiedOfferId(offer._id);

      window.setTimeout(() => {
        setCopiedOfferId(null);
      }, 2000);
    } catch (error) {
      console.error(
        "Failed to copy offer:",
        error,
      );
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] text-[#302B25]">
        <div className="mx-auto max-w-345 px-4 pb-20 pt-8 sm:px-7 sm:pt-11 lg:px-10 lg:pb-28 lg:pt-14">
          <div className="animate-pulse">
            <div className="h-3 w-24 rounded bg-[#E8E0D5]" />

            <div className="mt-4 h-12 w-64 max-w-full rounded bg-[#E8E0D5]" />

            <div className="mt-4 h-4 w-96 max-w-full rounded bg-[#E8E0D5]" />
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[22px] border border-[#E4DCCF] bg-white"
              >
                <div className="h-36 animate-pulse bg-[#F0E9DF]" />

                <div className="space-y-4 p-6">
                  <div className="h-3 w-20 rounded bg-[#E8E0D5]" />

                  <div className="h-7 w-44 rounded bg-[#E8E0D5]" />

                  <div className="h-3 w-full rounded bg-[#E8E0D5]" />

                  <div className="h-10 w-full rounded bg-[#E8E0D5]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#FAF8F5] text-[#302B25]">
        <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-5 py-12 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-180 rounded-[28px] border border-[#E3D9CC] bg-[#F5EEE4] px-6 py-14 text-center shadow-[0_20px_70px_rgba(73,56,38,0.06)] sm:px-12 sm:py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#CDBB9F] bg-[#FAF8F5]">
              <Tag
                size={25}
                strokeWidth={1.25}
                className="text-[#9A7138]"
              />
            </div>

            <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A4773E]">
              Special Offers
            </p>

            <h1 className="mt-3 font-serif text-[36px] leading-[1.05] tracking-[-0.035em] text-[#302B25] sm:text-[48px]">
              Unable to load offers.
            </h1>

            <p className="mx-auto mt-4 max-w-108 text-[12px] leading-6 text-[#81776C] sm:text-[13px]">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="group mt-8 inline-flex h-12 items-center justify-center gap-3 rounded-[10px] bg-[#8F6B3F] px-7 text-[9px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#795832] active:scale-[0.98]"
            >
              Try Again

              <ArrowRight
                size={14}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#302B25]">
      <div className="mx-auto max-w-345 px-4 pb-20 pt-8 sm:px-7 sm:pt-11 lg:px-10 lg:pb-28 lg:pt-14">
        <header className="relative overflow-hidden border-b border-[#E2D8CC] pb-8 sm:pb-10">
          <span className="pointer-events-none absolute -right-2 -top-14 hidden font-serif text-[160px] leading-none text-[#B7894A]/5 sm:block lg:text-[210px]">
            %
          </span>

          <div className="relative max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="h-px w-7 bg-[#B7894A]" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.27em] text-[#A4773E]">
                Special Savings
              </p>
            </div>

            <h1 className="mt-4 font-serif text-[40px] leading-none tracking-[-0.04em] text-[#302B25] sm:text-[52px] lg:text-[62px]">
              Offers & Savings
            </h1>

            <p className="mt-4 max-w-145 text-[11px] leading-6 text-[#81776C] sm:text-[13px]">
              Discover active offers on selected pieces and
              collections. Your eligible discount is applied
              automatically when you shop.
            </p>
          </div>
        </header>

        {activeOffers.length === 0 ? (
          <section className="flex min-h-105 flex-col items-center justify-center py-12 text-center">
            <div className="flex h-17 w-17 items-center justify-center rounded-full border border-[#D8C7B2] bg-[#F4EDE3]">
              <Sparkles
                size={28}
                strokeWidth={1.25}
                className="text-[#A4773E]"
              />
            </div>

            <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#A4773E]">
              Nothing Active Right Now
            </p>

            <h2 className="mt-3 font-serif text-[30px] tracking-tight text-[#302B25] sm:text-[38px]">
              New offers are coming soon.
            </h2>

            <p className="mt-3 max-w-md text-[11px] leading-6 text-[#81776C] sm:text-[12px]">
              Explore our collection and check back soon for
              exclusive savings on beautifully selected pieces.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
              className="group mt-7 inline-flex h-12 items-center justify-center gap-3 rounded-[10px] bg-[#8F6B3F] px-7 text-[9px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_25px_rgba(143,107,63,0.16)] transition-all duration-300 hover:bg-[#795832] active:scale-[0.98]"
            >
              Explore Products

              <ArrowRight
                size={14}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </section>
        ) : (
          <>
            <div className="mt-7 flex items-center justify-between sm:mt-9">
              <div className="flex items-center gap-2">
                <Sparkles
                  size={15}
                  strokeWidth={1.4}
                  className="text-[#A4773E]"
                />

                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6E6255]">
                  {activeOffers.length} Active{" "}
                  {activeOffers.length === 1
                    ? "Offer"
                    : "Offers"}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/products")
                }
                className="group hidden items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#8B8176] transition-colors hover:text-[#9A7138] sm:flex"
              >
                Explore Collection

                <ArrowRight
                  size={13}
                  strokeWidth={1.4}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>

            <section className="mt-5 grid gap-4 sm:mt-6 md:grid-cols-2 lg:gap-5 xl:grid-cols-3">
              {activeOffers.map(
                (offer) => (
                  <article
                    key={offer._id}
                    className="group relative overflow-hidden rounded-[22px] border border-[#E1D7CA] bg-white shadow-[0_8px_30px_rgba(58,45,31,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D0B996] hover:shadow-[0_16px_40px_rgba(58,45,31,0.08)]"
                  >
                    <div className="relative overflow-hidden border-b border-[#E5DBCF] bg-[#F3E9DC] px-5 py-5 sm:px-6 sm:py-6">
                      <span className="pointer-events-none absolute -right-3 -top-8 font-serif text-[105px] leading-none text-[#B7894A]/10">
                        %
                      </span>

                      <div className="relative flex items-start justify-between gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D6C09D] bg-[#FAF7F2] text-[#A4773E]">
                          <Tag
                            size={20}
                            strokeWidth={1.4}
                          />
                        </div>

                        <span className="rounded-full border border-[#D7BE98] bg-[#FFF9F1] px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#9A7138]">
                          Active Now
                        </span>
                      </div>

                      <div className="relative mt-5">
                        <p className="font-serif text-[36px] leading-none tracking-[-0.04em] text-[#302B25] sm:text-[42px]">
                          {getDiscountLabel(
                            offer,
                          )}
                        </p>

                        <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.13em] text-[#8B7D6D]">
                          {getAppliesToLabel(
                            offer,
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <h2 className="font-serif text-[25px] leading-tight tracking-tight text-[#302B25]">
                        {offer.name}
                      </h2>

                      {offer.description && (
                        <p className="mt-3 min-h-10 text-[10px] leading-5 text-[#81776C] sm:text-[11px]">
                          {offer.description}
                        </p>
                      )}

                      {!offer.description && (
                        <p className="mt-3 min-h-10 text-[10px] leading-5 text-[#81776C] sm:text-[11px]">
                          Save on your favourite pieces while
                          this special offer is active.
                        </p>
                      )}

                      <div className="mt-5 flex items-center gap-2.5 border-t border-[#EEE6DC] pt-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F8F3EC] text-[#9A7138]">
                          <CalendarDays
                            size={14}
                            strokeWidth={1.35}
                          />
                        </div>

                        <div>
                          <p className="text-[7px] font-semibold uppercase tracking-[0.15em] text-[#A0988D]">
                            Valid Until
                          </p>

                          <p className="mt-0.5 text-[9px] font-medium text-[#5F554A]">
                            {formatDate(
                              offer.endDate,
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyOffer(
                              offer,
                            )
                          }
                          className="flex h-11 items-center justify-center gap-2 rounded-[10px] border border-[#DDD1C2] bg-[#FCFAF7] text-[8px] font-semibold uppercase tracking-[0.13em] text-[#6F6356] transition-all hover:border-[#CDB48F] hover:bg-[#F8F1E8] hover:text-[#9A7138]"
                        >
                          {copiedOfferId ===
                          offer._id ? (
                            <>
                              <Check
                                size={13}
                                strokeWidth={1.6}
                              />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy
                                size={13}
                                strokeWidth={1.5}
                              />
                              {offer.name}
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigate("/products")
                          }
                          className="group flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#8F6B3F] text-white transition-all hover:bg-[#795832] active:scale-95"
                          aria-label="Shop offer"
                        >
                          <ArrowRight
                            size={15}
                            strokeWidth={1.5}
                            className="transition-transform duration-300 group-hover:translate-x-0.5"
                          />
                        </button>
                      </div>
                    </div>
                  </article>
                ),
              )}
            </section>

            <section className="mt-10 overflow-hidden rounded-[22px] border border-[#DED2C3] bg-[#F3EDE4] sm:mt-14">
              <div className="grid gap-7 px-5 py-7 sm:px-8 sm:py-9 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles
                      size={15}
                      strokeWidth={1.4}
                      className="text-[#A4773E]"
                    />

                    <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#A4773E]">
                      Automatic Savings
                    </p>
                  </div>

                  <h2 className="mt-3 font-serif text-[28px] leading-tight tracking-tight text-[#302B25] sm:text-[34px]">
                    No coupon code needed.
                  </h2>

                  <p className="mt-3 max-w-2xl text-[10px] leading-5 text-[#81776C] sm:text-[11px]">
                    Eligible offers are automatically applied to
                    your products and reflected in your cart and
                    checkout before you place your order.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/products")
                  }
                  className="group flex h-12 shrink-0 items-center justify-center gap-3 rounded-[10px] bg-[#8F6B3F] px-6 text-[9px] font-semibold uppercase tracking-[0.17em] text-white shadow-[0_10px_25px_rgba(143,107,63,0.16)] transition-all duration-300 hover:bg-[#795832] active:scale-[0.98]"
                >
                  Start Shopping

                  <ArrowRight
                    size={14}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
};

export default Offers;