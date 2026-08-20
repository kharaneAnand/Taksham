import Category from "../models/category.model.js";

import ApiError from "../helpers/ApiError.js";

import { StatusCodes } from "../constants/http.js";

import type {
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateSubcategoryInput,
  UpdateSubcategoryInput,
} from "../validators/category.validator.js";

class CategoryService {
  /*
   * ========================================
   * Get All Categories
   * ========================================
   */

  async getCategories() {
    return Category.find()
      .sort({
        name: 1,
      })
      .lean();
  }

  /*
   * ========================================
   * Get Category By ID
   * ========================================
   */

  async getCategoryById(
    id: string,
  ) {
    const category =
      await Category.findById(id).lean();

    if (!category) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Category not found",
      );
    }

    return category;
  }

  /*
   * ========================================
   * Get Category By Slug
   * ========================================
   */

  async getCategoryBySlug(
    slug: string,
  ) {
    const category =
      await Category.findOne({
        slug,
      }).lean();

    if (!category) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Category not found",
      );
    }

    return category;
  }

  /*
   * ========================================
   * Create Category
   * ========================================
   */

  async createCategory(
    data: CreateCategoryInput,
  ) {
    const existingCategory =
      await Category.findOne({
        $or: [
          {
            name: data.name,
          },
          {
            slug: data.slug,
          },
        ],
      });

    if (existingCategory) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Category already exists",
      );
    }

    return Category.create(data);
  }

  /*
   * ========================================
   * Update Category
   * ========================================
   */

  async updateCategory(
    id: string,
    data: UpdateCategoryInput,
  ) {
    if (data.slug || data.name) {
      const duplicate =
        await Category.findOne({
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
          "Another category already uses this name or slug",
        );
      }
    }

    const category =
      await Category.findByIdAndUpdate(
        id,
        data,
        {
          new: true,
          runValidators: true,
        },
      );

    if (!category) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Category not found",
      );
    }

    return category;
  }

  /*
   * ========================================
   * Delete Category
   * ========================================
   */

  async deleteCategory(
    id: string,
  ) {
    const category =
      await Category.findByIdAndDelete(id);

    if (!category) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Category not found",
      );
    }
  }

  /*
   * ========================================
   * Add Subcategory
   * ========================================
   */

  async addSubcategory(
    categoryId: string,
    data: CreateSubcategoryInput,
  ) {
    const category =
      await Category.findById(categoryId);

    if (!category) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        "Category not found",
      );
    }

    const alreadyExists =
      category.subcategories.some(
        (subcategory) =>
          subcategory.name.toLowerCase() ===
            data.name.toLowerCase() ||
          subcategory.slug.toLowerCase() ===
            data.slug.toLowerCase(),
      );

    if (alreadyExists) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Subcategory already exists in this category",
      );
    }

    category.subcategories.push({
      name: data.name,
      slug: data.slug,
    });

    await category.save();

    return category;
  }

  /* 
 * ========================================
 * Update Subcategory
 * ========================================
 */

async updateSubcategory(
  categoryId: string,
  subcategoryId: string,
  data: UpdateSubcategoryInput,
) {
  const category =
    await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Category not found",
    );
  }

  const subcategory =
    category.subcategories.find(
      (item) =>
        item._id?.toString() ===
        subcategoryId,
    );

  if (!subcategory) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Subcategory not found",
    );
  }

  const duplicate =
    category.subcategories.some(
      (item) =>
        item._id?.toString() !==
          subcategoryId &&
        (
          (data.name &&
            item.name.toLowerCase() ===
              data.name.toLowerCase()) ||
          (data.slug &&
            item.slug.toLowerCase() ===
              data.slug.toLowerCase())
        ),
    );

  if (duplicate) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "Another subcategory already uses this name or slug",
    );
  }

  if (data.name !== undefined) {
    subcategory.name = data.name;
  }

  if (data.slug !== undefined) {
    subcategory.slug = data.slug;
  }

  await category.save();

  return category;
}

  /*
   * ========================================
   * Delete Subcategory
   * ========================================
   */

  async deleteSubcategory(
  categoryId: string,
  subcategoryId: string,
) {
  const category =
    await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Category not found",
    );
  }

  const subcategoryExists =
    category.subcategories.some(
      (subcategory) =>
        subcategory._id?.toString() ===
        subcategoryId,
    );

  if (!subcategoryExists) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Subcategory not found",
    );
  }

  category.subcategories =
    category.subcategories.filter(
      (subcategory) =>
        subcategory._id?.toString() !==
        subcategoryId,
    );

  await category.save();

  return category;
}
}

export default new CategoryService();