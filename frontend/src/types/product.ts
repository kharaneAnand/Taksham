export interface ProductVariant {
  id: number;
  color?: string;

  images: string[];


  price?: number;

  stock?: number;

  material?: string;
}

export interface Product {
  id: number;

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

  variants?: ProductVariant[];
}