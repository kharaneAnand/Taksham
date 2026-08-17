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

interface StockItem {
  productId: string;
  quantity: number;
  variantId?: string;
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
   * ========================================
   * PRODUCT SERVICE
   * ========================================
   */

  /*
   * ----------------------------------------
   * Decrease Product Stock
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

    let result:
      | ProductStockResponse
      | null = null;

    try {
      result =
        (await response.json()) as ProductStockResponse;
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
          "Failed to decrease product stock",
      );
    }
  }

  /*
   * ----------------------------------------
   * Increase Product Stock
   * ----------------------------------------
   *
   * Used for compensation / rollback.
   * ----------------------------------------
   */

  private async increaseProductStock(
    productId: string,
    quantity: number,
    variantId?: string,
  ): Promise<void> {
    const response = await fetch(
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
      | ProductStockResponse
      | null = null;

    try {
      result =
        (await response.json()) as ProductStockResponse;
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
          "Failed to restore product stock",
      );
    }
  }

  /*
   * ========================================
   * STOCK MANAGEMENT
   * ========================================
   */

  /*
   * ----------------------------------------
   * Decrease Stock For Order
   * ----------------------------------------
   *
   * Returns the items that were successfully
   * deducted.
   *
   * This is important because if a later
   * item fails, we know exactly what needs
   * to be restored.
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
  ): Promise<StockItem[]> {
    const deductedItems: StockItem[] =
      [];

    try {
      for (
        const item of order.items
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
      /*
       * ----------------------------------
       * Something failed.
       *
       * Restore everything that was
       * successfully deducted before
       * the failure.
       * ----------------------------------
       */

      try {
        await this.restoreStock(
          deductedItems,
        );
      } catch {
        /*
         * If rollback itself fails, we
         * deliberately throw a clear
         * inventory inconsistency error.
         *
         * This requires manual attention
         * rather than silently continuing.
         */

        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Stock update failed and inventory rollback also failed. Manual inventory reconciliation is required.",
        );
      }

      /*
       * Original stock failure.
       */

      throw error;
    }
  }

  /*
   * ----------------------------------------
   * Restore Stock
   * ----------------------------------------
   *
   * Restores previously deducted items.
   *
   * We process in reverse order.
   * ----------------------------------------
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

      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,

        result?.message ||
          "Payment succeeded but cart could not be cleared",
      );
    }
  }

  /*
   * ========================================
   * VERIFY PAYMENT
   * ========================================
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
     * If payment was already verified,
     * never deduct stock again.
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
     * The payment is now cryptographically
     * verified.
     *
     * Inventory must be successfully
     * deducted before marking the order
     * as confirmed.
     *
     * If any item fails, previously
     * deducted items are automatically
     * restored.
     * ------------------------------------
     */

    try {
      await this.decreaseStockForOrder(
        order,
      );
    } catch (error) {
      /*
       * The Razorpay payment itself is
       * already successful.
       *
       * Therefore we MUST NOT mark it as
       * "failed".
       *
       * The stock operation has already
       * performed its own rollback.
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
     *
     * Payment and inventory are already
     * successfully completed.
     *
     * If cart clearing fails, we do NOT
     * undo the successful payment/order.
     * ------------------------------------
     */

    try {
      await this.clearCart(
        accessToken,
      );
    } catch (error) {
      /*
       * Order is already paid and confirmed.
       *
       * We intentionally do not change
       * paymentStatus back to failed.
       *
       * The order remains valid.
       */

      console.error(
        "Payment successful but cart clearing failed:",
        error,
      );
    }

    /*
     * ------------------------------------
     * 9. Return Order
     * ------------------------------------
     */

    return order;
  }
}

export default new PaymentService();