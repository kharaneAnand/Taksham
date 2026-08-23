import { Router } from "express";

import OrderController from "../controllers/order.controller.js";

import authenticate from "../middlewares/auth.middleware.js";

import authorize from "../middlewares/authorize.middleware.js";

import validate from "../middlewares/validate.middleware.js";

import {
  createOrderSchema,
  orderIdParamSchema,
  updateOrderStatusSchema,
  adminOrderQuerySchema,
} from "../validators/order.validator.js";

const router =
  Router();

/*
 * ========================================
 * All Order Routes Require Authentication
 * ========================================
 */

router.use(
  authenticate,
);

/*
 * ========================================
 * Create Order
 *
 * POST /api/v1/orders
 * ========================================
 */

router.post(
  "/",
  validate(
    createOrderSchema,
  ),
  OrderController.createOrder,
);

/*
 * ========================================
 * Get Current User Orders
 *
 * GET /api/v1/orders
 * ========================================
 */

router.get(
  "/",
  OrderController.getUserOrders,
);

/*
 * ========================================
 * ADMIN - Get All Orders
 *
 * GET /api/v1/orders/admin
 * ========================================
 *
 * Admin only.
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
router.get(
  "/admin",
  authorize("admin"),
  validate(
    adminOrderQuerySchema,
    "query",
  ),
  OrderController.getAllOrders,
);

router.get(
  "/admin/user/:userId",
  authorize("admin"),
  OrderController.getOrdersByUserId,
);

router.patch(
  "/:id/status",
  authorize("admin"),
  validate(
    orderIdParamSchema,
    "params",
  ),
  validate(
    updateOrderStatusSchema,
  ),
  OrderController.updateOrderStatus,
);

router.get(
  "/:id",
  validate(
    orderIdParamSchema,
    "params",
  ),
  OrderController.getOrderById,
);

export default router;