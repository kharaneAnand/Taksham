import type { Product, ProductVariant } from "./product";

export interface CartItem {
  id: string;

  product: Product;

  variant?: ProductVariant;

  quantity: number;

  price: number;
}

export interface Cart {
  items: CartItem[];

  totalItems: number;

  subtotal: number;
}