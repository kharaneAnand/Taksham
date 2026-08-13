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
  ) => void;

  updateQuantity: (
    itemId: string,
    quantity: number,
  ) => void;

  removeFromCart: (
    itemId: string,
  ) => void;

  clearCart: () => void;
}

const CartContext =
  createContext<CartContextValue | undefined>(
    undefined,
  );

interface CartProviderProps {
  children: ReactNode;
}

const CART_STORAGE_KEY = "taksham_cart";

export const CartProvider = ({
  children,
}: CartProviderProps) => {
  /*
   * ----------------------------------------
   * Cart State
   * ----------------------------------------
   */

  const [items, setItems] = useState<CartItem[]>(
    () => {
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
    },
  );

  /*
   * ----------------------------------------
   * Persist Cart
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

  const addToCart = (
    product: Product,
    options?: AddToCartOptions,
  ) => {
    const variant = options?.variantId
      ? product.variants?.find(
          (item) =>
            item._id ===
            options.variantId,
        )
      : undefined;

    const price =
      variant?.price ??
      product.price;

    /*
     * Different variants of the same
     * product must be different cart items.
     */
    const itemId = variant
      ? `${product._id}-${variant._id}`
      : product._id;

    setItems((currentItems) => {
      const existingItem =
        currentItems.find(
          (item) =>
            item.id === itemId,
        );

      /*
       * Product already exists in cart
       * → increase quantity
       */
      if (existingItem) {
        return currentItems.map(
          (item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item,
        );
      }

      /*
       * New cart item
       */
      return [
        ...currentItems,
        {
          id: itemId,
          product,
          variant,
          quantity: 1,
          price,
        },
      ];
    });

    toast.success(
      `${product.name} added to cart`,
    );
  };

  /*
   * ----------------------------------------
   * Update Quantity
   * ----------------------------------------
   */

  const updateQuantity = (
    itemId: string,
    quantity: number,
  ) => {
    /*
     * Quantity cannot be zero.
     * If user reaches zero,
     * remove the item instead.
     */
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );
  };

  /*
   * ----------------------------------------
   * Remove Item
   * ----------------------------------------
   */

  const removeFromCart = (
    itemId: string,
  ) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          item.id !== itemId,
      ),
    );

    toast.success(
      "Item removed from cart",
    );
  };

  /*
   * ----------------------------------------
   * Clear Cart
   * ----------------------------------------
   */

  const clearCart = () => {
    setItems([]);

    toast.success(
      "Cart cleared",
    );
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
   * Context
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