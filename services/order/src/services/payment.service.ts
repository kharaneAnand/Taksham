import crypto from "crypto";

import env from "../config/env.js";

import ApiError from "../helpers/ApiError.js";

import Order from "../models/order.model.js";

import razorpay from "../config/razorpay.js";

import {
  StatusCodes,
} from "../constants/http.js";

/*
 * ========================================
 * Types
 * ========================================
 */

interface ProductStockResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}

/*
 * ========================================
 * Payment Service
 * ========================================
 */

class PaymentService {
  /*
   * ----------------------------------------
   * Create Razorpay Order
   * ----------------------------------------
   */

  async createPaymentOrder(
    userId: string,
    orderId: string,
  ) {
    /*
     * ------------------------------------
     * 1. Find Taksham Order
     * ------------------------------------
     */

    const order =
      await Order.findOne({
        _id: orderId,
        userId,
      });

    if (!order) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Order not found",
      );
    }

    /*
     * ------------------------------------
     * 2. Validate Payment Method
     * ------------------------------------
     */

    if (
      order.paymentMethod !==
      "online"
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "This order does not use online payment",
      );
    }

    /*
     * ------------------------------------
     * 3. Validate Order Status
     * ------------------------------------
     */

    if (
      order.orderStatus ===
      "cancelled"
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Cancelled orders cannot be paid",
      );
    }

    /*
     * ------------------------------------
     * 4. Already Paid
     * ------------------------------------
     */

    if (
      order.paymentStatus ===
      "paid"
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "This order has already been paid",
      );
    }

    /*
     * ------------------------------------
     * 5. Prevent Duplicate Razorpay Order
     * ------------------------------------
     */

    if (order.razorpayOrderId) {
      return {
        razorpayOrderId:
          order.razorpayOrderId,

        amount:
          Math.round(
            order.total * 100,
          ),

        currency: "INR",
      };
    }

    /*
     * ------------------------------------
     * 6. Razorpay Amount
     * ------------------------------------
     *
     * Taksham stores amount in rupees.
     *
     * Razorpay expects paise.
     *
     * ₹54,980
     *      ↓
     * 5,498,000 paise
     * ------------------------------------
     */

    const amount =
      Math.round(
        order.total * 100,
      );

    /*
     * ------------------------------------
     * 7. Create Razorpay Order
     * ------------------------------------
     */

    const razorpayOrder =
      await razorpay.orders.create({
        amount,

        currency: "INR",

        receipt:
          order.orderNumber,

        notes: {
          takshamOrderId:
            order._id.toString(),

          orderNumber:
            order.orderNumber,

          userId,
        },
      });

    /*
     * ------------------------------------
     * 8. Save Razorpay Order ID
     * ------------------------------------
     */

    order.razorpayOrderId =
      razorpayOrder.id;

    await order.save();

    /*
     * ------------------------------------
     * 9. Return Safe Data
     * ------------------------------------
     */

    return {
      razorpayOrderId:
        razorpayOrder.id,

      amount:
        razorpayOrder.amount,

      currency:
        razorpayOrder.currency,
    };
  }

  /*
   * ----------------------------------------
   * Decrease Product Stock
   * ----------------------------------------
   *
   * Communicates with Product Service.
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
      (await response.json()) as ProductStockResponse;

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
   */

  private async decreaseStockForOrder(
    order: {
      items: Array<{
        productId: string;

        quantity: number;

        variantId?: string;
      }>;
    },
  ): Promise<void> {
    for (
      const item of order.items
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
          "Payment succeeded but cart could not be cleared",
      );
    }
  }

  /*
   * ----------------------------------------
   * Verify Razorpay Payment
   * ----------------------------------------
   */

  async verifyPayment(
    userId: string,
    accessToken: string,
    orderId: string,
    razorpayPaymentId: string,
    razorpayOrderId: string,
    razorpaySignature: string,
  ) {
    /*
     * ------------------------------------
     * 1. Find Taksham Order
     * ------------------------------------
     */

    const order =
      await Order.findOne({
        _id: orderId,
        userId,
      });

    if (!order) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Order not found",
      );
    }

    /*
     * ------------------------------------
     * 2. Idempotency
     * ------------------------------------
     *
     * If the payment was already verified,
     * do NOT deduct stock again.
     *
     * This protects against:
     *
     * - double-clicks
     * - frontend retries
     * - Razorpay callback retries
     * - page refreshes
     * ------------------------------------
     */

    if (
      order.paymentStatus ===
      "paid"
    ) {
      return order;
    }

    /*
     * ------------------------------------
     * 3. Validate Razorpay Order
     * ------------------------------------
     */

    if (
      !order.razorpayOrderId
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Razorpay order has not been created",
      );
    }

    if (
      order.razorpayOrderId !==
      razorpayOrderId
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Invalid Razorpay order",
      );
    }

    /*
     * ------------------------------------
     * 4. Generate Signature
     * ------------------------------------
     */

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          env.RAZORPAY_KEY_SECRET,
        )
        .update(
          `${razorpayOrderId}|${razorpayPaymentId}`,
        )
        .digest("hex");

    /*
     * ------------------------------------
     * 5. Compare Signatures
     * ------------------------------------
     */

    const isValid =
      generatedSignature ===
      razorpaySignature;

    if (!isValid) {
      order.paymentStatus =
        "failed";

      await order.save();

      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Payment verification failed",
      );
    }

    /*
     * ------------------------------------
     * 6. Deduct Stock
     * ------------------------------------
     *
     * Payment has been cryptographically
     * verified.
     *
     * Now decrease inventory.
     * ------------------------------------
     */

    try {
      await this.decreaseStockForOrder(
        order,
      );
    } catch (error) {
      /*
       * Payment was successful, but stock
       * could not be updated.
       *
       * We do NOT mark the payment as
       * failed because the payment itself
       * has already been verified.
       *
       * Keep paymentStatus pending so the
       * order can be handled safely instead
       * of pretending payment failed.
       */

      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,

        error instanceof Error
          ? error.message
          : "Payment was successful but inventory could not be updated",
      );
    }

    /*
     * ------------------------------------
     * 7. Mark Payment Successful
     * ------------------------------------
     */

    order.paymentStatus =
      "paid";

    order.orderStatus =
      "confirmed";

    order.razorpayPaymentId =
      razorpayPaymentId;

    order.razorpaySignature =
      razorpaySignature;

    await order.save();

    /*
     * ------------------------------------
     * 8. Clear Cart
     * ------------------------------------
     */

    await this.clearCart(
      accessToken,
    );

    /*
     * ------------------------------------
     * 9. Return Order
     * ------------------------------------
     */

    return order;
  }
}

export default new PaymentService();