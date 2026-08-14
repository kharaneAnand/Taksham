import type { Response } from "express";

import asyncHandler from "../helpers/asyncHandler.js";
import { successResponse } from "../helpers/response.js";

import cartService from "../services/cart.service.js";

import type {
  AddCartItemInput,
  UpdateCartItemInput,
} from "../validators/cart.validator.js";

import {
  CART_MESSAGES,
} from "../constants/messages.js";

import ApiError from "../helpers/ApiError.js";

import { StatusCodes } from "../constants/http.js";

class CartController {
  /*
   * ----------------------------------------
   * GET /api/v1/cart
   * ----------------------------------------
   */

  getCart = asyncHandler(
    async (req, res) => {
      const cart =
        await cartService.getCart(
          req.user.id,
        );

      successResponse(
        res,
        200,
        CART_MESSAGES.CART_FETCHED,
        cart,
      );
    },
  );

  /*
   * ----------------------------------------
   * POST /api/v1/cart/items
   * ----------------------------------------
   */

  addItem = asyncHandler<
    Record<string, string>,
    unknown,
    AddCartItemInput
  >(
    async (req, res) => {
      const cart =
        await cartService.addItem(
          req.user.id,
          req.body,
        );

      successResponse(
        res,
        201,
        CART_MESSAGES.ITEM_ADDED,
        cart,
      );
    },
  );

  /*
   * ----------------------------------------
   * PATCH /api/v1/cart/items/:itemId
   * ----------------------------------------
   */

  updateItem = asyncHandler<
    Record<string, string>,
    unknown,
    UpdateCartItemInput
  >(
    async (req, res) => {
      const itemId =
        req.params.itemId;

      if (!itemId) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Cart item ID is required",
        );
      }

      const cart =
        await cartService.updateItem(
          req.user.id,
          itemId,
          req.body,
        );

      successResponse(
        res,
        200,
        CART_MESSAGES.ITEM_UPDATED,
        cart,
      );
    },
  );

  /*
   * ----------------------------------------
   * DELETE /api/v1/cart/items/:itemId
   * ----------------------------------------
   */

  removeItem = asyncHandler<
    Record<string, string>
  >(
    async (req, res) => {
      const itemId =
        req.params.itemId;

      if (!itemId) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Cart item ID is required",
        );
      }

      const cart =
        await cartService.removeItem(
          req.user.id,
          itemId,
        );

      successResponse(
        res,
        200,
        CART_MESSAGES.ITEM_REMOVED,
        cart,
      );
    },
  );

  /*
   * ----------------------------------------
   * DELETE /api/v1/cart
   * ----------------------------------------
   */

  clearCart = asyncHandler(
    async (req, res) => {
      const cart =
        await cartService.clearCart(
          req.user.id,
        );

      successResponse(
        res,
        200,
        CART_MESSAGES.CART_CLEARED,
        cart,
      );
    },
  );
}

export default new CartController();