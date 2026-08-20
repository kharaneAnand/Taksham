import type {
  Category,
  CreateCategoryPayload,
  CreateSubcategoryPayload,
} from "../types/category";

const CATEGORY_API_URL =
  import.meta.env.VITE_PRODUCT_SERVICE_URL?.replace(
    "/products",
    "/categories",
  ) ||
  "http://localhost:5002/api/v1/categories";

/*
 * ========================================
 * REQUEST HELPER
 * ========================================
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
        "Category request failed",
    );
  }

  return result.data as T;
};

/*
 * ========================================
 * GET ALL CATEGORIES
 * ========================================
 */

export const getCategories = async (): Promise<
  Category[]
> => {
  return request<Category[]>(
    CATEGORY_API_URL,
    {
      method: "GET",
    },
  );
};

/*
 * ========================================
 * GET CATEGORY BY SLUG
 * ========================================
 */

export const getCategoryBySlug = async (
  slug: string,
): Promise<Category> => {
  return request<Category>(
    `${CATEGORY_API_URL}/${encodeURIComponent(
      slug,
    )}`,
    {
      method: "GET",
    },
  );
};

/*
 * ========================================
 * CREATE CATEGORY
 * ========================================
 */

export const createCategory = async (
  payload: CreateCategoryPayload,
): Promise<Category> => {
  return request<Category>(
    CATEGORY_API_URL,
    {
      method: "POST",

      body: JSON.stringify(
        payload,
      ),
    },
  );
};

/*
 * ========================================
 * ADD SUBCATEGORY
 * ========================================
 */

export const createSubcategory = async (
  categoryId: string,
  payload: CreateSubcategoryPayload,
): Promise<Category> => {
  return request<Category>(
    `${CATEGORY_API_URL}/${encodeURIComponent(
      categoryId,
    )}/subcategories`,
    {
      method: "POST",

      body: JSON.stringify(
        payload,
      ),
    },
  );
};

/*
 * ========================================
 * DELETE CATEGORY
 * ========================================
 */

export const deleteCategory = async (
  id: string,
): Promise<void> => {
  await request<unknown>(
    `${CATEGORY_API_URL}/${encodeURIComponent(
      id,
    )}`,
    {
      method: "DELETE",
    },
  );
};

/*
 * ========================================
 * DELETE SUBCATEGORY
 * ========================================
 */

export const deleteSubcategory = async (
  categoryId: string,
  subcategoryId: string,
): Promise<Category> => {
  return request<Category>(
    `${CATEGORY_API_URL}/${encodeURIComponent(
      categoryId,
    )}/subcategories/${encodeURIComponent(
      subcategoryId,
    )}`,
    {
      method: "DELETE",
    },
  );
};