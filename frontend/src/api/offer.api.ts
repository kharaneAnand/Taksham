import type {
  Collection,
} from "../types/collection";

import type {
  Product,
} from "../types/product";

import type {
  CreateOfferPayload,
  Offer,
  UpdateOfferPayload,
} from "../types/offer";

const UTILS_API_URL =
  import.meta.env.VITE_UTILS_SERVICE_URL ||
  "http://localhost:5005/api/v1";

const OFFER_API_URL =
  `${UTILS_API_URL}/offers`;

/* ========================================
 * RESPONSE TYPES
 * ======================================== */

interface OfferResponseData {
  offer: Offer;
}

interface OfferListResponseData {
  offers: Offer[];
}

/* ========================================
 * REQUEST HELPER
 * ======================================== */

const request = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(
    url,
    {
      ...options,

      credentials: "include",

      headers: {
        Accept: "application/json",

        "Content-Type":
          "application/json",

        ...(options?.headers || {}),
      },
    },
  );

  const result =
    (await response.json()) as {
      success?: boolean;
      message?: string;
      data?: T;
      errors?: unknown;
    };

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Offer request failed",
    );
  }

  return result.data as T;
};

/* ========================================
 * GET ALL OFFERS
 * ======================================== */

export const getOffers = async (): Promise<
  Offer[]
> => {
  const data =
    await request<
      Offer[] | OfferListResponseData
    >(
      OFFER_API_URL,
      {
        method: "GET",
      },
    );

  /*
   * Supports both backend response styles:
   *
   * data: []
   *
   * or
   *
   * data: {
   *   offers: []
   * }
   */

  if (Array.isArray(data)) {
    return data;
  }

  return data.offers;
};

/* ========================================
 * GET ACTIVE OFFERS
 * ======================================== */

export const getActiveOffers =
  async (): Promise<Offer[]> => {
    const data =
      await request<
        Offer[] | OfferListResponseData
      >(
        `${OFFER_API_URL}/active`,
        {
          method: "GET",
        },
      );

    if (Array.isArray(data)) {
      return data;
    }

    return data.offers;
  };

/* ========================================
 * GET OFFER BY ID
 * ======================================== */

export const getOfferById = async (
  id: string,
): Promise<Offer> => {
  const data =
    await request<
      Offer | OfferResponseData
    >(
      `${OFFER_API_URL}/${encodeURIComponent(
        id,
      )}`,
      {
        method: "GET",
      },
    );

  if (
    typeof data === "object" &&
    data !== null &&
    "offer" in data
  ) {
    return data.offer;
  }

  return data as Offer;
};

/* ========================================
 * CREATE OFFER
 * ======================================== */

export const createOffer = async (
  payload: CreateOfferPayload,
): Promise<Offer> => {
  const data =
    await request<
      Offer | OfferResponseData
    >(
      OFFER_API_URL,
      {
        method: "POST",

        body: JSON.stringify(
          payload,
        ),
      },
    );

  if (
    typeof data === "object" &&
    data !== null &&
    "offer" in data
  ) {
    return data.offer;
  }

  return data as Offer;
};

/* ========================================
 * UPDATE OFFER
 * ======================================== */

export const updateOffer = async (
  id: string,
  payload: UpdateOfferPayload,
): Promise<Offer> => {
  const data =
    await request<
      Offer | OfferResponseData
    >(
      `${OFFER_API_URL}/${encodeURIComponent(
        id,
      )}`,
      {
        method: "PATCH",

        body: JSON.stringify(
          payload,
        ),
      },
    );

  if (
    typeof data === "object" &&
    data !== null &&
    "offer" in data
  ) {
    return data.offer;
  }

  return data as Offer;
};

/* ========================================
 * DELETE OFFER
 * ======================================== */

export const deleteOffer = async (
  id: string,
): Promise<void> => {
  await request<unknown>(
    `${OFFER_API_URL}/${encodeURIComponent(
      id,
    )}`,
    {
      method: "DELETE",
    },
  );
};

/* ========================================
 * HELPER TYPES
 *
 * These are intentionally imported above
 * for future populated offer handling.
 * ======================================== */

export type OfferProduct =
  Product;

export type OfferCollection =
  Collection;