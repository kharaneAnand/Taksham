import mongoose, {
  Schema,
} from "mongoose";

import type {
  ICategory,
  ISubcategory,
} from "../types/category.types.js";

/*
 * ========================================
 * Subcategory Schema
 * ========================================
 */

const subcategorySchema =
  new Schema<ISubcategory>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      slug: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
    },
    {
      _id: true,
    },
  );

/*
 * ========================================
 * Category Schema
 * ========================================
 */

const categorySchema =
  new Schema<ICategory>(
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

      subcategories: {
        type: [subcategorySchema],
        default: [],
      },
    },
    {
      timestamps: true,
    },
  );

/*
 * Prevent duplicate subcategory
 * slugs inside the same category
 */

categorySchema.index({
  "subcategories.slug": 1,
});

export default mongoose.model<ICategory>(
  "Category",
  categorySchema,
);