import { Router } from "express";

import ProductController from "../controllers/product.controller.js";

import validate from "../middleware/validate.middleware.js";

import {
  productQuerySchema,
} from "../validators/product-query.validator.js";

import {
  createProductSchema,
  updateProductSchema,
} from "../validators/product.validator.js";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";
import internalAuth from "../middleware/internalAuth.middleware.js";

const router =
  Router();



router.get(
  "/",
  validate(
    productQuerySchema,
    "query",
  ),
  ProductController.getProducts,
);

/*
 * GET /api/v1/products/id/:id
 */

router.get(
  "/id/:id",
  ProductController.getProductById,
);


router.post(
  "/internal/decrease-stock",
  internalAuth,
  ProductController.decreaseStock,
);



router.post(
  "/internal/increase-stock",
  internalAuth,
  ProductController.increaseStock,
);



/*
 * GET /api/v1/products/:slug
 */

router.get(
  "/:slug",
  ProductController.getProductBySlug,
);



/*
 * POST /api/v1/products
 */

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(
    createProductSchema,
  ),
  ProductController.createProduct,
);

/*
 * PATCH /api/v1/products/:id
 */

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(
    updateProductSchema,
  ),
  ProductController.updateProduct,
);

/*
 * DELETE /api/v1/products/:id
 */

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  ProductController.deleteProduct,
);

export default router;