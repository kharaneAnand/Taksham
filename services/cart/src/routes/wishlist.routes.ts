import { Router } from "express";

import WishlistController from "../controllers/wishlist.controller.js";

import validate from "../middlewares/validate.middleware.js";
import authenticate from "../middlewares/auth.middleware.js";

import {
  addWishlistItemSchema,
} from "../validators/wishlist.validator.js";

const router = Router();



router.use(authenticate);



router.get(
  "/",
  WishlistController.getWishlist,
);



router.post(
  "/items",
  validate(addWishlistItemSchema),
  WishlistController.addItem,
);



router.delete(
  "/items/:productId",
  WishlistController.removeItem,
);


router.delete(
  "/",
  WishlistController.clearWishlist,
);

export default router;