import Wishlist from "../models/wishlist.model.js";

import ApiError from "../helpers/ApiError.js";

import type {
  AddWishlistItemInput,
} from "../validators/wishlist.validator.js";

import { StatusCodes } from "../constants/http.js";

const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL ||
  "http://localhost:5002/api/v1/products";

interface ProductResponse {
  _id: string;
  name: string;
  price: number;
  stock: number;
  image?: string;
}

class WishlistService {
 

  async getWishlist(
    userId: string,
  ) {
    let wishlist =
      await Wishlist.findOne({
        userId,
      });

    if (!wishlist) {
      wishlist =
        await Wishlist.create({
          userId,
          items: [],
        });
    }

    return wishlist;
  }

 

  private async getProductById(
    productId: string,
  ): Promise<ProductResponse> {
    const response =
      await fetch(
        `${PRODUCT_SERVICE_URL}/id/${encodeURIComponent(
          productId,
        )}`,
        {
          method: "GET",
          headers: {
            Accept:
              "application/json",
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
          "Product not found",
      );
    }

    return result.data;
  }

 

  async addItem(
    userId: string,
    data: AddWishlistItemInput,
  ) {
    /*
     * Verify product exists
     */

    await this.getProductById(
      data.productId,
    );

    let wishlist =
      await Wishlist.findOne({
        userId,
      });

    if (!wishlist) {
      wishlist =
        await Wishlist.create({
          userId,
          items: [],
        });
    }

 

    const alreadyExists =
      wishlist.items.some(
        (item) =>
          item.productId ===
          data.productId,
      );

    if (alreadyExists) {
      return wishlist;
    }

    wishlist.items.push({
      productId:
        data.productId,
      addedAt: new Date(),
    });

    await wishlist.save();

    return wishlist;
  }

 

  async removeItem(
    userId: string,
    productId: string,
  ) {
    const wishlist =
      await Wishlist.findOne({
        userId,
      });

    if (!wishlist) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Wishlist not found",
      );
    }

    const existingItem =
      wishlist.items.some(
        (item) =>
          item.productId ===
          productId,
      );

    if (!existingItem) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Product is not in wishlist",
      );
    }

    wishlist.items =
      wishlist.items.filter(
        (item) =>
          item.productId !==
          productId,
      );

    await wishlist.save();

    return wishlist;
  }



  async clearWishlist(
    userId: string,
  ) {
    const wishlist =
      await Wishlist.findOne({
        userId,
      });

    if (!wishlist) {
      return {
        userId,
        items: [],
      };
    }

    wishlist.items = [];

    await wishlist.save();

    return wishlist;
  }
}

export default new WishlistService();