import ApiError from "../helpers/ApiError.js";

import Product from "../models/product.model.js";

import type {
  CreateProductInput,
  UpdateProductInput,
} from "../validators/product.validator.js";

/*
 * ========================================
 * Types
 * ========================================
 */

interface GetProductsOptions {
  page?: number;
  limit?: number;

  search?: string;

  category?: string;
  subcategory?: string;
  room?: string;
  material?: string;
  color?: string;

  minPrice?: number;
  maxPrice?: number;

  sort?: string;
}

interface DecreaseStockInput {
  productId: string;
  quantity: number;
  variantId?: string;
}

interface IncreaseStockInput {
  productId: string;
  quantity: number;
  variantId?: string;
}

/*
 * ========================================
 * Product Service
 * ========================================
 */

class ProductService {
  /*
   * ----------------------------------------
   * Create Product
   * ----------------------------------------
   */

  async createProduct(
    data: CreateProductInput,
  ) {
    const existingProduct =
      await Product.findOne({
        slug: data.slug,
      });

    if (existingProduct) {
      throw new ApiError(
        409,
        "Product with this slug already exists",
      );
    }

    const product =
      await Product.create(data);

    return product;
  }

  /*
   * ----------------------------------------
   * Get Products
   * ----------------------------------------
   */

  async getProducts({
    page = 1,
    limit = 12,
    search,
    category,
    subcategory,
    room,
    material,
    color,
    minPrice,
    maxPrice,
    sort,
  }: GetProductsOptions) {
    const filter: Record<
      string,
      any
    > = {};

    /*
     * ------------------------------------
     * Search
     * ------------------------------------
     */

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
        {
          subcategory: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    /*
     * ------------------------------------
     * Category
     * ------------------------------------
     */

    if (category) {
      filter.category = {
        $regex: `^${category}$`,
        $options: "i",
      };
    }

    /*
     * ------------------------------------
     * Subcategory
     * ------------------------------------
     */

    if (subcategory) {
      filter.subcategory = {
        $regex: `^${subcategory}$`,
        $options: "i",
      };
    }

    /*
     * ------------------------------------
     * Room
     * ------------------------------------
     */

    if (room) {
      filter.room = {
        $regex: `^${room}$`,
        $options: "i",
      };
    }

    /*
     * ------------------------------------
     * Material
     * ------------------------------------
     */

    if (material) {
      filter.material = {
        $regex: `^${material}$`,
        $options: "i",
      };
    }

    /*
     * ------------------------------------
     * Color
     * ------------------------------------
     */

    if (color) {
      filter.colors = {
        $regex: color,
        $options: "i",
      };
    }

    /*
     * ------------------------------------
     * Price Range
     * ------------------------------------
     */

    if (
      minPrice !== undefined ||
      maxPrice !== undefined
    ) {
      filter.price = {};

      if (
        minPrice !== undefined
      ) {
        filter.price.$gte =
          minPrice;
      }

      if (
        maxPrice !== undefined
      ) {
        filter.price.$lte =
          maxPrice;
      }
    }

    /*
     * ------------------------------------
     * Sorting
     * ------------------------------------
     */

    let sortOption: Record<
      string,
      1 | -1
    > = {
      createdAt: -1,
    };

    switch (sort) {
      case "price_asc":
        sortOption = {
          price: 1,
        };
        break;

      case "price_desc":
        sortOption = {
          price: -1,
        };
        break;

      case "rating":
        sortOption = {
          rating: -1,
        };
        break;

      case "newest":
        sortOption = {
          createdAt: -1,
        };
        break;

      case "oldest":
        sortOption = {
          createdAt: 1,
        };
        break;

      case "popular":
        sortOption = {
          reviews: -1,
        };
        break;
    }

    /*
     * ------------------------------------
     * Pagination
     * ------------------------------------
     */

    const skip =
      (page - 1) * limit;

    const [
      products,
      totalProducts,
    ] = await Promise.all([
      Product.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limit),

      Product.countDocuments(
        filter,
      ),
    ]);

    const totalPages =
      Math.ceil(
        totalProducts / limit,
      );

    return {
      products,

      pagination: {
        page,
        limit,
        totalProducts,
        totalPages,

        hasNextPage:
          page < totalPages,

        hasPreviousPage:
          page > 1,
      },
    };
  }

  /*
   * ----------------------------------------
   * Get Product By Slug
   * ----------------------------------------
   */

  async getProductBySlug(
    slug: string,
  ) {
    const product =
      await Product.findOne({
        slug,
      });

    if (!product) {
      throw new ApiError(
        404,
        "Product not found",
      );
    }

    return product;
  }

  /*
   * ----------------------------------------
   * Get Product By ID
   * ----------------------------------------
   */

  async getProductById(
    id: string,
  ) {
    const product =
      await Product.findById(id);

    if (!product) {
      throw new ApiError(
        404,
        "Product not found",
      );
    }

    return product;
  }

  /*
   * ----------------------------------------
   * Decrease Product Stock
   * ----------------------------------------
   *
   * Atomic stock deduction.
   *
   * Used by Order Service when an order
   * needs to reserve/deduct inventory.
   * ----------------------------------------
   */

  async decreaseStock(
    data: DecreaseStockInput,
  ) {
    const {
      productId,
      quantity,
      variantId,
    } = data;

    /*
     * ------------------------------------
     * Validate Product ID
     * ------------------------------------
     */

    if (!productId?.trim()) {
      throw new ApiError(
        400,
        "Product ID is required",
      );
    }

    /*
     * ------------------------------------
     * Validate Quantity
     * ------------------------------------
     */

    if (
      !Number.isInteger(
        quantity,
      ) ||
      quantity <= 0
    ) {
      throw new ApiError(
        400,
        "Quantity must be a positive integer",
      );
    }

    /*
     * ------------------------------------
     * Variant Stock
     * ------------------------------------
     */

    if (variantId) {
      if (!variantId.trim()) {
        throw new ApiError(
          400,
          "Variant ID is invalid",
        );
      }

      const product =
        await Product.findOneAndUpdate(
          {
            _id: productId,

            variants: {
              $elemMatch: {
                _id: variantId,

                stock: {
                  $gte: quantity,
                },
              },
            },
          },

          {
            $inc: {
              "variants.$.stock":
                -quantity,
            },
          },

          {
            new: true,
          },
        );

      if (!product) {
        const existingProduct =
          await Product.findById(
            productId,
          );

        if (!existingProduct) {
          throw new ApiError(
            404,
            "Product not found",
          );
        }

        const variant =
          existingProduct.variants?.find(
            (item) =>
              item._id?.toString() ===
              variantId,
          );

        if (!variant) {
          throw new ApiError(
            404,
            "Product variant not found",
          );
        }

        throw new ApiError(
          400,
          "Insufficient stock",
        );
      }

      const updatedVariant =
        product.variants?.find(
          (item) =>
            item._id?.toString() ===
            variantId,
        );

      return {
        success: true,
        productId,
        variantId,
        quantity,
        remainingStock:
          updatedVariant?.stock ?? 0,
      };
    }

    /*
     * ------------------------------------
     * Product-Level Stock
     * ------------------------------------
     */

    const product =
      await Product.findOneAndUpdate(
        {
          _id: productId,

          stock: {
            $gte: quantity,
          },
        },

        {
          $inc: {
            stock: -quantity,
          },
        },

        {
          new: true,
        },
      );

    if (!product) {
      const existingProduct =
        await Product.findById(
          productId,
        );

      if (!existingProduct) {
        throw new ApiError(
          404,
          "Product not found",
        );
      }

      throw new ApiError(
        400,
        "Insufficient stock",
      );
    }

    return {
      success: true,
      productId,
      quantity,
      remainingStock:
        product.stock,
    };
  }

  /*
   * ----------------------------------------
   * Increase Product Stock
   * ----------------------------------------
   *
   * This is the compensation/rollback
   * operation.
   *
   * If Order Service has already deducted
   * stock for some items but a later item
   * fails, Order Service can call this
   * method to restore the previously
   * deducted inventory.
   *
   * This operation is also atomic.
   * ----------------------------------------
   */

  async increaseStock(
    data: IncreaseStockInput,
  ) {
    const {
      productId,
      quantity,
      variantId,
    } = data;

    /*
     * ------------------------------------
     * Validate Product ID
     * ------------------------------------
     */

    if (!productId?.trim()) {
      throw new ApiError(
        400,
        "Product ID is required",
      );
    }

    /*
     * ------------------------------------
     * Validate Quantity
     * ------------------------------------
     */

    if (
      !Number.isInteger(
        quantity,
      ) ||
      quantity <= 0
    ) {
      throw new ApiError(
        400,
        "Quantity must be a positive integer",
      );
    }

    /*
     * ------------------------------------
     * Variant Stock
     * ------------------------------------
     */

    if (variantId) {
      if (!variantId.trim()) {
        throw new ApiError(
          400,
          "Variant ID is invalid",
        );
      }

      const product =
        await Product.findOneAndUpdate(
          {
            _id: productId,

            variants: {
              $elemMatch: {
                _id: variantId,
              },
            },
          },

          {
            $inc: {
              "variants.$.stock":
                quantity,
            },
          },

          {
            new: true,
          },
        );

      if (!product) {
        const existingProduct =
          await Product.findById(
            productId,
          );

        if (!existingProduct) {
          throw new ApiError(
            404,
            "Product not found",
          );
        }

        const variant =
          existingProduct.variants?.find(
            (item) =>
              item._id?.toString() ===
              variantId,
          );

        if (!variant) {
          throw new ApiError(
            404,
            "Product variant not found",
          );
        }
      }

      const updatedVariant =
        product?.variants?.find(
          (item) =>
            item._id?.toString() ===
            variantId,
        );

      return {
        success: true,
        productId,
        variantId,
        quantity,
        remainingStock:
          updatedVariant?.stock ?? 0,
      };
    }

    /*
     * ------------------------------------
     * Product-Level Stock
     * ------------------------------------
     */

    const product =
      await Product.findOneAndUpdate(
        {
          _id: productId,
        },

        {
          $inc: {
            stock: quantity,
          },
        },

        {
          new: true,
        },
      );

    if (!product) {
      throw new ApiError(
        404,
        "Product not found",
      );
    }

    return {
      success: true,
      productId,
      quantity,
      remainingStock:
        product.stock,
    };
  }

  /*
   * ----------------------------------------
   * Update Product
   * ----------------------------------------
   *
   * ADMIN PANEL USES THIS METHOD.
   *
   * Admin can directly update:
   *
   * - Product stock
   * - Variant stock
   * - Price
   * - Images
   * - Product information
   * - Variants
   *
   * This remains completely separate
   * from decreaseStock() and
   * increaseStock().
   * ----------------------------------------
   */

  async updateProduct(
    id: string,
    data: UpdateProductInput,
  ) {
    const product =
      await Product.findById(id);

    if (!product) {
      throw new ApiError(
        404,
        "Product not found",
      );
    }

    /*
     * ------------------------------------
     * Duplicate Slug Check
     * ------------------------------------
     */

    if (
      data.slug &&
      data.slug !== product.slug
    ) {
      const existingProduct =
        await Product.findOne({
          slug: data.slug,
        });

      if (existingProduct) {
        throw new ApiError(
          409,
          "Product with this slug already exists",
        );
      }
    }

    /*
     * ------------------------------------
     * Admin Update
     * ------------------------------------
     */

    Object.assign(
      product,
      data,
    );

    await product.save();

    return product;
  }

  /*
   * ----------------------------------------
   * Delete Product
   * ----------------------------------------
   */

  async deleteProduct(
    id: string,
  ) {
    const product =
      await Product.findById(id);

    if (!product) {
      throw new ApiError(
        404,
        "Product not found",
      );
    }

    await Product.findByIdAndDelete(
      id,
    );

    return product;
  }
}

export default new ProductService();