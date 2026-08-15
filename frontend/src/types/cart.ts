import type {
  Product,
  ProductVariant,
} from "./product";

/*
 * Backend Cart Item
 */

export interface CartApiItem {
  _id: string;

  productId: string;

  variantId?: string;

  quantity: number;
}

/*
 * Backend Cart
 */

export interface CartApiResponse {
  _id: string;

  userId: string;

  items: CartApiItem[];

  createdAt: string;

  updatedAt: string;
}

/*
 * Frontend Cart Item
 */

export interface CartItem {
  id: string;

  product: Product;

  variant?: ProductVariant;

  quantity: number;

  price: number;
}

/*
 * Frontend Cart
 */

export interface Cart {
  items: CartItem[];

  totalItems: number;

  subtotal: number;
}