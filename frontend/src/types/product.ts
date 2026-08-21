export interface ProductImage {
  url: string;

  publicId: string;
}

export interface ProductVariant {
  _id: string;

  color?: string;

  images: ProductImage[];

  price?: number;

  stock?: number;

  material?: string;
}

export interface Product {
  _id: string;

  name: string;

  slug: string;

  price: number;

  /*
   * Primary / thumbnail image
   */
  image: ProductImage;

  /*
   * Full common product gallery
   *
   * Front view
   * Side view
   * Back view
   * Detail view
   */
  images?: ProductImage[];

  category: string;

  subcategory?: string;

  /*
   * Collection reference
   */
  collectionId?: string;

  room: string;

  material?: string;

  colors?: string[];

  description?: string;

  rating?: number;

  reviews?: number;

  isNewProduct?: boolean;

  stock: number;

  variants?: ProductVariant[];
}

export interface ProductPagination {
  page: number;

  limit: number;

  totalProducts: number;

  totalPages: number;

  hasNextPage: boolean;

  hasPreviousPage: boolean;
}

export interface ProductListResponse {
  products: Product[];

  pagination: ProductPagination;
}