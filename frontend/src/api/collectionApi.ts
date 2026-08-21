import type {
  Collection,
  CreateCollectionPayload,
  UpdateCollectionPayload,
} from "../types/collection";

const COLLECTION_API_URL =
  import.meta.env.VITE_PRODUCT_SERVICE_URL?.replace(
    "/products",
    "/collections",
  ) ||
  "http://localhost:5002/api/v1/collections";

/*
 * ========================================
 * REQUEST HELPER
 * ========================================
 */

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
        "Collection request failed",
    );
  }

  return result.data as T;
};

/*
 * ========================================
 * GET ALL COLLECTIONS
 * ========================================
 */

export const getCollections = async (): Promise<
  Collection[]
> => {
  return request<Collection[]>(
    COLLECTION_API_URL,
    {
      method: "GET",
    },
  );
};

/*
 * ========================================
 * GET ACTIVE COLLECTIONS
 * ========================================
 */

export const getActiveCollections = async (): Promise<
  Collection[]
> => {
  return request<Collection[]>(
    `${COLLECTION_API_URL}/active`,
    {
      method: "GET",
    },
  );
};

/*
 * ========================================
 * GET COLLECTION BY ID
 * ========================================
 */

export const getCollectionById = async (
  id: string,
): Promise<Collection> => {
  return request<Collection>(
    `${COLLECTION_API_URL}/id/${encodeURIComponent(
      id,
    )}`,
    {
      method: "GET",
    },
  );
};

/*
 * ========================================
 * GET COLLECTION BY SLUG
 * ========================================
 */

export const getCollectionBySlug = async (
  slug: string,
): Promise<Collection> => {
  return request<Collection>(
    `${COLLECTION_API_URL}/${encodeURIComponent(
      slug,
    )}`,
    {
      method: "GET",
    },
  );
};

/*
 * ========================================
 * CREATE COLLECTION
 * ========================================
 */

export const createCollection = async (
  payload: CreateCollectionPayload,
): Promise<Collection> => {
  return request<Collection>(
    COLLECTION_API_URL,
    {
      method: "POST",

      body: JSON.stringify(
        payload,
      ),
    },
  );
};

/*
 * ========================================
 * UPDATE COLLECTION
 * ========================================
 */

export const updateCollection = async (
  id: string,
  payload: UpdateCollectionPayload,
): Promise<Collection> => {
  return request<Collection>(
    `${COLLECTION_API_URL}/${encodeURIComponent(
      id,
    )}`,
    {
      method: "PATCH",

      body: JSON.stringify(
        payload,
      ),
    },
  );
};

/*
 * ========================================
 * DELETE COLLECTION
 * ========================================
 */

export const deleteCollection = async (
  id: string,
): Promise<void> => {
  await request<unknown>(
    `${COLLECTION_API_URL}/${encodeURIComponent(
      id,
    )}`,
    {
      method: "DELETE",
    },
  );
};