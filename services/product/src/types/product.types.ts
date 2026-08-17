import { Types } from "mongoose";



export interface IProductVariant {
  /*
   * Mongoose automatically generates this
   * ID for every variant.
   */
  _id: Types.ObjectId;

  color?: string;

  images: string[];

  price?: number;

  stock?: number;

  material?: string;
}



export interface IProduct {
  _id?: Types.ObjectId;

  name: string;

  slug: string;

  price: number;

  image: string;

  images: string[];

  category: string;

  subcategory?: string;

  room: string;

  material?: string;

  colors?: string[];

  description?: string;

  rating?: number;

  reviews?: number;

  isNewProduct?: boolean;

  stock: number;

  variants?: IProductVariant[];

  createdAt?: Date;

  updatedAt?: Date;
}