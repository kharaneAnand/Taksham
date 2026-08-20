import mongoose, {
  Schema,
} from "mongoose";

import type {
  IProduct,
  IProductImage,
  IProductVariant,
} from "../types/product.types.js";


const productImageSchema =
  new Schema<IProductImage>(
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

const productVariantSchema =
  new Schema<IProductVariant>(
    {
      color: {
        type: String,
        trim: true,
      },


      images: {
        type: [productImageSchema],
        default: [],
      },

      price: {
        type: Number,
        min: 0,
      },

      stock: {
        type: Number,
        min: 0,
      },

      material: {
        type: String,
        trim: true,
      },
    },
    {
      _id: true,
    },
  );


const productSchema =
  new Schema<IProduct>(
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

      price: {
        type: Number,
        required: true,
        min: 0,
      },

      /*
       * Main / Cover Image
       */
      image: {
        type: productImageSchema,
        required: true,
      },

      images: {
        type: [productImageSchema],
        default: [],
      },

      category: {
        type: String,
        required: true,
        trim: true,
      },

      subcategory: {
        type: String,
        trim: true,
      },

      room: {
        type: String,
        required: true,
        trim: true,
      },

      material: {
        type: String,
        trim: true,
      },

      colors: {
        type: [String],
        default: [],
      },

      description: {
        type: String,
        trim: true,
      },

      rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },

      reviews: {
        type: Number,
        min: 0,
        default: 0,
      },

      isNewProduct: {
        type: Boolean,
        default: false,
      },

      stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },

      variants: {
        type: [productVariantSchema],
        default: [],
      },
    },
    {
      timestamps: true,
    },
  );



productSchema.index({
  category: 1,
});

productSchema.index({
  subcategory: 1,
});

productSchema.index({
  room: 1,
});

productSchema.index({
  material: 1,
});

productSchema.index({
  price: 1,
});

export default mongoose.model<IProduct>(
  "Product",
  productSchema,
);