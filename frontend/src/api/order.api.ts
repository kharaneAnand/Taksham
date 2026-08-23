import type {
  CreateOrderInput,
  CreatePaymentOrderResponse,
  Order,
  VerifyPaymentInput,
  AdminOrdersResponse,
  GetAdminOrdersParams,
} from "../types/order";

/*
 * ========================================
 * API URLs
 * ========================================
 */

const ORDER_API_URL =
  import.meta.env.VITE_ORDER_SERVICE_URL ||
  "http://localhost:5004/api/v1/orders";

const ORDER_SERVICE_BASE_URL =
  ORDER_API_URL.replace(
    /\/orders$/,
    "",
  );

const PAYMENT_API_URL =
  `${ORDER_SERVICE_BASE_URL}/payments`;

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
      "Order API error:",
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
                  Array.isArray(issue?.path)
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
 * Orders
 * ========================================
 */

/*
 * Create Order
 *
 * POST /api/v1/orders
 */

export const createOrder = (
  data: CreateOrderInput,
): Promise<Order> => {
  return request<Order>(
    ORDER_API_URL,
    {
      method: "POST",

      body: JSON.stringify(
        data,
      ),
    },
  );
};

/*
 * Get Current User Orders
 *
 * GET /api/v1/orders
 */

export const getMyOrders =
  (): Promise<Order[]> => {
    return request<Order[]>(
      ORDER_API_URL,
      {
        method: "GET",
      },
    );
  };

/*
 * Get Single Order
 *
 * GET /api/v1/orders/:id
 */

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

/*
 * Cancel Order
 *
 * PATCH /api/v1/orders/:id/cancel
 */

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

/*
 * ========================================
 * Razorpay
 * ========================================
 */

/*
 * Create Razorpay Payment Order
 */

export const createPaymentOrder = (
  orderId: string,
): Promise<CreatePaymentOrderResponse> => {
  return request<CreatePaymentOrderResponse>(
    `${PAYMENT_API_URL}/create-order`,
    {
      method: "POST",

      body: JSON.stringify({
        orderId,
      }),
    },
  );
};

/*
 * Verify Razorpay Payment
 */

export const verifyPayment = (
  data: VerifyPaymentInput,
): Promise<Order> => {
  return request<Order>(
    `${PAYMENT_API_URL}/verify`,
    {
      method: "POST",

      body: JSON.stringify(
        data,
      ),
    },
  );
};

/*
 * ========================================
 * ADMIN - Get All Orders
 *
 * GET /api/v1/orders/admin
 * ========================================
 */

export const getAllOrders = (
  params: GetAdminOrdersParams = {},
): Promise<AdminOrdersResponse> => {
  const searchParams =
    new URLSearchParams();

  if (params.page) {
    searchParams.set(
      "page",
      String(params.page),
    );
  }

  if (params.limit) {
    searchParams.set(
      "limit",
      String(params.limit),
    );
  }

  if (
    params.search &&
    params.search.trim()
  ) {
    searchParams.set(
      "search",
      params.search.trim(),
    );
  }

  if (params.orderStatus) {
    searchParams.set(
      "orderStatus",
      params.orderStatus,
    );
  }

  if (params.paymentStatus) {
    searchParams.set(
      "paymentStatus",
      params.paymentStatus,
    );
  }

  if (params.paymentMethod) {
    searchParams.set(
      "paymentMethod",
      params.paymentMethod,
    );
  }

  if (params.sort) {
    searchParams.set(
      "sort",
      params.sort,
    );
  }

  const queryString =
    searchParams.toString();

  const url =
    `${ORDER_API_URL}/admin${
      queryString
        ? `?${queryString}`
        : ""
    }`;

  return request<AdminOrdersResponse>(
    url,
    {
      method: "GET",
    },
  );
};

/*
 * ========================================
 * Get Orders By User ID - ADMIN
 *
 * GET /api/v1/orders/admin/user/:userId
 * ========================================
 */

export const getOrdersByUserId = (
  userId: string,
): Promise<Order[]> => {
  return request<Order[]>(
    `${ORDER_API_URL}/admin/user/${encodeURIComponent(
      userId,
    )}`,
    {
      method: "GET",
    },
  );
};