import asyncHandler from "../helpers/asyncHandler.js";

import {
  successResponse,
} from "../helpers/response.js";

import paymentService from "../services/payment.service.js";

import type {
  AuthenticatedRequest,
} from "../middlewares/auth.middleware.js";


interface CreatePaymentOrderBody {
  orderId: string;
}


interface VerifyPaymentBody {
  orderId: string;

  razorpayPaymentId: string;

  razorpayOrderId: string;

  razorpaySignature: string;
}


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

        successResponse(
          res,
          200,
          "Payment order created successfully",
          result,
        );
      },
    );


  /*
   * ----------------------------------------
   * Verify Payment
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

        const {
          orderId,
          razorpayPaymentId,
          razorpayOrderId,
          razorpaySignature,
        } = request.body;

        const order =
          await paymentService.verifyPayment(
            request.user.id,

            orderId,

            razorpayPaymentId,

            razorpayOrderId,

            razorpaySignature,
          );

        successResponse(
          res,
          200,
          "Payment verified successfully",
          order,
        );
      },
    );
}


export default new PaymentController();