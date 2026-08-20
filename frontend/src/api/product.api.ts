import type {
  Product,
  ProductImage,
  ProductListResponse,
} from "../types/product";

const PRODUCT_API_URL =
  import.meta.env.VITE_PRODUCT_SERVICE_URL ||
  "http://localhost:5002/api/v1/products";

/*
 * =====================================================
 * TYPES
 * =====================================================
 */

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

/*
 * =====================================================
 * PRODUCT VARIANT PAYLOAD
 * =====================================================
 */

export interface CreateProductVariantPayload {
  color?: string;

  /*
   * Images uploaded to Cloudinary.
   */
  images: ProductImage[];

  price?: number;

  stock?: number;

  material?: string;
}

/*
 * =====================================================
 * CREATE PRODUCT PAYLOAD
 * =====================================================
 */

export interface CreateProductPayload {
  name: string;

  slug: string;

  price: number;

  /*
   * Main / cover image.
   *
   * {
   *   url: "...",
   *   publicId: "..."
   * }
   */
  image: ProductImage;

  /*
   * Common product gallery.
   *
   * Example:
   * Front view
   * Side view
   * Back view
   * Detail view
   */
  images?: ProductImage[];

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

  /*
   * Color-wise / variant-wise images.
   */
  variants?: CreateProductVariantPayload[];
}

/*
 * =====================================================
 * UPDATE PRODUCT PAYLOAD
 * =====================================================
 */

export type UpdateProductPayload =
  Partial<CreateProductPayload>;

/*
 * =====================================================
 * REQUEST HELPER
 * =====================================================
 */

const request = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(
    url,
    {
      ...options,

      credentials: "include",

      headers: {
        Accept: "application/json",

        "Content-Type":
          "application/json",

        ...(options?.headers || {}),
      },
    },
  );

  const result =
    (await response.json()) as {
      success?: boolean;
      message?: string;
      data?: T;
      errors?: unknown;
    };

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Product request failed",
    );
  }

  return result.data as T;
};

/*
 * =====================================================
 * GET PRODUCTS
 * =====================================================
 */

export const getProducts = async (
  params: ProductQueryParams = {},
): Promise<ProductListResponse> => {
  const searchParams =
    new URLSearchParams();

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

  return request<ProductListResponse>(
    url,
    {
      method: "GET",
    },
  );
};

/*
 * =====================================================
 * GET PRODUCT BY SLUG
 * =====================================================
 */

export const getProductBySlug = async (
  slug: string,
): Promise<Product> => {
  return request<Product>(
    `${PRODUCT_API_URL}/${encodeURIComponent(
      slug,
    )}`,
    {
      method: "GET",
    },
  );
};

/*
 * =====================================================
 * GET PRODUCT BY ID
 * =====================================================
 */

export const getProductById = async (
  id: string,
): Promise<Product> => {
  return request<Product>(
    `${PRODUCT_API_URL}/id/${encodeURIComponent(
      id,
    )}`,
    {
      method: "GET",
    },
  );
};

/*
 * =====================================================
 * CREATE PRODUCT
 * =====================================================
 */

export const createProduct = async (
  payload: CreateProductPayload,
): Promise<Product> => {
  return request<Product>(
    PRODUCT_API_URL,
    {
      method: "POST",

      body: JSON.stringify(
        payload,
      ),
    },
  );
};

/*
 * =====================================================
 * UPDATE PRODUCT
 * =====================================================
 */

export const updateProduct = async (
  id: string,
  payload: UpdateProductPayload,
): Promise<Product> => {
  return request<Product>(
    `${PRODUCT_API_URL}/${encodeURIComponent(
      id,
    )}`,
    {
      method: "PATCH",

      body: JSON.stringify(
        payload,
      ),
    },
  );
};

/*
 * =====================================================
 * DELETE PRODUCT
 * =====================================================
 */

export const deleteProduct = async (
  id: string,
): Promise<void> => {
  await request<unknown>(
    `${PRODUCT_API_URL}/${encodeURIComponent(
      id,
    )}`,
    {
      method: "DELETE",
    },
  );
};