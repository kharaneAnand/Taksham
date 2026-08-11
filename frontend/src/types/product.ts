export interface Product {
  id: string;
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
}