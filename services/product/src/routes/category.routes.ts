import { Router } from "express";

import CategoryController from "../controllers/category.controller.js";

import validate from "../middleware/validate.middleware.js";

import authenticate from "../middleware/auth.middleware.js";

import authorize from "../middleware/authorize.middleware.js";

import {
  createCategorySchema,
  updateCategorySchema,
  createSubcategorySchema,
  updateSubcategorySchema,
} from "../validators/category.validator.js";

const router = Router();

/*
 * ========================================
 * PUBLIC ROUTES
 * ========================================
 */

/*
 * GET /api/v1/categories
 */

router.get(
  "/",
  CategoryController.getCategories,
);

/*
 * GET /api/v1/categories/id/:id
 *
 * Keep this BEFORE "/:slug"
 */

router.get(
  "/id/:id",
  CategoryController.getCategoryById,
);

/*
 * GET /api/v1/categories/:slug
 */

router.get(
  "/:slug",
  CategoryController.getCategoryBySlug,
);

/*
 * ========================================
 * ADMIN ROUTES
 * ========================================
 */

/*
 * POST /api/v1/categories
 */

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createCategorySchema),
  CategoryController.createCategory,
);

/*
 * PATCH /api/v1/categories/:id
 */

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(updateCategorySchema),
  CategoryController.updateCategory,
);

/*
 * DELETE /api/v1/categories/:id
 */

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  CategoryController.deleteCategory,
);

/*
 * POST /api/v1/categories/:id/subcategories
 */

router.post(
  "/:id/subcategories",
  authenticate,
  authorize("admin"),
  validate(createSubcategorySchema),
  CategoryController.addSubcategory,
);

/*
 * DELETE
 * /api/v1/categories/:id/subcategories/:subcategoryId
 */

router.delete(
  "/:id/subcategories/:subcategoryId",
  authenticate,
  authorize("admin"),
  CategoryController.deleteSubcategory,
);


/* 
 * PATCH
 * /api/v1/categories/:id/subcategories/:subcategoryId
 */

router.patch(
  "/:id/subcategories/:subcategoryId",
  authenticate,
  authorize("admin"),
  validate(updateSubcategorySchema),
  CategoryController.updateSubcategory,
);

export default router;