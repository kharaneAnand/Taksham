import mongoose, {
  Schema,
} from "mongoose";

import type {
  ICart,
  ICartItem,
} from "../types/cart.types.js";

/*
 * ----------------------------------------
 * Cart Item Schema
 * ----------------------------------------
 */

const cartItemSchema =
  new Schema<ICartItem>(
    {
      productId: {
        type: String,
        required: true,
        trim: true,
      },

      variantId: {
        type: String,
        trim: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
    },
    {
      _id: true,
    },
  );

/*
 * ----------------------------------------
 * Cart Schema
 * ----------------------------------------
 */

const cartSchema =
  new Schema<ICart>(
    {
      userId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
      },

      items: {
        type: [cartItemSchema],
        default: [],
      },
    },
    {
      timestamps: true,
    },
  );

/*
 * ----------------------------------------
 * Cart Model
 * ----------------------------------------
 */

const Cart = mongoose.model<ICart>(
  "Cart",
  cartSchema,
);

export default Cart;