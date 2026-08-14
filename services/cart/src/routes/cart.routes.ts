import { Router } from "express";

import CartController from "../controllers/cart.controller.js";

import validate from "../middlewares/validate.middleware.js";
import authenticate from "../middlewares/auth.middleware.js";

import {
  addCartItemSchema,
  updateCartItemSchema,
} from "../validators/cart.validator.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  CartController.getCart,
);

router.post(
  "/items",
  validate(addCartItemSchema),
  CartController.addItem,
);

router.patch(
  "/items/:itemId",
  validate(
    updateCartItemSchema,
  ),
  CartController.updateItem,
);

router.delete(
  "/items/:itemId",
  CartController.removeItem,
);

router.delete(
  "/",
  CartController.clearCart,
);

export default router;