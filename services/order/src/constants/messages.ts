export const ORDER_MESSAGES = {
  ORDER_CREATED:
    "Order created successfully",

  ORDERS_FETCHED:
    "Orders fetched successfully",

  ORDER_FETCHED:
    "Order fetched successfully",

  ORDER_CANCELLED:
    "Order cancelled successfully",

  ORDER_NOT_FOUND:
    "Order not found",

  CART_EMPTY:
    "Cart is empty",

  INVALID_ORDER:
    "Invalid order",
} as const;

export const AUTH_MESSAGES = {
  INVALID_TOKEN:
    "Invalid token",

  TOKEN_EXPIRED:
    "Token expired",
} as const;

export const SERVER_MESSAGES = {
  INTERNAL_SERVER_ERROR:
    "Internal server error",
} as const;