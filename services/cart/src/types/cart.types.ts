import type { Types } from "mongoose";

export interface ICartItem {
  _id: Types.ObjectId;

  productId: string;

  variantId?: string;

  quantity: number;
}

export interface ICart {
  _id: Types.ObjectId;

  userId: string;

  items: ICartItem[];

  createdAt: Date;

  updatedAt: Date;
}

export interface ICartItemInput {
  productId: string;

  variantId?: string;

  quantity: number;
}