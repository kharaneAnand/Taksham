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

/* 
 * ========================================
 * CREATE CATEGORY
 * ========================================
 */

export interface CreateCategoryPayload {
  name: string;

  slug: string;
}

/* 
 * ========================================
 * UPDATE CATEGORY
 * ========================================
 */

export interface UpdateCategoryPayload {
  name?: string;

  slug?: string;
}

/* 
 * ========================================
 * CREATE SUBCATEGORY
 * ========================================
 */

export interface CreateSubcategoryPayload {
  name: string;

  slug: string;
}

/* 
 * ========================================
 * UPDATE SUBCATEGORY
 * ========================================
 */

export interface UpdateSubcategoryPayload {
  name?: string;

  slug?: string;
}