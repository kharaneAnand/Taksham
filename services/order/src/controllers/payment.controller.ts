import asyncHandler from "../helpers/asyncHandler.js";

import {
  successResponse,
} from "../helpers/response.js";

import ApiError from "../helpers/ApiError.js";

import {
  StatusCodes,
} from "../constants/http.js";

import paymentService from "../services/payment.service.js";

import type {
  AuthenticatedRequest,
} from "../middlewares/auth.middleware.js";

/*
 * ========================================
 * Types
 * ========================================
 */

interface CreatePaymentOrderBody {
  orderId: string;
}

interface VerifyPaymentBody {
  orderId: string;

  razorpayPaymentId: string;

  razorpayOrderId: string;

  razorpaySignature: string;
}

/*
 * ========================================
 * Payment Controller
 * ========================================
 */

class PaymentController {
  /*
   * ----------------------------------------
   * Create Razorpay Order
   * POST /api/v1/payments/create-order
   * ----------------------------------------
   */

  createPaymentOrder =
    asyncHandler(
      async (
        req,
        res,
      ) => {
        const request =
          req as AuthenticatedRequest<
            Record<string, string>,
            unknown,
            CreatePaymentOrderBody
          >;

        const result =
          await paymentService.createPaymentOrder(
            request.user.id,
            request.body.orderId,
          );

        return successResponse(
          res,
          StatusCodes.OK,
          "Payment order created successfully",
          result,
        );
      },
    );

  /*
   * ----------------------------------------
   * Verify Razorpay Payment
   * POST /api/v1/payments/verify
   * ----------------------------------------
   */

  verifyPayment =
    asyncHandler(
      async (
        req,
        res,
      ) => {
        const request =
          req as AuthenticatedRequest<
            Record<string, string>,
            unknown,
            VerifyPaymentBody
          >;

        /*
         * ------------------------------------
         * Get Access Token
         * ------------------------------------
         */

        const accessToken =
          req.cookies?.accessToken;

        if (!accessToken) {
          throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            "Invalid token",
          );
        }

        /*
         * ------------------------------------
         * Payment Data
         * ------------------------------------
         */

        const {
          orderId,
          razorpayPaymentId,
          razorpayOrderId,
          razorpaySignature,
        } = request.body;

        /*
         * ------------------------------------
         * Verify Payment
         * ------------------------------------
         */

        const order =
          await paymentService.verifyPayment(
            request.user.id,
            accessToken,
            orderId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
          );

        /*
         * ------------------------------------
         * Success Response
         * ------------------------------------
         */

        return successResponse(
          res,
          StatusCodes.OK,
          "Payment verified successfully",
          order,
        );
      },
    );
}

export default new PaymentController();