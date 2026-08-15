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

import {
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
  clearWishlist as clearWishlistApi,
} from "../api/wishlist.api";

interface WishlistContextValue {
  productIds: string[];

  totalItems: number;

  isWishlisted: (
    productId: string,
  ) => boolean;

  addToWishlist: (
    product: Product,
  ) => Promise<void>;

  removeFromWishlist: (
    productId: string,
  ) => Promise<void>;

  toggleWishlist: (
    product: Product,
  ) => Promise<void>;

  clearWishlist: () => Promise<void>;
}

const WishlistContext =
  createContext<
    WishlistContextValue | undefined
  >(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

const WISHLIST_STORAGE_KEY =
  "taksham_wishlist";

export const WishlistProvider = ({
  children,
}: WishlistProviderProps) => {
  /*
   * ----------------------------------------
   * Wishlist State
   * ----------------------------------------
   */

  const [productIds, setProductIds] =
    useState<string[]>(() => {
      try {
        const saved =
          localStorage.getItem(
            WISHLIST_STORAGE_KEY,
          );

        if (!saved) {
          return [];
        }

        return JSON.parse(saved) as string[];
      } catch (error) {
        console.error(
          "Failed to load wishlist cache:",
          error,
        );

        return [];
      }
    });

  /*
   * ----------------------------------------
   * Persist Local Cache
   * ----------------------------------------
   */

  useEffect(() => {
    try {
      localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(productIds),
      );
    } catch (error) {
      console.error(
        "Failed to save wishlist cache:",
        error,
      );
    }
  }, [productIds]);

  /*
   * ----------------------------------------
   * Load Wishlist From Backend
   * ----------------------------------------
   */

  useEffect(() => {
    let cancelled = false;

    const loadWishlist = async () => {
      try {
        const wishlist =
          await getWishlist();

        if (cancelled) {
          return;
        }

        setProductIds(
          wishlist.items.map(
            (item) =>
              item.productId,
          ),
        );
      } catch (error) {
        /*
         * Don't show a toast here.
         *
         * A logged-out user can legitimately
         * receive 401 from the wishlist API.
         */
        console.error(
          "Failed to load wishlist:",
          error,
        );
      }
    };

    loadWishlist();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * ----------------------------------------
   * Check Wishlist
   * ----------------------------------------
   */

  const isWishlisted = (
    productId: string,
  ): boolean => {
    return productIds.includes(
      productId,
    );
  };

  /*
   * ----------------------------------------
   * Add To Wishlist
   * ----------------------------------------
   */

  const addToWishlist = async (
    product: Product,
  ): Promise<void> => {
    try {
      await addWishlistItem({
        productId: product._id,
      });

      setProductIds(
        (currentIds) => {
          if (
            currentIds.includes(
              product._id,
            )
          ) {
            return currentIds;
          }

          return [
            ...currentIds,
            product._id,
          ];
        },
      );

      toast.success(
        `${product.name} added to wishlist`,
      );
    } catch (error) {
      console.error(
        "Failed to add to wishlist:",
        error,
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to add to wishlist",
      );
    }
  };

  /*
   * ----------------------------------------
   * Remove From Wishlist
   * ----------------------------------------
   */

  const removeFromWishlist =
    async (
      productId: string,
    ): Promise<void> => {
      try {
        await removeWishlistItem(
          productId,
        );

        setProductIds(
          (currentIds) =>
            currentIds.filter(
              (id) =>
                id !== productId,
            ),
        );

        toast.success(
          "Removed from wishlist",
        );
      } catch (error) {
        console.error(
          "Failed to remove wishlist item:",
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
   * Toggle Wishlist
   * ----------------------------------------
   */

  const toggleWishlist = async (
    product: Product,
  ): Promise<void> => {
    if (
      isWishlisted(product._id)
    ) {
      await removeFromWishlist(
        product._id,
      );

      return;
    }

    await addToWishlist(product);
  };

  /*
   * ----------------------------------------
   * Clear Wishlist
   * ----------------------------------------
   */

  const clearWishlist =
    async (): Promise<void> => {
      try {
        await clearWishlistApi();

        setProductIds([]);

        toast.success(
          "Wishlist cleared",
        );
      } catch (error) {
        console.error(
          "Failed to clear wishlist:",
          error,
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to clear wishlist",
        );
      }
    };

  /*
   * ----------------------------------------
   * Wishlist Count
   * ----------------------------------------
   */

  const totalItems = useMemo(
    () => productIds.length,
    [productIds],
  );

  /*
   * ----------------------------------------
   * Provider
   * ----------------------------------------
   */

  return (
    <WishlistContext.Provider
      value={{
        productIds,
        totalItems,
        isWishlisted,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

/*
 * ----------------------------------------
 * useWishlist Hook
 * ----------------------------------------
 */

export const useWishlist = () => {
  const context =
    useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider",
    );
  }

  return context;
};