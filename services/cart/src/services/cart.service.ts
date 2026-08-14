import mongoose from "mongoose";

import Cart from "../models/cart.model.js";
import ApiError from "../helpers/ApiError.js";

import env from "../config/env.js";

import type {
  AddCartItemInput,
  UpdateCartItemInput,
} from "../validators/cart.validator.js";

import { StatusCodes } from "../constants/http.js";

import {
  CART_MESSAGES,
} from "../constants/messages.js";

interface ProductVariantResponse {
  _id: string;
  color?: string;
  price?: number;
  stock?: number;
  material?: string;
  images: string[];
}

interface ProductResponse {
  _id: string;
  name: string;
  price: number;
  stock: number;
  variants?: ProductVariantResponse[];
}

class CartService {
  /*
   * ----------------------------------------
   * Get Current User Cart
   * ----------------------------------------
   */

  async getCart(userId: string) {
    let cart =
      await Cart.findOne({
        userId,
      });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
      });
    }

    return cart;
  }

  /*
   * ----------------------------------------
   * Get Product From Product Service
   * ----------------------------------------
   */

  private async getProductById(
    productId: string,
  ): Promise<ProductResponse> {
    const response = await fetch(
      `${env.PRODUCT_SERVICE_URL}/${encodeURIComponent(
        productId,
      )}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    );

    const result =
      (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: ProductResponse;
      };

    if (
      !response.ok ||
      !result.data
    ) {
      throw new ApiError(
        response.status === 404
          ? StatusCodes.NOT_FOUND
          : StatusCodes.BAD_REQUEST,
        result.message ||
          CART_MESSAGES.PRODUCT_NOT_FOUND,
      );
    }

    return result.data;
  }

  /*
   * ----------------------------------------
   * Find Product Variant
   * ----------------------------------------
   */

  private findVariant(
    product: ProductResponse,
    variantId: string,
  ) {
    const variant =
      product.variants?.find(
        (item) =>
          item._id === variantId,
      );

    if (!variant) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        CART_MESSAGES.VARIANT_NOT_FOUND,
      );
    }

    return variant;
  }

  /*
   * ----------------------------------------
   * Add Item To Cart
   * ----------------------------------------
   */

  async addItem(
    userId: string,
    data: AddCartItemInput,
  ) {
    const product =
      await this.getProductById(
        data.productId,
      );

    const variant = data.variantId
      ? this.findVariant(
          product,
          data.variantId,
        )
      : undefined;

    const availableStock =
      variant?.stock ??
      product.stock;

    if (
      data.quantity >
      availableStock
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        CART_MESSAGES.INSUFFICIENT_STOCK,
      );
    }

    let cart =
      await Cart.findOne({
        userId,
      });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
      });
    }

    const existingItem =
      cart.items.find(
        (item) => {
          const sameProduct =
            item.productId ===
            data.productId;

          const sameVariant =
            (item.variantId ??
              undefined) ===
            (data.variantId ??
              undefined);

          return (
            sameProduct &&
            sameVariant
          );
        },
      );

    if (existingItem) {
      const newQuantity =
        existingItem.quantity +
        data.quantity;

      if (
        newQuantity >
        availableStock
      ) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          CART_MESSAGES.INSUFFICIENT_STOCK,
        );
      }

      existingItem.quantity =
        newQuantity;
    } else {
      cart.items.push({
        _id:
          new mongoose.Types.ObjectId(),

        productId:
          data.productId,

        ...(data.variantId
          ? {
              variantId:
                data.variantId,
            }
          : {}),

        quantity:
          data.quantity,
      });
    }

    await cart.save();

    return cart;
  }

  /*
   * ----------------------------------------
   * Update Cart Item
   * ----------------------------------------
   */

  async updateItem(
    userId: string,
    itemId: string,
    data: UpdateCartItemInput,
  ) {
    const cart =
      await Cart.findOne({
        userId,
      });

    if (!cart) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        CART_MESSAGES.CART_EMPTY,
      );
    }

    const item =
      cart.items.find(
        (cartItem) =>
          cartItem._id.toString() ===
          itemId,
      );

    if (!item) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Cart item not found",
      );
    }

    const product =
      await this.getProductById(
        item.productId,
      );

    let availableStock =
      product.stock;

    if (item.variantId) {
      const variant =
        this.findVariant(
          product,
          item.variantId,
        );

      availableStock =
        variant.stock ??
        product.stock;
    }

    if (
      data.quantity >
      availableStock
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        CART_MESSAGES.INSUFFICIENT_STOCK,
      );
    }

    item.quantity =
      data.quantity;

    await cart.save();

    return cart;
  }

  /*
   * ----------------------------------------
   * Remove Cart Item
   * ----------------------------------------
   */

  async removeItem(
    userId: string,
    itemId: string,
  ) {
    const cart =
      await Cart.findOne({
        userId,
      });

    if (!cart) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        CART_MESSAGES.CART_EMPTY,
      );
    }

    const itemIndex =
      cart.items.findIndex(
        (item) =>
          item._id.toString() ===
          itemId,
      );

    if (itemIndex === -1) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Cart item not found",
      );
    }

    cart.items.splice(
      itemIndex,
      1,
    );

    await cart.save();

    return cart;
  }

  /*
   * ----------------------------------------
   * Clear Cart
   * ----------------------------------------
   */

  async clearCart(
    userId: string,
  ) {
    const cart =
      await Cart.findOne({
        userId,
      });

    if (!cart) {
      return {
        userId,
        items: [],
      };
    }

    cart.items = [];

    await cart.save();

    return cart;
  }
}

export default new CartService();