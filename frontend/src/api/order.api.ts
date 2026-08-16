import type {
  CreateOrderInput,
  Order,
} from "../types/order";

const ORDER_API_URL =
  import.meta.env
    .VITE_ORDER_SERVICE_URL ||
  "http://localhost:5004/api/v1/orders";



const request = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const response = await fetch(url, {
    ...options,

    credentials: "include",

    headers: {
      Accept: "application/json",
      "Content-Type":
        "application/json",
      ...(options.headers || {}),
    },
  });

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message ||
        "Something went wrong",
    );
  }

  return result.data as T;
};

export const createOrder = (
  data: CreateOrderInput,
): Promise<Order> => {
  return request<Order>(
    ORDER_API_URL,
    {
      method: "POST",

      body: JSON.stringify(data),
    },
  );
};



export const getMyOrders =
  (): Promise<Order[]> => {
    return request<Order[]>(
      ORDER_API_URL,
      {
        method: "GET",
      },
    );
  };


export const getOrderById = (
  orderId: string,
): Promise<Order> => {
  return request<Order>(
    `${ORDER_API_URL}/${encodeURIComponent(
      orderId,
    )}`,
    {
      method: "GET",
    },
  );
};



export const cancelOrder = (
  orderId: string,
): Promise<Order> => {
  return request<Order>(
    `${ORDER_API_URL}/${encodeURIComponent(
      orderId,
    )}/cancel`,
    {
      method: "PATCH",
    },
  );
};