import Collection from "../models/collection.model.js";
import Product from "../models/product.model.js";

import ApiError from "../helpers/ApiError.js";

import { StatusCodes } from "../constants/http.js";

import type {
  CreateCollectionInput,
  UpdateCollectionInput,
} from "../validators/collection.validator.js";

class CollectionService {
  /*
   * ========================================
   * Validate Products
   * ========================================
   */

  private async validateProducts(
    productIds: string[],
  ) {
    if (productIds.length === 0) {
      return;
    }

    const uniqueProductIds =
      [...new Set(productIds)];

    const products =
      await Product.find({
        _id: {
          $in: uniqueProductIds,
        },
      }).select("_id");

    if (
      products.length !==
      uniqueProductIds.length
    ) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "One or more selected products do not exist",
      );
    }
  }

  /*
   * ========================================
   * Get All Collections
   * ========================================
   */

  async getCollections() {
    return Collection.find()
      .sort({
        createdAt: -1,
      })
      .lean();
  }

  /*
   * ========================================
   * Get Active Collections
   * ========================================
   */

  async getActiveCollections() {
    return Collection.find({
      isActive: true,
    })
      .sort({
        createdAt: -1,
      })
      .lean();
  }

  /*
   * ========================================
   * Get Collection By ID
   * ========================================
   */

  async getCollectionById(
    id: string,
  ) {
    const collection =
      await Collection.findById(id)
        .populate("products")
        .lean();

    if (!collection) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Collection not found",
      );
    }

    return collection;
  }

  /*
   * ========================================
   * Get Collection By Slug
   * ========================================
   */

  async getCollectionBySlug(
    slug: string,
  ) {
    const collection =
      await Collection.findOne({
        slug,
      })
        .populate("products")
        .lean();

    if (!collection) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Collection not found",
      );
    }

    return collection;
  }

  /*
   * ========================================
   * Create Collection
   * ========================================
   */

  async createCollection(
    data: CreateCollectionInput,
  ) {
    const existingCollection =
      await Collection.findOne({
        $or: [
          {
            name: data.name,
          },
          {
            slug: data.slug,
          },
        ],
      });

    if (existingCollection) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Collection already exists",
      );
    }

    await this.validateProducts(
      data.products,
    );

    return Collection.create({
      ...data,

      products:
        [...new Set(data.products)],
    });
  }

  /*
   * ========================================
   * Update Collection
   * ========================================
   */

  async updateCollection(
    id: string,
    data: UpdateCollectionInput,
  ) {
    if (data.name || data.slug) {
      const duplicate =
        await Collection.findOne({
          _id: {
            $ne: id,
          },

          $or: [
            ...(data.name
              ? [
                  {
                    name: data.name,
                  },
                ]
              : []),

            ...(data.slug
              ? [
                  {
                    slug: data.slug,
                  },
                ]
              : []),
          ],
        });

      if (duplicate) {
        throw new ApiError(
          StatusCodes.CONFLICT,
          "Another collection already uses this name or slug",
        );
      }
    }

    /*
     * Only validate products if
     * admin is updating products.
     */

    if (data.products !== undefined) {
      await this.validateProducts(
        data.products,
      );

      data.products =
        [...new Set(data.products)];
    }

    const collection =
      await Collection.findByIdAndUpdate(
        id,
        data,
        {
          new: true,
          runValidators: true,
        },
      );

    if (!collection) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Collection not found",
      );
    }

    return collection;
  }

  /*
   * ========================================
   * Delete Collection
   * ========================================
   */

  async deleteCollection(
    id: string,
  ) {
    const collection =
      await Collection.findByIdAndDelete(
        id,
      );

    if (!collection) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Collection not found",
      );
    }
  }
}

export default new CollectionService();