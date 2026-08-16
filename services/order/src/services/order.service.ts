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
          Accept: "application/json",

          Cookie: `accessToken=${accessToken}`,
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
          Accept: "application/json",
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
          Accept: "application/json",

          Cookie: `accessToken=${accessToken}`,
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
       * Stock
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
       * Snapshot
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
     * 7. Create Order
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
     * 8. Clear Cart
     * ------------------------------------
     */

    await this.clearCart(
      accessToken,
    );

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

  /*
   * ----------------------------------------
   * Cancel Order
   * ----------------------------------------
   */

  async cancelOrder(
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

    if (
      [
        "shipped",
        "out_for_delivery",
        "delivered",
      ].includes(
        order.orderStatus,
      )
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Order cannot be cancelled at this stage",
      );
    }

    order.orderStatus =
      "cancelled";

    await order.save();

    return order;
  }
}

export default new OrderService();