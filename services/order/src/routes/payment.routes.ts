import { Router } from "express";

import PaymentController from "../controllers/payment.controller.js";

import authenticate from "../middlewares/auth.middleware.js";


const router =
  Router();


/*
 * ----------------------------------------
 * All Payment Routes Require Authentication
 * ----------------------------------------
 */

router.use(
  authenticate,
);


/*
 * ----------------------------------------
 * Create Razorpay Order
 *
 * POST /api/v1/payments/create-order
 * ----------------------------------------
 */

router.post(
  "/create-order",
  PaymentController.createPaymentOrder,
);


/*
 * ----------------------------------------
 * Verify Razorpay Payment
 *
 * POST /api/v1/payments/verify
 * ----------------------------------------
 */

router.post(
  "/verify",
  PaymentController.verifyPayment,
);


export default router;