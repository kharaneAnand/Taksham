import crypto from "crypto";
import env from "../config/env.js";
import ApiError from "../helpers/ApiError.js";

import Order from "../models/order.model.js";

import razorpay from "../config/razorpay.js";

import {
  StatusCodes,
} from "../constants/http.js";


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
     * 4. Prevent Duplicate Payment Order
     * ------------------------------------
     */

    if (order.razorpayOrderId) {
      return {
        razorpayOrderId:
          order.razorpayOrderId,

        amount:
          order.total * 100,

        currency: "INR",
      };
    }

    /*
     * ------------------------------------
     * 5. Razorpay Amount
     * ------------------------------------
     *
     * Taksham stores prices in rupees.
     *
     * Razorpay expects paise.
     *
     * ₹54,980
     *      ↓
     * 5,498,000 paise
     */

    const amount =
      Math.round(
        order.total * 100,
      );

    /*
     * ------------------------------------
     * 6. Create Razorpay Order
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
     * 7. Save Razorpay Order ID
     * ------------------------------------
     */

    order.razorpayOrderId =
      razorpayOrder.id;

    await order.save();

    /*
     * ------------------------------------
     * 8. Return Safe Data
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
   * Verify Razorpay Payment
   * ----------------------------------------
   */

  async verifyPayment(
    userId: string,
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
     * 2. Validate Razorpay Order
     * ------------------------------------
     */

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
     * 3. Generate Signature
     * ------------------------------------
     */

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
         env.RAZORPAY_KEY_SECRET || "",
        )
        .update(
          `${razorpayOrderId}|${razorpayPaymentId}`,
        )
        .digest("hex");

    /*
     * ------------------------------------
     * 4. Compare Signatures
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
     * 5. Mark Payment Successful
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

    return order;
  }
}


export default new PaymentService();