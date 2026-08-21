import mongoose from "mongoose";

import ApiError from "../helpers/ApiError.js";

import Order from "../models/order.model.js";

import Coupon, {
  type ICoupon,
} from "../models/coupon.model.js";

import env from "../config/env.js";

import {
  StatusCodes,
} from "../constants/http.js";

import {
  ORDER_MESSAGES,
} from "../constants/messages.js";

import type {
  CreateOrderInput,
  UpdateOrderStatusInput,
  AdminOrderQueryInput,
} from "../validators/order.validator.js";

/*
 * ========================================
 * Types
 * ========================================
 */

interface ProductImageResponse {
  url: string;

  publicId?: string;
}

interface CartItemResponse {
  productId: string;

  variantId?: string;

  quantity: number;
}

interface CartResponse {
  _id?: string;

  userId: string;

  items: CartItemResponse[];
}

interface ProductVariantResponse {
  _id: string;

  color?: string;

  material?: string;

  price?: number;

  stock?: number;

  images?: Array<
    ProductImageResponse | string
  >;
}

interface ProductResponse {
  _id: string;

  name: string;

  price: number;

  stock: number;

  image:
    | ProductImageResponse
    | string;

  images?: Array<
    ProductImageResponse | string
  >;

  variants?: ProductVariantResponse[];
}

/*
 * ========================================
 * Offer Types
 * ========================================
 */

type OfferDiscountType =
  | "percentage"
  | "fixed";

type OfferAppliesTo =
  | "all"
  | "products"
  | "collections";

interface OfferReference {
  _id?: string;
}

interface OfferResponse {
  _id: string;

  discountType:
    OfferDiscountType;

  discountValue: number;

  appliesTo:
    OfferAppliesTo;

  productIds?: Array<
    string | OfferReference
  >;

  collectionIds?: Array<
    string | OfferReference
  >;

  isActive: boolean;

  startDate: string;

  endDate: string;
}

interface CollectionProductReference {
  _id?: string;
}

interface CollectionResponse {
  _id: string;

  products?: Array<
    string | CollectionProductReference
  >;
}

interface StockItem {
  productId: string;

  quantity: number;

  variantId?: string;
}

interface CouponDiscountResult {
  couponCode?: string;

  discountAmount: number;

  coupon?: ICoupon;
}

/*
 * ========================================
 * Helpers
 * ========================================
 */

const getImageUrl = (
  image:
    | ProductImageResponse
    | string
    | undefined
    | null,
): string => {
  if (!image) {
    return "";
  }

  if (
    typeof image ===
    "string"
  ) {
    return image;
  }

  return image.url || "";
};

const getReferenceId = (
  value:
    | string
    | OfferReference
    | CollectionProductReference,
): string => {
  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  return value._id || "";
};

/*
 * ========================================
 * Order Status Transitions
 * ========================================
 */

const ORDER_STATUS_FLOW = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
] as const;

/*
 * ========================================
 * Order Service
 * ========================================
 */

class OrderService {
  /*
   * ========================================
   * Get Cart
   * ========================================
   */

  private async getCart(
    accessToken: string,
  ): Promise<CartResponse> {
    const response =
      await fetch(
        env.CART_SERVICE_URL,
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",

            Cookie:
              `accessToken=${accessToken}`,
          },
        },
      );

    let result:
      | {
          success?: boolean;
          message?: string;
          data?: CartResponse;
        }
      | null = null;

    try {
      result =
        (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: CartResponse;
        };
    } catch {
      result = null;
    }

    if (
      !response.ok ||
      !result?.data
    ) {
      throw new ApiError(
        response.status ===
          StatusCodes.NOT_FOUND
          ? StatusCodes.NOT_FOUND
          : StatusCodes.BAD_REQUEST,

        result?.message ||
          ORDER_MESSAGES.CART_EMPTY,
      );
    }

    return result.data;
  }

  /*
   * ========================================
   * Get Product By ID
   * ========================================
   */

  private async getProductById(
    productId: string,
  ): Promise<ProductResponse> {
    const response =
      await fetch(
        `${
          env.PRODUCT_SERVICE_URL
        }/id/${encodeURIComponent(
          productId,
        )}`,
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",
          },
        },
      );

    let result:
      | {
          success?: boolean;
          message?: string;
          data?: ProductResponse;
        }
      | null = null;

    try {
      result =
        (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: ProductResponse;
        };
    } catch {
      result = null;
    }

    if (
      !response.ok ||
      !result?.data
    ) {
      throw new ApiError(
        response.status ===
          StatusCodes.NOT_FOUND
          ? StatusCodes.NOT_FOUND
          : StatusCodes.BAD_REQUEST,

        result?.message ||
          "Product not found",
      );
    }

    return result.data;
  }

  /*
   * ========================================
   * Get All Offers
   * ========================================
   */

  private async getAllOffers(): Promise<
    OfferResponse[]
  > {
    const url =
      `${env.UTILS_SERVICE_URL}/offers`;

    let response: Response;

    try {
      response =
        await fetch(
          url,
          {
            method: "GET",

            headers: {
              Accept:
                "application/json",
            },
          },
        );
    } catch (error) {
      console.error(
        "Unable to connect to Utils Service:",
        {
          url,
          error,
        },
      );

      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Unable to connect to Utils Service",
      );
    }

    let result:
      | {
          success?: boolean;
          message?: string;
          data?: OfferResponse[];
        }
      | null = null;

    try {
      result =
        (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: OfferResponse[];
        };
    } catch {
      result = null;
    }

    if (!response.ok) {
      throw new ApiError(
        response.status >= 400 &&
          response.status < 500
          ? response.status
          : StatusCodes.INTERNAL_SERVER_ERROR,

        result?.message ||
          "Failed to fetch offers",
      );
    }

    if (!result?.success) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        result?.message ||
          "Invalid offers response",
      );
    }

    return result.data || [];
  }

  /*
   * ========================================
   * Get All Collections
   * ========================================
   */

  private async getAllCollections(): Promise<
    CollectionResponse[]
  > {
    const response =
      await fetch(
        `${env.UTILS_SERVICE_URL}/collections`,
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",

            "x-internal-service-secret":
              env.INTERNAL_SERVICE_SECRET,
          },
        },
      );

    let result:
      | {
          success?: boolean;
          message?: string;
          data?: CollectionResponse[];
          collections?: CollectionResponse[];
        }
      | null = null;

    try {
      result =
        (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: CollectionResponse[];
          collections?: CollectionResponse[];
        };
    } catch {
      result = null;
    }

    if (!response.ok) {
      return [];
    }

    return (
      result?.data ||
      result?.collections ||
      []
    );
  }

  /*
   * ========================================
   * Check Offer Date
   * ========================================
   */

  private isOfferCurrentlyValid(
    offer: OfferResponse,
  ): boolean {
    if (!offer.isActive) {
      return false;
    }

    const now =
      new Date();

    const startDate =
      new Date(
        offer.startDate,
      );

    const endDate =
      new Date(
        offer.endDate,
      );

    if (
      Number.isNaN(
        startDate.getTime(),
      ) ||
      Number.isNaN(
        endDate.getTime(),
      )
    ) {
      return false;
    }

    return (
      now >= startDate &&
      now <= endDate
    );
  }

  /*
   * ========================================
   * Check Whether Offer Applies
   * ========================================
   */

  private doesOfferApplyToProduct(
    offer: OfferResponse,
    productId: string,
    collections: CollectionResponse[],
  ): boolean {
    if (
      offer.appliesTo ===
      "all"
    ) {
      return true;
    }

    if (
      offer.appliesTo ===
      "products"
    ) {
      return (
        offer.productIds?.some(
          (item) =>
            getReferenceId(
              item,
            ) === productId,
        ) || false
      );
    }

    if (
      offer.appliesTo ===
      "collections"
    ) {
      const offerCollectionIds =
        (offer.collectionIds || []).map(
          (item) =>
            getReferenceId(item),
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
              (item) =>
                getReferenceId(
                  item,
                ) === productId,
            ) || false
          );
        },
      );
    }

    return false;
  }

  /*
   * ========================================
   * Calculate Offer Discount
   * ========================================
   */

  private calculateOfferDiscount(
    price: number,
    offer: OfferResponse,
  ): number {
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
  }

  /*
   * ========================================
   * Get Best Offer For Product
   * ========================================
   */

  private getBestOfferForProduct(
    productId: string,
    price: number,
    offers: OfferResponse[],
    collections: CollectionResponse[],
  ): {
    finalPrice: number;
    discountAmount: number;
  } {
    const applicableOffers =
      offers.filter(
        (offer) =>
          this.isOfferCurrentlyValid(
            offer,
          ) &&
          this.doesOfferApplyToProduct(
            offer,
            productId,
            collections,
          ),
      );

    let highestDiscount = 0;

    for (
      const offer of applicableOffers
    ) {
      const discount =
        this.calculateOfferDiscount(
          price,
          offer,
        );

      const validDiscount =
        Math.min(
          Math.max(
            discount,
            0,
          ),
          price,
        );

      if (
        validDiscount >
        highestDiscount
      ) {
        highestDiscount =
          validDiscount;
      }
    }

    return {
      finalPrice:
        Math.max(
          price -
            highestDiscount,
          0,
        ),

      discountAmount:
        highestDiscount,
    };
  }

  /*
   * ========================================
   * Validate And Calculate Coupon
   * ========================================
   */

  private async calculateCouponDiscount(
    couponCode: string | undefined,
    subtotal: number,
  ): Promise<CouponDiscountResult> {
    if (!couponCode) {
      return {
        discountAmount: 0,
      };
    }

    const couponModel =
      Coupon as mongoose.Model<ICoupon>;

    const coupon =
      await couponModel.findOne({
        code:
          couponCode
            .trim()
            .toUpperCase(),
      });

    if (!coupon) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Invalid coupon code",
      );
    }

    const now =
      new Date();

    if (!coupon.isActive) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "This coupon is not active",
      );
    }

    if (
      now < coupon.startDate
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "This coupon is not active yet",
      );
    }

    if (
      now > coupon.endDate
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "This coupon has expired",
      );
    }

    if (
      subtotal <
      coupon.minimumOrderAmount
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Minimum order amount of ₹${coupon.minimumOrderAmount} is required for this coupon`,
      );
    }

    if (
      coupon.usageLimit !==
        undefined &&
      coupon.usedCount >=
        coupon.usageLimit
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "This coupon usage limit has been reached",
      );
    }

    let discountAmount = 0;

    if (
      coupon.discountType ===
      "percentage"
    ) {
      discountAmount =
        (subtotal *
          coupon.discountValue) /
        100;

      if (
        coupon.maximumDiscountAmount !==
          undefined &&
        discountAmount >
          coupon.maximumDiscountAmount
      ) {
        discountAmount =
          coupon.maximumDiscountAmount;
      }
    } else {
      discountAmount =
        coupon.discountValue;
    }

    discountAmount =
      Math.min(
        discountAmount,
        subtotal,
      );

    return {
      couponCode:
        coupon.code,

      discountAmount,

      coupon,
    };
  }

  /*
   * ========================================
   * PRODUCT STOCK
   * ========================================
   */

  private async decreaseProductStock(
    productId: string,
    quantity: number,
    variantId?: string,
  ): Promise<void> {
    const response =
      await fetch(
        `${env.PRODUCT_SERVICE_URL}/internal/decrease-stock`,
        {
          method: "POST",

          headers: {
            Accept:
              "application/json",

            "Content-Type":
              "application/json",

            "x-internal-service-secret":
              env.INTERNAL_SERVICE_SECRET,
          },

          body: JSON.stringify({
            productId,

            quantity,

            ...(variantId
              ? {
                  variantId,
                }
              : {}),
          }),
        },
      );

    let result:
      | {
          success?: boolean;
          message?: string;
          data?: unknown;
        }
      | null = null;

    try {
      result =
        (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: unknown;
        };
    } catch {
      result = null;
    }

    if (!response.ok) {
      throw new ApiError(
        response.status >= 400 &&
          response.status < 500
          ? response.status
          : StatusCodes.BAD_REQUEST,

        result?.message ||
          "Failed to update product stock",
      );
    }
  }

  /*
   * ========================================
   * Increase Product Stock
   * ========================================
   */

  private async increaseProductStock(
    productId: string,
    quantity: number,
    variantId?: string,
  ): Promise<void> {
    const response =
      await fetch(
        `${env.PRODUCT_SERVICE_URL}/internal/increase-stock`,
        {
          method: "POST",

          headers: {
            Accept:
              "application/json",

            "Content-Type":
              "application/json",

            "x-internal-service-secret":
              env.INTERNAL_SERVICE_SECRET,
          },

          body: JSON.stringify({
            productId,

            quantity,

            ...(variantId
              ? {
                  variantId,
                }
              : {}),
          }),
        },
      );

    let result:
      | {
          success?: boolean;
          message?: string;
          data?: unknown;
        }
      | null = null;

    try {
      result =
        (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: unknown;
        };
    } catch {
      result = null;
    }

    if (!response.ok) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,

        result?.message ||
          "Failed to restore product stock",
      );
    }
  }

  /*
   * ========================================
   * Stock For Complete Order
   * ========================================
   */

  private async decreaseStockForOrder(
    items: Array<{
      productId: string;
      quantity: number;
      variantId?: string;
    }>,
  ): Promise<StockItem[]> {
    const deductedItems:
      StockItem[] = [];

    try {
      for (
        const item of items
      ) {
        await this.decreaseProductStock(
          item.productId,
          item.quantity,
          item.variantId,
        );

        deductedItems.push({
          productId:
            item.productId,

          quantity:
            item.quantity,

          ...(item.variantId
            ? {
                variantId:
                  item.variantId,
              }
            : {}),
        });
      }

      return deductedItems;
    } catch (error) {
      if (
        deductedItems.length > 0
      ) {
        try {
          await this.restoreStock(
            deductedItems,
          );
        } catch {
          throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Stock update failed and inventory rollback also failed. Manual inventory reconciliation is required.",
          );
        }
      }

      throw error;
    }
  }

  /*
   * ========================================
   * Restore Stock
   * ========================================
   */

  private async restoreStock(
    items: StockItem[],
  ): Promise<void> {
    for (
      let index =
        items.length - 1;
      index >= 0;
      index--
    ) {
      const item =
        items[index];

      if (!item) {
        continue;
      }

      await this.increaseProductStock(
        item.productId,
        item.quantity,
        item.variantId,
      );
    }
  }

  /*
   * ========================================
   * Clear Cart
   * ========================================
   */

  private async clearCart(
    accessToken: string,
  ): Promise<void> {
    const response =
      await fetch(
        env.CART_SERVICE_URL,
        {
          method: "DELETE",

          headers: {
            Accept:
              "application/json",

            Cookie:
              `accessToken=${accessToken}`,
          },
        },
      );

    let result:
      | {
          message?: string;
        }
      | null = null;

    try {
      result =
        (await response.json()) as {
          message?: string;
        };
    } catch {
      result = null;
    }

    if (!response.ok) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        result?.message ||
          "Failed to clear cart",
      );
    }
  }

  /*
   * ========================================
   * CREATE ORDER
   * ========================================
   */

  async createOrder(
    userId: string,
    accessToken: string,
    data: CreateOrderInput,
  ) {
    const cart =
      await this.getCart(
        accessToken,
      );

    if (
      !cart.items ||
      cart.items.length === 0
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        ORDER_MESSAGES.CART_EMPTY,
      );
    }

    const [
      offers,
      collections,
    ] =
      await Promise.all([
        this.getAllOffers(),
        this.getAllCollections(),
      ]);

    /*
     * Each order item now stores:
     *
     * originalPrice:
     * Product price before automatic offer
     *
     * price:
     * Final price after automatic offer
     *
     * discountAmount:
     * Automatic discount for ONE quantity
     *
     * subtotal:
     * Final price × quantity
     */

    const orderItems: Array<{
      productId: string;
      productName: string;
      productImage: string;
      variantId?: string;
      variant?: {
        color?: string;
        material?: string;
        image?: string;
      };
      quantity: number;
      originalPrice: number;
      price: number;
      discountAmount: number;
      subtotal: number;
    }> = [];

    /*
     * subtotal = total after automatic
     * product offers but before coupon.
     */

    let subtotal = 0;

    for (
      const cartItem of cart.items
    ) {
      const product =
        await this.getProductById(
          cartItem.productId,
        );

      let originalPrice =
        product.price;

      let availableStock =
        product.stock;

      let productImage =
        getImageUrl(
          product.image,
        );

      let variantSnapshot:
        | {
            color?: string;
            material?: string;
            image?: string;
          }
        | undefined;

      if (cartItem.variantId) {
        const variant =
          product.variants?.find(
            (item) =>
              item._id ===
              cartItem.variantId,
          );

        if (!variant) {
          throw new ApiError(
            StatusCodes.NOT_FOUND,
            "Product variant not found",
          );
        }

        originalPrice =
          variant.price ??
          product.price;

        availableStock =
          variant.stock ??
          product.stock;

        const variantImage =
          getImageUrl(
            variant.images?.[0],
          );

        productImage =
          variantImage ||
          productImage;

        variantSnapshot = {
          ...(variant.color
            ? {
                color:
                  variant.color,
              }
            : {}),

          ...(variant.material
            ? {
                material:
                  variant.material,
              }
            : {}),

          ...(productImage
            ? {
                image:
                  productImage,
              }
            : {}),
        };
      }

      if (
        cartItem.quantity >
        availableStock
      ) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          `Insufficient stock for ${product.name}`,
        );
      }

      /*
       * Apply automatic product offer.
       */

      const offerResult =
        this.getBestOfferForProduct(
          product._id,
          originalPrice,
          offers,
          collections,
        );

      const finalPrice =
        offerResult.finalPrice;

      const productDiscountAmount =
        offerResult.discountAmount;

      /*
       * Final subtotal for this item.
       */

      const itemSubtotal =
        finalPrice *
        cartItem.quantity;

      subtotal +=
        itemSubtotal;

      orderItems.push({
        productId:
          product._id,

        productName:
          product.name,

        productImage,

        ...(cartItem.variantId
          ? {
              variantId:
                cartItem.variantId,
            }
          : {}),

        ...(variantSnapshot
          ? {
              variant:
                variantSnapshot,
            }
          : {}),

        quantity:
          cartItem.quantity,

        /*
         * IMPORTANT:
         * Original price before offer.
         * Frontend uses this as the
         * cut/strikethrough price.
         */

        originalPrice,

        /*
         * Final price after offer.
         */

        price:
          finalPrice,

        /*
         * Discount for one item.
         */

        discountAmount:
          productDiscountAmount,

        /*
         * Final price × quantity.
         */

        subtotal:
          itemSubtotal,
      });
    }

    /*
     * ====================================
     * COUPON
     * ====================================
     */

    const couponResult =
      await this.calculateCouponDiscount(
        data.couponCode,
        subtotal,
      );

    const discountAmount =
      couponResult.discountAmount;

    const amountAfterDiscount =
      Math.max(
        subtotal -
          discountAmount,
        0,
      );

    /*
     * ====================================
     * SHIPPING
     * ====================================
     */

    const shippingCost =
      data.shippingMethod ===
      "express"
        ? 199
        : amountAfterDiscount >= 999
          ? 0
          : 99;

    /*
     * ====================================
     * FINAL TOTAL
     * ====================================
     */

    const total =
      amountAfterDiscount +
      shippingCost;

    const orderNumber =
      `TAK-${Date.now()}-${Math.floor(
        1000 +
          Math.random() * 9000,
      )}`;

    const shippingAddress = {
      firstName:
        data.shippingAddress.firstName,

      lastName:
        data.shippingAddress.lastName,

      phone:
        data.shippingAddress.phone,

      address:
        data.shippingAddress.address,

      city:
        data.shippingAddress.city,

      state:
        data.shippingAddress.state,

      pincode:
        data.shippingAddress.pincode,

      ...(data.shippingAddress.landmark
        ? {
            landmark:
              data.shippingAddress.landmark,
          }
        : {}),
    };

    /*
     * ====================================
     * CREATE ORDER
     * ====================================
     */

    const order =
      await Order.create({
        userId,

        orderNumber,

        items:
          orderItems,

        shippingAddress,

        shippingMethod:
          data.shippingMethod,

        paymentMethod:
          data.paymentMethod,

        paymentStatus:
          "pending",

        orderStatus:
          data.paymentMethod ===
          "cod"
            ? "confirmed"
            : "pending",

        /*
         * Product total after automatic
         * product-level offers.
         */

        subtotal,

        /*
         * Additional coupon discount.
         */

        discountAmount,

        ...(couponResult.couponCode
          ? {
              couponCode:
                couponResult.couponCode,
            }
          : {}),

        shippingCost,

        /*
         * Final payable amount.
         */

        total,
      });

    /*
     * ====================================
     * INCREASE COUPON USAGE
     * ====================================
     */

    if (couponResult.coupon) {
      const couponModel =
        Coupon as mongoose.Model<ICoupon>;

      await couponModel.updateOne(
        {
          _id:
            couponResult.coupon._id,

          ...(couponResult.coupon
            .usageLimit !== undefined
            ? {
                usedCount: {
                  $lt:
                    couponResult.coupon
                      .usageLimit,
                },
              }
            : {}),
        },
        {
          $inc: {
            usedCount: 1,
          },
        },
      );
    }

    /*
     * ====================================
     * COD STOCK FLOW
     * ====================================
     */

    if (
      data.paymentMethod ===
      "cod"
    ) {
      try {
        await this.decreaseStockForOrder(
          orderItems.map(
            (item) => ({
              productId:
                item.productId,

              quantity:
                item.quantity,

              ...(item.variantId
                ? {
                    variantId:
                      item.variantId,
                  }
                : {}),
            }),
          ),
        );
      } catch (error) {
        await Order.findByIdAndDelete(
          order._id,
        );

        if (couponResult.coupon) {
          const couponModel =
            Coupon as mongoose.Model<ICoupon>;

          await couponModel.updateOne(
            {
              _id:
                couponResult.coupon._id,

              usedCount: {
                $gt: 0,
              },
            },
            {
              $inc: {
                usedCount: -1,
              },
            },
          );
        }

        throw error;
      }

      try {
        await this.clearCart(
          accessToken,
        );
      } catch (error) {
        console.error(
          "COD order created successfully but cart clearing failed:",
          error,
        );
      }
    }

    /*
     * ====================================
     * ONLINE PAYMENT FLOW
     * ====================================
     */

    return order;
  }

  /*
   * ========================================
   * GET USER ORDERS
   * ========================================
   */

  async getUserOrders(
    userId: string,
  ) {
    return Order.find({
      userId,
    }).sort({
      createdAt: -1,
    });
  }

  /*
   * ========================================
   * GET SINGLE ORDER
   * ========================================
   */

  async getOrderById(
    userId: string,
    orderId: string,
  ) {
    const order =
      await Order.findOne({
        _id: orderId,

        userId,
      });

    if (!order) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        ORDER_MESSAGES.ORDER_NOT_FOUND,
      );
    }

    return order;
  }

  /*
   * ========================================
   * GET ALL ORDERS - ADMIN
   * ========================================
   */

  async getAllOrders(
    query: AdminOrderQueryInput,
  ) {
    const {
      page = 1,
      limit = 20,
      search,
      orderStatus,
      paymentStatus,
      paymentMethod,
      sort = "newest",
    } = query;

    const filter:
      Record<
        string,
        unknown
      > = {};

    if (search) {
      const escapedSearch =
        search.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        );

      const searchRegex =
        new RegExp(
          escapedSearch,
          "i",
        );

      filter.$or = [
        {
          orderNumber:
            searchRegex,
        },
        {
          userId:
            searchRegex,
        },
        {
          "shippingAddress.firstName":
            searchRegex,
        },
        {
          "shippingAddress.lastName":
            searchRegex,
        },
        {
          "shippingAddress.phone":
            searchRegex,
        },
      ];
    }

    if (orderStatus) {
      filter.orderStatus =
        orderStatus;
    }

    if (paymentStatus) {
      filter.paymentStatus =
        paymentStatus;
    }

    if (paymentMethod) {
      filter.paymentMethod =
        paymentMethod;
    }

    let sortOption:
      Record<
        string,
        1 | -1
      > = {
      createdAt: -1,
    };

    switch (sort) {
      case "oldest":
        sortOption = {
          createdAt: 1,
        };
        break;

      case "total_asc":
        sortOption = {
          total: 1,
        };
        break;

      case "total_desc":
        sortOption = {
          total: -1,
        };
        break;

      case "newest":
      default:
        sortOption = {
          createdAt: -1,
        };
        break;
    }

    const skip =
      (page - 1) *
      limit;

    const [
      orders,
      totalOrders,
    ] =
      await Promise.all([
        Order.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(limit),

        Order.countDocuments(
          filter,
        ),
      ]);

    const totalPages =
      Math.ceil(
        totalOrders /
          limit,
      );

    return {
      orders,

      pagination: {
        page,

        limit,

        totalOrders,

        totalPages,

        hasNextPage:
          page <
          totalPages,

        hasPreviousPage:
          page > 1,
      },
    };
  }

  /*
   * ========================================
   * UPDATE ORDER STATUS
   * ========================================
   */

  async updateOrderStatus(
    orderId: string,
    data: UpdateOrderStatusInput,
  ) {
    const order =
      await Order.findById(
        orderId,
      );

    if (!order) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        ORDER_MESSAGES.ORDER_NOT_FOUND,
      );
    }

    const currentStatus =
      order.orderStatus;

    const requestedStatus =
      data.orderStatus;

    if (
      currentStatus ===
      "delivered"
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Delivered orders cannot be updated",
      );
    }

    const currentIndex =
      ORDER_STATUS_FLOW.indexOf(
        currentStatus as
          (typeof ORDER_STATUS_FLOW)[number],
      );

    const requestedIndex =
      ORDER_STATUS_FLOW.indexOf(
        requestedStatus as
          (typeof ORDER_STATUS_FLOW)[number],
      );

    if (
      currentIndex === -1
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Invalid current order status: ${currentStatus}`,
      );
    }

    if (
      requestedIndex === -1
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Invalid order status",
      );
    }

    if (
      requestedIndex !==
      currentIndex + 1
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        `Invalid order status transition: ${currentStatus} → ${requestedStatus}`,
      );
    }

    if (
      currentStatus ===
        "pending" &&
      requestedStatus ===
        "confirmed"
    ) {
      if (
        order.paymentMethod ===
          "online" &&
        order.paymentStatus !==
          "paid"
      ) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Online payment must be completed before confirming the order",
        );
      }
    }

    order.orderStatus =
      requestedStatus;

    await order.save();

    return order;
  }
}

export default new OrderService();