import { Types } from "mongoose";


export interface IProductImage {
  url: string;

  publicId: string;
}


export interface IProductVariant {
 
  _id: Types.ObjectId;

  color?: string;

 
  images: IProductImage[];

  price?: number;

  stock?: number;

  material?: string;
}

export interface IProduct {
  _id?: Types.ObjectId;

  name: string;

  slug: string;

  price: number;

  
  image: IProductImage;

  images: IProductImage[];

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