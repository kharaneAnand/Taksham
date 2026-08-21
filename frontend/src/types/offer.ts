import type { Product } from "./product";

import type { Collection } from "./collection";

/* ========================================
 * ENUMS
 * ======================================== */

export type OfferDiscountType =
  | "percentage"
  | "fixed";

export type OfferAppliesTo =
  | "all"
  | "products"
  | "collections";

/* ========================================
 * OFFER
 * ======================================== */

export interface Offer {
  _id: string;

  name: string;

  slug: string;

  description?: string;

  discountType: OfferDiscountType;

  discountValue: number;

  appliesTo: OfferAppliesTo;

  /*
   * Backend may populate these fields
   * when returning offer details.
   */
  productIds: Array<
    string | Product
  >;

  collectionIds: Array<
    string | Collection
  >;

  startDate: string;

  endDate: string;

  isActive: boolean;

  createdAt?: string;

  updatedAt?: string;
}

/* ========================================
 * CREATE OFFER PAYLOAD
 * ======================================== */

export interface CreateOfferPayload {
  name: string;

  slug: string;

  description?: string;

  discountType: OfferDiscountType;

  discountValue: number;

  appliesTo: OfferAppliesTo;

  productIds: string[];

  collectionIds: string[];

  startDate: string;

  endDate: string;

  isActive?: boolean;
}

export type DiscountType =
  | "percentage"
  | "fixed";

export type AppliesTo =
  | "all"
  | "products"
  | "collections";

/* ========================================
 * UPDATE OFFER PAYLOAD
 * ======================================== */

export type UpdateOfferPayload =
  Partial<CreateOfferPayload>;