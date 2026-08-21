import type {
  Product,
  ProductImage,
} from "./product";

/*
 * ========================================
 * COLLECTION
 * ========================================
 */

export interface Collection {
  _id: string;

  name: string;

  slug: string;

  description?: string;

  image?: ProductImage;

  /*
   * When fetched as a list, products may
   * be IDs. When fetched by ID/slug, the
   * backend populates them.
   */
  products: Array<
    string | Product
  >;

  isActive: boolean;

  createdAt?: string;

  updatedAt?: string;
}

/*
 * ========================================
 * CREATE PAYLOAD
 * ========================================
 */

export interface CreateCollectionPayload {
  name: string;

  slug: string;

  description?: string;

  image?: ProductImage;

  products: string[];

  isActive?: boolean;
}

/*
 * ========================================
 * UPDATE PAYLOAD
 * ========================================
 */

export type UpdateCollectionPayload =
  Partial<CreateCollectionPayload>;