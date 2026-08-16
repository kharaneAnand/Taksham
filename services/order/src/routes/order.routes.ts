import { Router } from "express";

import OrderController from "../controllers/order.controller.js";

import authenticate from "../middlewares/auth.middleware.js";

import validate from "../middlewares/validate.middleware.js";

import {
  createOrderSchema,
  orderIdParamSchema,
} from "../validators/order.validator.js";

const router = Router();

/*
 * ----------------------------------------
 * All Order Routes Require Authentication
 * ----------------------------------------
 */

router.use(authenticate);

/*
 * ----------------------------------------
 * Create Order
 * POST /api/v1/orders
 * ----------------------------------------
 */

router.post(
  "/",
  validate(
    createOrderSchema,
  ),
  OrderController.createOrder,
);

/*
 * ----------------------------------------
 * Get Current User Orders
 * GET /api/v1/orders
 * ----------------------------------------
 */

router.get(
  "/",
  OrderController.getUserOrders,
);

/*
 * ----------------------------------------
 * Get Single Order
 * GET /api/v1/orders/:id
 * ----------------------------------------
 */

router.get(
  "/:id",
  validate(
    orderIdParamSchema,
    "params",
  ),
  OrderController.getOrderById,
);

/*
 * ----------------------------------------
 * Cancel Order
 * PATCH /api/v1/orders/:id/cancel
 * ----------------------------------------
 */

router.patch(
  "/:id/cancel",
  validate(
    orderIdParamSchema,
    "params",
  ),
  OrderController.cancelOrder,
);

export default router;