import { Router } from "express";

import ProductController from "../controllers/product.controller.js";

import validate from "../middleware/validate.middleware.js";
import { productQuerySchema } from "../validators/product-query.validator.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/product.validator.js";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";

const router = Router();

/*
 * Public
 */
router.get(
  "/",
  validate(productQuerySchema, "query"),
  ProductController.getProducts,
);

router.get(
  "/id/:id",
  ProductController.getProductById,
);


router.get(
  "/:slug",
  ProductController.getProductBySlug,
);

/*
 * Admin only
 */
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createProductSchema),
  ProductController.createProduct,
);

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(updateProductSchema),
  ProductController.updateProduct,
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  ProductController.deleteProduct,
);

export default router;