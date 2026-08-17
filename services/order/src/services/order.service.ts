import ApiError from "../helpers/ApiError.js";

import Order from "../models/order.model.js";

import env from "../config/env.js";

import {
  StatusCodes,
} from "../constants/http.js";

import {
  ORDER_MESSAGES,
} from "../constants/messages.js";

import type {
  CreateOrderInput,
} from "../validators/order.validator.js";

/*
 * ========================================
 * Types
 * ========================================
 */

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

  images?: string[];
}

interface ProductResponse {
  _id: string;

  name: string;

  price: number;

  stock: number;

  image: string;

  images?: string[];

  variants?: ProductVariantResponse[];
}

/*
 * ========================================
 * Order Service
 * ========================================
 */

class OrderService {
  /*
   * ----------------------------------------
   * Get Cart
   * ----------------------------------------
   */

  private async getCart(
    accessToken: string,
  ): Promise<CartResponse> {
    const response = await fetch(
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

    const result =
      (await response.json()) as {
        success?: boolean;

        message?: string;

        data?: CartResponse;
      };

    if (
      !response.ok ||
      !result.data
    ) {
      throw new ApiError(
        response.status ===
          StatusCodes.NOT_FOUND
          ? StatusCodes.NOT_FOUND
          : StatusCodes.BAD_REQUEST,

        result.message ||
          ORDER_MESSAGES.CART_EMPTY,
      );
    }

    return result.data;
  }

  /*
   * ----------------------------------------
   * Get Product By ID
   * ----------------------------------------
   */

  private async getProductById(
    productId: string,
  ): Promise<ProductResponse> {
    const response = await fetch(
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

    const result =
      (await response.json()) as {
        success?: boolean;

        message?: string;

        data?: ProductResponse;
      };

    if (
      !response.ok ||
      !result.data
    ) {
      throw new ApiError(
        response.status ===
          StatusCodes.NOT_FOUND
          ? StatusCodes.NOT_FOUND
          : StatusCodes.BAD_REQUEST,

        result.message ||
          "Product not found",
      );
    }

    return result.data;
  }

  /*
   * ----------------------------------------
   * Decrease Product Stock
   * ----------------------------------------
   *
   * Calls the protected internal
   * Product Service endpoint.
   *
   * This is used for COD orders.
   *
   * Online orders will call the same
   * logic after Razorpay verification.
   * ----------------------------------------
   */

  private async decreaseProductStock(
    productId: string,
    quantity: number,
    variantId?: string,
  ): Promise<void> {
    const response = await fetch(
      `${env.PRODUCT_SERVICE_URL}/internal/decrease-stock`,
      {
        method: "POST",

        headers: {
          Accept:
            "application/json",

          "Content-Type":
            "application/json",

          /*
           * --------------------------------
           * Internal Service Authentication
           * --------------------------------
           */

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

    const result =
      (await response.json()) as {
        success?: boolean;

        message?: string;

        data?: unknown;
      };

    if (!response.ok) {
      throw new ApiError(
        response.status >= 400 &&
          response.status < 500
          ? response.status
          : StatusCodes.BAD_REQUEST,

        result.message ||
          "Failed to update product stock",
      );
    }
  }

  /*
   * ----------------------------------------
   * Decrease Stock For Order
   * ----------------------------------------
   *
   * Deducts stock for every item in
   * the order.
   * ----------------------------------------
   */

  private async decreaseStockForOrder(
    items: Array<{
      productId: string;

      quantity: number;

      variantId?: string;
    }>,
  ): Promise<void> {
    for (
      const item of items
    ) {
      await this.decreaseProductStock(
        item.productId,

        item.quantity,

        item.variantId,
      );
    }
  }

  /*
   * ----------------------------------------
   * Clear Cart
   * ----------------------------------------
   */

  private async clearCart(
    accessToken: string,
  ): Promise<void> {
    const response = await fetch(
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

    if (!response.ok) {
      const result =
        (await response.json()) as {
          message?: string;
        };

      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,

        result.message ||
          "Failed to clear cart",
      );
    }
  }

  /*
   * ----------------------------------------
   * Create Order
   * ----------------------------------------
   */

  async createOrder(
    userId: string,
    accessToken: string,
    data: CreateOrderInput,
  ) {
    /*
     * ------------------------------------
     * 1. Get Cart
     * ------------------------------------
     */

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

    /*
     * ------------------------------------
     * 2. Prepare Order Items
     * ------------------------------------
     */

    const orderItems = [];

    let subtotal = 0;

    /*
     * ------------------------------------
     * 3. Fetch Products
     * ------------------------------------
     */

    for (
      const cartItem of cart.items
    ) {
      const product =
        await this.getProductById(
          cartItem.productId,
        );

      let price =
        product.price;

      let availableStock =
        product.stock;

      let productImage =
        product.image;

      let variantSnapshot:
        | {
            color?: string;

            material?: string;

            image?: string;
          }
        | undefined;

      /*
       * ----------------------------------
       * Variant
       * ----------------------------------
       */

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

        price =
          variant.price ??
          product.price;

        availableStock =
          variant.stock ??
          product.stock;

        productImage =
          variant.images?.[0] ??
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

      /*
       * ----------------------------------
       * Stock Validation
       * ----------------------------------
       */

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
       * ----------------------------------
       * Calculate Item Subtotal
       * ----------------------------------
       */

      const itemSubtotal =
        price *
        cartItem.quantity;

      subtotal +=
        itemSubtotal;

      /*
       * ----------------------------------
       * Create Order Item Snapshot
       * ----------------------------------
       */

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

        price,

        subtotal:
          itemSubtotal,
      });
    }

    /*
     * ------------------------------------
     * 4. Shipping
     * ------------------------------------
     */

    const shippingCost =
      data.shippingMethod ===
      "express"
        ? 199
        : subtotal >= 999
          ? 0
          : 99;

    /*
     * ------------------------------------
     * 5. Total
     * ------------------------------------
     */

    const total =
      subtotal +
      shippingCost;

    /*
     * ------------------------------------
     * 6. Order Number
     * ------------------------------------
     */

    const orderNumber =
      `TAK-${Date.now()}-${Math.floor(
        1000 +
          Math.random() * 9000,
      )}`;

    /*
     * ------------------------------------
     * 7. Shipping Address Snapshot
     * ------------------------------------
     */

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
     * ------------------------------------
     * 8. Create Order
     * ------------------------------------
     *
     * COD:
     * confirmed immediately.
     *
     * Online:
     * remains pending until Razorpay
     * payment verification.
     */

    const order =
      await Order.create({
        userId,

        orderNumber,

        items: orderItems,

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

        subtotal,

        shippingCost,

        total,
      });

    /*
     * ------------------------------------
     * 9. COD Stock Deduction
     * ------------------------------------
     *
     * COD orders are confirmed
     * immediately, so stock is deducted
     * immediately.
     *
     * Online orders DO NOT deduct stock
     * here.
     *
     * Their stock will be deducted after
     * successful Razorpay verification.
     * ------------------------------------
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
        /*
         * Stock deduction failed.
         *
         * Delete the order because the
         * customer should not receive a
         * confirmed COD order when stock
         * could not be reserved.
         */

        await Order.findByIdAndDelete(
          order._id,
        );

        throw error;
      }

      /*
       * ----------------------------------
       * Clear Cart
       * ----------------------------------
       */

      await this.clearCart(
        accessToken,
      );
    }

    /*
     * ------------------------------------
     * 10. Online Payment
     * ------------------------------------
     *
     * Do NOT clear the cart.
     *
     * Do NOT decrease stock.
     *
     * Razorpay payment verification will
     * handle both.
     * ------------------------------------
     */

    return order;
  }

  /*
   * ----------------------------------------
   * Get User Orders
   * ----------------------------------------
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
   * ----------------------------------------
   * Get Single Order
   * ----------------------------------------
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
}

export default new OrderService();