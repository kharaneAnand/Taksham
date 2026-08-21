import { Types } from "mongoose";

export interface ICollection {
  _id?: Types.ObjectId;

  name: string;

  slug: string;

  description?: string;

  image?: {
    url: string;

    publicId: string;
  };

  products: Types.ObjectId[];

  isActive: boolean;

  createdAt?: Date;

  updatedAt?: Date;
}