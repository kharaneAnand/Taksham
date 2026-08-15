import type {
  Product,
  ProductListResponse,
} from "../types/product";

const PRODUCT_API_URL =
  import.meta.env.VITE_PRODUCT_SERVICE_URL ||
  "http://localhost:5002/api/v1/products";

export type ProductSort =
  | "price_asc"
  | "price_desc"
  | "rating"
  | "newest"
  | "oldest"
  | "popular";

export interface ProductQueryParams {
  page?: number;
  limit?: number;

  search?: string;

  category?: string;
  subcategory?: string;
  room?: string;
  material?: string;
  color?: string;

  minPrice?: number;
  maxPrice?: number;

  sort?: ProductSort;
}

export const getProducts = async (
  params: ProductQueryParams = {},
): Promise<ProductListResponse> => {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set(
      "page",
      String(params.page),
    );
  }

  if (params.limit !== undefined) {
    searchParams.set(
      "limit",
      String(params.limit),
    );
  }

  if (params.search?.trim()) {
    searchParams.set(
      "search",
      params.search.trim(),
    );
  }

  if (params.category?.trim()) {
    searchParams.set(
      "category",
      params.category.trim(),
    );
  }

  if (params.subcategory?.trim()) {
    searchParams.set(
      "subcategory",
      params.subcategory.trim(),
    );
  }

  if (params.room?.trim()) {
    searchParams.set(
      "room",
      params.room.trim(),
    );
  }

  if (params.material?.trim()) {
    searchParams.set(
      "material",
      params.material.trim(),
    );
  }

  if (params.color?.trim()) {
    searchParams.set(
      "color",
      params.color.trim(),
    );
  }

  if (params.minPrice !== undefined) {
    searchParams.set(
      "minPrice",
      String(params.minPrice),
    );
  }

  if (params.maxPrice !== undefined) {
    searchParams.set(
      "maxPrice",
      String(params.maxPrice),
    );
  }

  if (params.sort) {
    searchParams.set(
      "sort",
      params.sort,
    );
  }

  const queryString =
    searchParams.toString();

  const url = queryString
    ? `${PRODUCT_API_URL}?${queryString}`
    : PRODUCT_API_URL;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message ||
        "Failed to fetch products",
    );
  }

  return result.data as ProductListResponse;
};

export const getProductBySlug = async (
  slug: string,
): Promise<Product> => {
  const response = await fetch(
    `${PRODUCT_API_URL}/${encodeURIComponent(slug)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message ||
        "Failed to fetch product",
    );
  }

  return result.data as Product;
};

export const getProductById = async (
  id: string,
): Promise<Product> => {
  const response = await fetch(
    `${PRODUCT_API_URL}/id/${encodeURIComponent(id)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message ||
        "Failed to fetch product",
    );
  }

  return result.data as Product;
};