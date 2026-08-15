import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import toast from "react-hot-toast";

import type { Product } from "../types/product";
import type { CartItem } from "../types/cart";

import {
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartApi,
} from "../api/cart.api";

interface AddToCartOptions {
  variantId?: string;
}

interface CartContextValue {
  items: CartItem[];

  totalItems: number;

  subtotal: number;

  addToCart: (
    product: Product,
    options?: AddToCartOptions,
  ) => Promise<void>;

  updateQuantity: (
    itemId: string,
    quantity: number,
  ) => Promise<void>;

  removeFromCart: (
    itemId: string,
  ) => Promise<void>;

  clearCart: () => Promise<void>;
}

const CartContext =
  createContext<
    CartContextValue | undefined
  >(undefined);

interface CartProviderProps {
  children: ReactNode;
}

const CART_STORAGE_KEY =
  "taksham_cart";

export const CartProvider = ({
  children,
}: CartProviderProps) => {
  /*
   * ----------------------------------------
   * Cart State
   * ----------------------------------------
   */

  const [items, setItems] =
    useState<CartItem[]>(() => {
      try {
        const savedCart =
          localStorage.getItem(
            CART_STORAGE_KEY,
          );

        if (!savedCart) {
          return [];
        }

        return JSON.parse(
          savedCart,
        ) as CartItem[];
      } catch (error) {
        console.error(
          "Failed to load cart:",
          error,
        );

        return [];
      }
    });

  /*
   * ----------------------------------------
   * Persist Cart UI Cache
   * ----------------------------------------
   */

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(items),
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error,
      );
    }
  }, [items]);

  /*
   * ----------------------------------------
   * Add To Cart
   * ----------------------------------------
   */

  const addToCart = async (
    product: Product,
    options?: AddToCartOptions,
  ) => {
    const variant =
      options?.variantId
        ? product.variants?.find(
            (item) =>
              item._id ===
              options.variantId,
          )
        : undefined;

    if (
      options?.variantId &&
      !variant
    ) {
      toast.error(
        "Selected variant is unavailable",
      );

      return;
    }

    const price =
      variant?.price ??
      product.price;

    try {
      /*
       * ------------------------------------
       * Save to backend
       * ------------------------------------
       */

      const cart =
        await addCartItem({
          productId:
            product._id,

          ...(variant
            ? {
                variantId:
                  variant._id,
              }
            : {}),

          quantity: 1,
        });

      /*
       * ------------------------------------
       * Find the backend cart item
       * ------------------------------------
       */

      const backendItem =
        cart.items.find(
          (item) =>
            item.productId ===
              product._id &&
            (item.variantId ??
              undefined) ===
              (variant?._id ??
                undefined),
        );

      if (!backendItem) {
        throw new Error(
          "Cart item was not returned by the server",
        );
      }

      /*
       * ------------------------------------
       * Update frontend state
       * ------------------------------------
       */

      setItems((currentItems) => {
        const existingItem =
          currentItems.find(
            (item) =>
              item.id ===
              backendItem._id,
          );

        if (existingItem) {
          return currentItems.map(
            (item) =>
              item.id ===
              backendItem._id
                ? {
                    ...item,
                    quantity:
                      backendItem.quantity,
                    price,
                  }
                : item,
          );
        }

        /*
         * Handle an older local item
         * that used the frontend-generated ID.
         */

        const oldItemId = variant
          ? `${product._id}-${variant._id}`
          : product._id;

        const oldItem =
          currentItems.find(
            (item) =>
              item.id === oldItemId,
          );

        if (oldItem) {
          return currentItems.map(
            (item) =>
              item.id ===
              oldItemId
                ? {
                    ...item,
                    id: backendItem._id,
                    quantity:
                      backendItem.quantity,
                    price,
                    product,
                    variant,
                  }
                : item,
          );
        }

        return [
          ...currentItems,
          {
            id: backendItem._id,

            product,

            ...(variant
              ? {
                  variant,
                }
              : {}),

            quantity:
              backendItem.quantity,

            price,
          },
        ];
      });

      toast.success(
        `${product.name} added to cart`,
      );
    } catch (error) {
      console.error(
        "Failed to add item to cart:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add item to cart",
      );
    }
  };

  /*
   * ----------------------------------------
   * Update Quantity
   * ----------------------------------------
   */

  const updateQuantity = async (
    itemId: string,
    quantity: number,
  ) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);

      return;
    }

    try {
      const cart =
        await updateCartItem(
          itemId,
          {
            quantity,
          },
        );

      const backendItem =
        cart.items.find(
          (item) =>
            item._id === itemId,
        );

      if (!backendItem) {
        throw new Error(
          "Cart item not found after update",
        );
      }

      setItems((currentItems) =>
        currentItems.map(
          (item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity:
                    backendItem.quantity,
                }
              : item,
        ),
      );
    } catch (error) {
      console.error(
        "Failed to update cart quantity:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update quantity",
      );
    }
  };

  /*
   * ----------------------------------------
   * Remove Item
   * ----------------------------------------
   */

  const removeFromCart = async (
    itemId: string,
  ) => {
    try {
      await removeCartItem(itemId);

      setItems((currentItems) =>
        currentItems.filter(
          (item) =>
            item.id !== itemId,
        ),
      );

      toast.success(
        "Item removed from cart",
      );
    } catch (error) {
      console.error(
        "Failed to remove cart item:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to remove item",
      );
    }
  };

  /*
   * ----------------------------------------
   * Clear Cart
   * ----------------------------------------
   */

  const clearCart = async () => {
    try {
      await clearCartApi();

      setItems([]);

      toast.success(
        "Cart cleared",
      );
    } catch (error) {
      console.error(
        "Failed to clear cart:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to clear cart",
      );
    }
  };

  /*
   * ----------------------------------------
   * Total Items
   * ----------------------------------------
   */

  const totalItems = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity,
        0,
      ),
    [items],
  );

  /*
   * ----------------------------------------
   * Subtotal
   * ----------------------------------------
   */

  const subtotal = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total +
          item.price *
            item.quantity,
        0,
      ),
    [items],
  );

  /*
   * ----------------------------------------
   * Context Provider
   * ----------------------------------------
   */

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/*
 * ----------------------------------------
 * useCart Hook
 * ----------------------------------------
 */

export const useCart = () => {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider",
    );
  }

  return context;
};