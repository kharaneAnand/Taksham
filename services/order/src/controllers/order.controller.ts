import asyncHandler from "../helpers/asyncHandler.js";

import {
  successResponse,
} from "../helpers/response.js";

import orderService from "../services/order.service.js";

import type {
  CreateOrderInput,
  UpdateOrderStatusInput,
  AdminOrderQueryInput,
} from "../validators/order.validator.js";

import {
  ORDER_MESSAGES,
} from "../constants/messages.js";

import type {
  AuthenticatedRequest,
} from "../middlewares/auth.middleware.js";

/*
 * ========================================
 * Order Controller
 * ========================================
 */

class OrderController {
  /*
   * ----------------------------------------
   * Create Order
   * POST /api/v1/orders
   * ----------------------------------------
   */

  createOrder = asyncHandler<
    Record<string, string>,
    unknown,
    CreateOrderInput
  >(
    async (
      req,
      res,
    ) => {
      const request =
        req as AuthenticatedRequest<
          Record<string, string>,
          unknown,
          CreateOrderInput
        >;

      const accessToken =
        req.cookies?.accessToken;

      if (!accessToken) {
        res.status(401).json({
          success: false,
          message: "Invalid token",
          errors: null,
        });

        return;
      }

      const order =
        await orderService.createOrder(
          request.user.id,
          accessToken,
          req.body,
        );

      successResponse(
        res,
        201,
        ORDER_MESSAGES.ORDER_CREATED,
        order,
      );
    },
  );

  /*
   * ----------------------------------------
   * Get Current User Orders
   * GET /api/v1/orders
   * ----------------------------------------
   */

  getUserOrders = asyncHandler(
    async (
      req,
      res,
    ) => {
      const request =
        req as AuthenticatedRequest;

      const orders =
        await orderService.getUserOrders(
          request.user.id,
        );

      successResponse(
        res,
        200,
        ORDER_MESSAGES.ORDERS_FETCHED,
        orders,
      );
    },
  );

  /*
   * ----------------------------------------
   * Get Single Order
   * GET /api/v1/orders/:id
   * ----------------------------------------
   */

  getOrderById = asyncHandler<
    { id: string }
  >(
    async (
      req,
      res,
    ) => {
      const request =
        req as AuthenticatedRequest<{
          id: string;
        }>;

      const order =
        await orderService.getOrderById(
          request.user.id,
          request.params.id,
        );

      successResponse(
        res,
        200,
        ORDER_MESSAGES.ORDER_FETCHED,
        order,
      );
    },
  );

  /*
   * ========================================
   * ADMIN ORDER MANAGEMENT
   * ========================================
   */

  /*
   * ----------------------------------------
   * Get All Orders
   *
   * GET /api/v1/orders/admin
   * ----------------------------------------
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
   * ----------------------------------------
   */

  getAllOrders = asyncHandler(
  async (
    _req,
    res,
  ) => {
    const query =
      res.locals
        .validated as AdminOrderQueryInput;

    const result =
      await orderService.getAllOrders(
        query,
      );

    successResponse(
      res,
      200,
      ORDER_MESSAGES.ORDERS_FETCHED,
      result,
    );
  },
);
  /*
   * ----------------------------------------
   * Update Order Status
   *
   * PATCH /api/v1/orders/:id/status
   * ----------------------------------------
   *
   * Admin only.
   *
   * The actual status transition rules
   * are enforced inside OrderService.
   * ----------------------------------------
   */

  updateOrderStatus = asyncHandler<
    { id: string },
    unknown,
    UpdateOrderStatusInput
  >(
    async (
      req,
      res,
    ) => {
      const request =
        req as AuthenticatedRequest<
          {
            id: string;
          },
          unknown,
          UpdateOrderStatusInput
        >;

      const order =
        await orderService.updateOrderStatus(
          request.params.id,
          request.body,
        );

      successResponse(
        res,
        200,
        "Order status updated successfully",
        order,
      );
    },
  );


  /*
 * ----------------------------------------
 * Get Orders By Customer ID
 *
 * GET /api/v1/orders/admin/user/:userId
 * ----------------------------------------
 */

getOrdersByUserId = asyncHandler<
  { userId: string }
>(
  async (
    req,
    res,
  ) => {
    const orders =
      await orderService.getOrdersByUserId(
        req.params.userId,
      );

    successResponse(
      res,
      200,
      ORDER_MESSAGES.ORDERS_FETCHED,
      orders,
    );
  },
);
}

export default new OrderController();