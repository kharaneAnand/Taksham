import type {
  Product,
} from "../types/product";

import type {
  Offer,
} from "../types/offer";

import type {
  Collection,
} from "../types/collection";

/* ========================================
 * DISCOUNTED PRODUCT PRICE
 * ======================================== */

export interface ProductOfferResult {
  offer: Offer | null;

  originalPrice: number;

  finalPrice: number;

  discountAmount: number;

  discountPercentage: number;
}

/* ========================================
 * DATE CHECK
 * ======================================== */

const isOfferCurrentlyValid = (
  offer: Offer,
): boolean => {
  if (!offer.isActive) {
    return false;
  }

  const now = new Date();

  const startDate =
    new Date(offer.startDate);

  const endDate =
    new Date(offer.endDate);

  return (
    now >= startDate &&
    now <= endDate
  );
};

/* ========================================
 * GET ID
 *
 * Supports both:
 *
 * "product-id"
 *
 * and populated objects:
 *
 * { _id: "product-id", ... }
 * ======================================== */

const getId = (
  value:
    | string
    | Product
    | Collection,
): string => {
  if (typeof value === "string") {
    return value;
  }

  return value._id;
};

/* ========================================
 * CHECK OFFER APPLIES TO PRODUCT
 * ======================================== */

const doesOfferApplyToProduct = (
  offer: Offer,
  product: Product,
  collections: Collection[],
): boolean => {
  /* ================================
   * ALL PRODUCTS
   * ================================ */

  if (offer.appliesTo === "all") {
    return true;
  }

  /* ================================
   * SPECIFIC PRODUCTS
   * ================================ */

  if (
    offer.appliesTo === "products"
  ) {
    return offer.productIds.some(
      (productId) =>
        getId(productId) === product._id,
    );
  }

  /* ================================
   * SPECIFIC COLLECTIONS
   * ================================ */

  if (
    offer.appliesTo === "collections"
  ) {
    const offerCollectionIds =
      offer.collectionIds.map(
        (collectionId) =>
          getId(collectionId),
      );

    return collections.some(
      (collection) => {
        const productExists =
          collection.products.some(
            (collectionProduct) => {
              const id =
                typeof collectionProduct ===
                "string"
                  ? collectionProduct
                  : collectionProduct._id;

              return (
                id === product._id
              );
            },
          );

        return (
          productExists &&
          offerCollectionIds.includes(
            collection._id,
          )
        );
      },
    );
  }

  return false;
};

/* ========================================
 * CALCULATE OFFER DISCOUNT
 * ======================================== */

const calculateDiscount = (
  price: number,
  offer: Offer,
): number => {
  if (
    offer.discountType ===
    "percentage"
  ) {
    return (
      price *
      (offer.discountValue / 100)
    );
  }

  return offer.discountValue;
};

/* ========================================
 * GET BEST OFFER
 *
 * If multiple offers apply,
 * customer receives the highest discount.
 * ======================================== */

export const getProductOffer = (
  product: Product,
  offers: Offer[],
  collections: Collection[] = [],
): ProductOfferResult => {
  const originalPrice =
    product.price;

  const applicableOffers =
    offers.filter(
      (offer) =>
        isOfferCurrentlyValid(offer) &&
        doesOfferApplyToProduct(
          offer,
          product,
          collections,
        ),
    );

  if (
    applicableOffers.length === 0
  ) {
    return {
      offer: null,

      originalPrice,

      finalPrice: originalPrice,

      discountAmount: 0,

      discountPercentage: 0,
    };
  }

  let bestOffer: Offer | null =
    null;

  let highestDiscount = 0;

  for (
    const offer of applicableOffers
  ) {
    const discountAmount =
      calculateDiscount(
        originalPrice,
        offer,
      );

    const validDiscount =
      Math.min(
        Math.max(discountAmount, 0),
        originalPrice,
      );

    if (
      validDiscount >
      highestDiscount
    ) {
      highestDiscount =
        validDiscount;

      bestOffer = offer;
    }
  }

  const finalPrice =
    Math.max(
      originalPrice -
        highestDiscount,
      0,
    );

  const discountPercentage =
    originalPrice > 0
      ? Math.round(
          (highestDiscount /
            originalPrice) *
            100,
        )
      : 0;

  return {
    offer: bestOffer,

    originalPrice,

    finalPrice,

    discountAmount:
      highestDiscount,

    discountPercentage,
  };
};