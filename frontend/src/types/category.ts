export interface Subcategory {
  _id: string;

  name: string;

  slug: string;
}

export interface Category {
  _id: string;

  name: string;

  slug: string;

  subcategories: Subcategory[];
}

export interface CreateCategoryPayload {
  name: string;

  slug: string;
}

export interface CreateSubcategoryPayload {
  name: string;

  slug: string;
}