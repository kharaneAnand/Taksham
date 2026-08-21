import mongoose, {
  Schema,
} from "mongoose";

import type {
  ICollection,
} from "../types/collection.types.js";

/*
 * ========================================
 * Collection Image Schema
 * ========================================
 */

const collectionImageSchema =
  new Schema(
    {
      url: {
        type: String,
        required: true,
        trim: true,
      },

      publicId: {
        type: String,
        required: true,
        trim: true,
      },
    },
    {
      _id: false,
    },
  );

/*
 * ========================================
 * Collection Schema
 * ========================================
 */

const collectionSchema =
  new Schema<ICollection>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      description: {
        type: String,
        trim: true,
      },

      image: {
        type: collectionImageSchema,
        required: false,
      },

      products: [
        {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
      ],

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    },
  );




/*
 * ========================================
 * Model
 * ========================================
 */

export default mongoose.model<ICollection>(
  "Collection",
  collectionSchema,
);