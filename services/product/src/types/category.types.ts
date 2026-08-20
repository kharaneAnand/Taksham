import { Types } from "mongoose";

export interface ISubcategory {
  _id?: Types.ObjectId;

  name: string;

  slug: string;
}

export interface ICategory {
  _id?: Types.ObjectId;

  name: string;

  slug: string;

  subcategories: ISubcategory[];

  createdAt?: Date;

  updatedAt?: Date;
}