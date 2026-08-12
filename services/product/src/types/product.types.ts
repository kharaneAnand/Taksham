import { Types } from "mongoose";

export interface IProductVariant {
  _id?: Types.ObjectId;

  color?: string;

  images: string[];

  price?: number;

  stock?: number;

  material?: string;
}

export interface IProduct {
  name: string;

  slug: string;

  price: number;

  image: string;

  category: string;

  subcategory?: string;

  room: string;

  material?: string;

  colors?: string[];

  description?: string;

  rating?: number;

  reviews?: number;

  isNew?: boolean;

  stock: number;

  variants?: IProductVariant[];

  createdAt?: Date;

  updatedAt?: Date;
}