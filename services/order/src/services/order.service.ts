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
  UpdateOrderStatusInput,
  AdminOrderQueryInput,
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

interface StockItem {
  productId: string;

  quantity: number;

  variantId?: string;
}

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
   * STOCK FOR COMPLETE ORDER
   * ========================================
   */

  private async decreaseStockForOrder(
    items: Array<{
      productId: string;

      quantity: number;

      variantId?: string;
    }>,
  ): Promise<StockItem[]> {
    const deductedItems: StockItem[] =
      [];

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
        deductedItems.length >
        0
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
   * CART
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

    const orderItems = [];

    let subtotal = 0;

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

      if (
        cartItem.quantity >
        availableStock
      ) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,

          `Insufficient stock for ${product.name}`,
        );
      }

      const itemSubtotal =
        price *
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

        price,

        subtotal:
          itemSubtotal,
      });
    }

    const shippingCost =
      data.shippingMethod ===
      "express"
        ? 199
        : subtotal >= 999
          ? 0
          : 99;

    const total =
      subtotal +
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
   *
   * Supports:
   *
   * - Pagination
   * - Search
   * - Order status
   * - Payment status
   * - Payment method
   * - Sorting
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

    /*
     * ------------------------------------
     * Build Filter
     * ------------------------------------
     */

    const filter: Record<
      string,
      unknown
    > = {};

    /*
     * ------------------------------------
     * Search
     * ------------------------------------
     *
     * Search supports:
     *
     * - Order number
     * - User ID
     * - Customer first name
     * - Customer last name
     * - Phone number
     * ------------------------------------
     */

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

    /*
     * ------------------------------------
     * Order Status
     * ------------------------------------
     */

    if (orderStatus) {
      filter.orderStatus =
        orderStatus;
    }

    /*
     * ------------------------------------
     * Payment Status
     * ------------------------------------
     */

    if (paymentStatus) {
      filter.paymentStatus =
        paymentStatus;
    }

    /*
     * ------------------------------------
     * Payment Method
     * ------------------------------------
     */

    if (paymentMethod) {
      filter.paymentMethod =
        paymentMethod;
    }

    /*
     * ------------------------------------
     * Sorting
     * ------------------------------------
     */

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

    /*
     * ------------------------------------
     * Pagination
     * ------------------------------------
     */

    const skip =
      (page - 1) *
      limit;

    /*
     * ------------------------------------
     * Fetch Orders + Count
     * ------------------------------------
     */

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

    /*
     * ------------------------------------
     * Pagination Metadata
     * ------------------------------------
     */

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
   *
   * ADMIN ONLY
   * ========================================
   */

  async updateOrderStatus(
    orderId: string,
    data: UpdateOrderStatusInput,
  ) {
    /*
     * ------------------------------------
     * 1. Find Order
     * ------------------------------------
     */

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

    /*
     * ------------------------------------
     * 2. Current Status
     * ------------------------------------
     */

    const currentStatus =
      order.orderStatus;

    const requestedStatus =
      data.orderStatus;

    /*
     * ------------------------------------
     * 3. Prevent Updating Delivered
     * ------------------------------------
     */

    if (
      currentStatus ===
      "delivered"
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,

        "Delivered orders cannot be updated",
      );
    }

    /*
     * ------------------------------------
     * 4. Find Status Positions
     * ------------------------------------
     */

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

    /*
     * ------------------------------------
     * 5. Validate Current Status
     * ------------------------------------
     */

    if (
      currentIndex === -1
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,

        `Invalid current order status: ${currentStatus}`,
      );
    }

    /*
     * ------------------------------------
     * 6. Validate Requested Status
     * ------------------------------------
     */

    if (
      requestedIndex === -1
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,

        "Invalid order status",
      );
    }

    /*
     * ------------------------------------
     * 7. Only Allow Next Status
     * ------------------------------------
     */

    if (
      requestedIndex !==
      currentIndex + 1
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,

        `Invalid order status transition: ${currentStatus} → ${requestedStatus}`,
      );
    }

    /*
     * ------------------------------------
     * 8. Payment Validation
     * ------------------------------------
     */

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

    /*
     * ------------------------------------
     * 9. Update Status
     * ------------------------------------
     */

    order.orderStatus =
      requestedStatus;

    await order.save();

    /*
     * ------------------------------------
     * 10. Return Updated Order
     * ------------------------------------
     */

    return order;
  }
}

export default new OrderService();