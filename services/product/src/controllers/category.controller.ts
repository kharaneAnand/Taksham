import type {
  Request,
  Response,
} from "express";

import CategoryService from "../services/category.service.js";

import asyncHandler from "../helpers/asyncHandler.js";

import { successResponse } from "../helpers/response.js";

import { StatusCodes } from "../constants/http.js";

/*
 * ========================================
 * PARAMETER HELPER
 * ========================================
 */

const getParam = (
  value: string | string[],
): string => {
  return Array.isArray(value)
    ? value[0]
    : value;
};

class CategoryController {
  /*
   * ========================================
   * GET ALL CATEGORIES
   * ========================================
   */

  getCategories = asyncHandler(
    async (_req: Request, res: Response) => {
      const categories =
        await CategoryService.getCategories();

      successResponse(
        res,
        StatusCodes.OK,
        "Categories fetched successfully",
        categories,
      );
    },
  );

  /*
   * ========================================
   * GET CATEGORY BY ID
   * ========================================
   */

  getCategoryById = asyncHandler(
    async (req: Request, res: Response) => {
      const id = getParam(req.params.id);

      const category =
        await CategoryService.getCategoryById(
          id,
        );

      successResponse(
        res,
        StatusCodes.OK,
        "Category fetched successfully",
        category,
      );
    },
  );

  /*
   * ========================================
   * GET CATEGORY BY SLUG
   * ========================================
   */

  getCategoryBySlug = asyncHandler(
    async (req: Request, res: Response) => {
      const slug = getParam(
        req.params.slug,
      );

      const category =
        await CategoryService.getCategoryBySlug(
          slug,
        );

      successResponse(
        res,
        StatusCodes.OK,
        "Category fetched successfully",
        category,
      );
    },
  );

  /*
   * ========================================
   * CREATE CATEGORY
   * ========================================
   */

  createCategory = asyncHandler(
    async (req: Request, res: Response) => {
      const category =
        await CategoryService.createCategory(
          req.body,
        );

      successResponse(
        res,
        StatusCodes.CREATED,
        "Category created successfully",
        category,
      );
    },
  );

  /*
   * ========================================
   * UPDATE CATEGORY
   * ========================================
   */

  updateCategory = asyncHandler(
    async (req: Request, res: Response) => {
      const id = getParam(req.params.id);

      const category =
        await CategoryService.updateCategory(
          id,
          req.body,
        );

      successResponse(
        res,
        StatusCodes.OK,
        "Category updated successfully",
        category,
      );
    },
  );

  /*
   * ========================================
   * DELETE CATEGORY
   * ========================================
   */

  deleteCategory = asyncHandler(
    async (req: Request, res: Response) => {
      const id = getParam(req.params.id);

      await CategoryService.deleteCategory(
        id,
      );

      successResponse(
        res,
        StatusCodes.OK,
        "Category deleted successfully",
        null,
      );
    },
  );

  /*
   * ========================================
   * ADD SUBCATEGORY
   * ========================================
   */

  addSubcategory = asyncHandler(
    async (req: Request, res: Response) => {
      const id = getParam(req.params.id);

      const category =
        await CategoryService.addSubcategory(
          id,
          req.body,
        );

      successResponse(
        res,
        StatusCodes.CREATED,
        "Subcategory added successfully",
        category,
      );
    },
  );

  /*
 * ========================================
 * UPDATE SUBCATEGORY
 * ========================================
 */

updateSubcategory = asyncHandler(
  async (req: Request, res: Response) => {
    const id = getParam(req.params.id);

    const subcategoryId = getParam(
      req.params.subcategoryId,
    );

    const category =
      await CategoryService.updateSubcategory(
        id,
        subcategoryId,
        req.body,
      );

    successResponse(
      res,
      StatusCodes.OK,
      "Subcategory updated successfully",
      category,
    );
  },
);

  /*
   * ========================================
   * DELETE SUBCATEGORY
   * ========================================
   */

  deleteSubcategory = asyncHandler(
    async (req: Request, res: Response) => {
      const id = getParam(req.params.id);

      const subcategoryId = getParam(
        req.params.subcategoryId,
      );

      const category =
        await CategoryService.deleteSubcategory(
          id,
          subcategoryId,
        );

      successResponse(
        res,
        StatusCodes.OK,
        "Subcategory deleted successfully",
        category,
      );
    },
  );
}

export default new CategoryController();