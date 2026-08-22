import type {
  Order,
  OrderStatus,
} from "../types/order";

/*
 * ========================================
 * API URL
 * ========================================
 */

const ORDER_API_URL =
  import.meta.env.VITE_ORDER_SERVICE_URL ||
  "http://localhost:5004/api/v1/orders";

/*
 * ========================================
 * Types
 * ========================================
 */

export interface AdminOrdersResponse {
  orders: Order[];

  pagination: {
    page: number;
    limit: number;
    totalOrders: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/*
 * ========================================
 * Request Helper
 * ========================================
 */

const request = async <T>(
  url: string,
  options: RequestInit = {},
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

        ...(options.headers || {}),
      },
    },
  );

  const result =
    await response.json();

  if (!response.ok) {
    console.error(
      "Admin Order API error:",
      {
        url,
        status: response.status,
        result,
      },
    );

    const validationIssues =
      result?.errors ||
      result?.issues ||
      result?.data;

    const validationMessage =
      Array.isArray(validationIssues)
        ? validationIssues
            .map(
              (issue) => {
                const field =
                  Array.isArray(
                    issue?.path,
                  )
                    ? issue.path.join(".")
                    : "";

                return field
                  ? `${field}: ${issue.message}`
                  : issue.message;
              },
            )
            .filter(Boolean)
            .join(", ")
        : "";

    throw new Error(
      validationMessage ||
        result?.message ||
        result?.error?.message ||
        "Something went wrong",
    );
  }

  return result.data as T;
};

/*
 * ========================================
 * Get All Admin Orders
 *
 * GET /api/v1/orders/admin
 * ========================================
 */

export const getAllOrders =
  (): Promise<AdminOrdersResponse> => {
    return request<AdminOrdersResponse>(
      `${ORDER_API_URL}/admin`,
      {
        method: "GET",
      },
    );
  };

/*
 * ========================================
 * Get Single Admin Order
 *
 * Since the current backend does not have
 * a separate GET /admin/:id endpoint,
 * fetch admin orders and find the order
 * from the admin-accessible response.
 * ========================================
 */

export const getAdminOrderById = async (
  orderId: string,
): Promise<Order> => {
  const result =
    await getAllOrders();

  const order =
    result.orders.find(
      (item) =>
        item._id === orderId,
    );

  if (!order) {
    throw new Error(
      "Order not found",
    );
  }

  return order;
};

/*
 * ========================================
 * Update Order Status
 *
 * PATCH /api/v1/orders/:id/status
 * ========================================
 */

export const updateOrderStatus = (
  orderId: string,
  orderStatus: OrderStatus,
): Promise<Order> => {
  return request<Order>(
    `${ORDER_API_URL}/${encodeURIComponent(
      orderId,
    )}/status`,
    {
      method: "PATCH",

      body: JSON.stringify({
        orderStatus,
      }),
    },
  );
};