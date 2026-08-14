export const AUTH_MESSAGES = {
  INVALID_TOKEN: "Invalid token",
  TOKEN_EXPIRED: "Token expired",
} as const;

export const SERVER_MESSAGES = {
  INTERNAL_SERVER_ERROR:
    "Internal server error",
} as const;

export const CART_MESSAGES = {
  CART_FETCHED:
    "Cart fetched successfully",

  ITEM_ADDED:
    "Item added to cart successfully",

  ITEM_UPDATED:
    "Cart item updated successfully",

  ITEM_REMOVED:
    "Item removed from cart successfully",

  CART_CLEARED:
    "Cart cleared successfully",

  CART_EMPTY:
    "Cart is empty",

  PRODUCT_NOT_FOUND:
    "Product not found",

  VARIANT_NOT_FOUND:
    "Product variant not found",

  INSUFFICIENT_STOCK:
    "Insufficient stock",
} as const;