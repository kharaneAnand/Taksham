import asyncHandler from "../helpers/asyncHandler.js";
import { successResponse } from "../helpers/response.js";

import wishlistService from "../services/wishlist.service.js";

import type {
  AddWishlistItemInput,
} from "../validators/wishlist.validator.js";

class WishlistController {
 

  getWishlist = asyncHandler(
    async (req, res) => {
      const wishlist =
        await wishlistService.getWishlist(
          req.user.id,
        );

      return successResponse(
        res,
        200,
        "Wishlist fetched successfully",
        wishlist,
      );
    },
  );

  

  addItem = asyncHandler<
    Record<string, string>,
    unknown,
    AddWishlistItemInput
  >(
    async (req, res) => {
      const wishlist =
        await wishlistService.addItem(
          req.user.id,
          req.body,
        );

      return successResponse(
        res,
        201,
        "Product added to wishlist",
        wishlist,
      );
    },
  );


  removeItem = asyncHandler<{
    productId: string;
  }>(
    async (req, res) => {
      const wishlist =
        await wishlistService.removeItem(
          req.user.id,
          req.params.productId,
        );

      return successResponse(
        res,
        200,
        "Product removed from wishlist",
        wishlist,
      );
    },
  );



  clearWishlist = asyncHandler(
    async (req, res) => {
      const wishlist =
        await wishlistService.clearWishlist(
          req.user.id,
        );

      return successResponse(
        res,
        200,
        "Wishlist cleared",
        wishlist,
      );
    },
  );
}

export default new WishlistController();