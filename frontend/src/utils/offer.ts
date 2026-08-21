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

  if (
    Number.isNaN(startDate.getTime()) ||
    Number.isNaN(endDate.getTime())
  ) {
    return false;
  }

  return (
    now >= startDate &&
    now <= endDate
  );
};

/* ========================================
 * GET ID
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
  collections: Collection[] = [],
): boolean => {
  /* ALL PRODUCTS */

  if (offer.appliesTo === "all") {
    return true;
  }

  /* SPECIFIC PRODUCTS */

  if (offer.appliesTo === "products") {
    return (
      offer.productIds?.some(
        (productId) =>
          getId(productId) === product._id,
      ) ?? false
    );
  }

  /* SPECIFIC COLLECTIONS */

  if (offer.appliesTo === "collections") {
    const offerCollectionIds =
      (offer.collectionIds ?? []).map(
        (collectionId) =>
          getId(collectionId),
      );

    return collections.some(
      (collection) => {
        if (
          !offerCollectionIds.includes(
            collection._id,
          )
        ) {
          return false;
        }

        return (
          collection.products?.some(
            (collectionProduct) => {
              const productId =
                typeof collectionProduct ===
                "string"
                  ? collectionProduct
                  : collectionProduct._id;

              return (
                productId === product._id
              );
            },
          ) ?? false
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
  const discountValue =
    Number(offer.discountValue) || 0;

  if (discountValue <= 0 || price <= 0) {
    return 0;
  }

  /* PERCENTAGE OFFER */

  if (offer.discountType === "percentage") {
    return (
      price *
      Math.min(
        Math.max(discountValue, 0),
        100,
      ) /
      100
    );
  }

  /* FIXED OFFER */

  if (offer.discountType === "fixed") {
    return Math.min(
      discountValue,
      price,
    );
  }

  return 0;
};

/* ========================================
 * GET BEST OFFER
 *
 * IMPORTANT:
 * Percentage offers are compared using
 * their actual discount amount for this
 * specific product.
 * ======================================== */

export const getProductOffer = (
  product: Product,
  offers: Offer[] = [],
  collections: Collection[] = [],
): ProductOfferResult => {
  const originalPrice =
    Number(product.price) || 0;

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