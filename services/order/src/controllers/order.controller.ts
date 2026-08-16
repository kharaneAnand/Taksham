import asyncHandler from "../helpers/asyncHandler.js";

import {
  successResponse,
} from "../helpers/response.js";

import orderService from "../services/order.service.js";

import type {
  CreateOrderInput,
} from "../validators/order.validator.js";

import {
  ORDER_MESSAGES,
} from "../constants/messages.js";

import type {
  AuthenticatedRequest,
} from "../middlewares/auth.middleware.js";

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
   * ----------------------------------------
   * Cancel Order
   * PATCH /api/v1/orders/:id/cancel
   * ----------------------------------------
   */

  cancelOrder = asyncHandler<
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
        await orderService.cancelOrder(
          request.user.id,
          request.params.id,
        );

      successResponse(
        res,
        200,
        ORDER_MESSAGES.ORDER_CANCELLED,
        order,
      );
    },
  );
}

export default new OrderController();