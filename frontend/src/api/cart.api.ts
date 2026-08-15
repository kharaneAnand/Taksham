import type {
  CartApiResponse,
} from "../types/cart";

const CART_API_URL =
  import.meta.env.VITE_CART_SERVICE_URL ||
  "http://localhost:5003/api/v1/cart";

interface AddCartItemPayload {
  productId: string;
  variantId?: string;
  quantity: number;
}

interface UpdateCartItemPayload {
  quantity: number;
}

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
        "Cart request failed",
    );
  }

  return result.data as T;
};

/*
 * ----------------------------------------
 * Get Cart
 * ----------------------------------------
 */

export const getCart =
  async (): Promise<CartApiResponse> => {
    return request<CartApiResponse>(
      CART_API_URL,
      {
        method: "GET",
      },
    );
  };

/*
 * ----------------------------------------
 * Add Cart Item
 * ----------------------------------------
 */

export const addCartItem = async (
  payload: AddCartItemPayload,
): Promise<CartApiResponse> => {
  return request<CartApiResponse>(
    `${CART_API_URL}/items`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
};

/*
 * ----------------------------------------
 * Update Cart Item
 * ----------------------------------------
 */

export const updateCartItem = async (
  itemId: string,
  payload: UpdateCartItemPayload,
): Promise<CartApiResponse> => {
  return request<CartApiResponse>(
    `${CART_API_URL}/items/${encodeURIComponent(
      itemId,
    )}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
};

/*
 * ----------------------------------------
 * Remove Cart Item
 * ----------------------------------------
 */

export const removeCartItem =
  async (
    itemId: string,
  ): Promise<CartApiResponse> => {
    return request<CartApiResponse>(
      `${CART_API_URL}/items/${encodeURIComponent(
        itemId,
      )}`,
      {
        method: "DELETE",
      },
    );
  };

/*
 * ----------------------------------------
 * Clear Cart
 * ----------------------------------------
 */

export const clearCart =
  async (): Promise<CartApiResponse> => {
    return request<CartApiResponse>(
      CART_API_URL,
      {
        method: "DELETE",
      },
    );
  };