import { Router } from "express";

import ProductController from "../controllers/product.controller.js";

import validate from "../middleware/validate.middleware.js";

import {
  createProductSchema,updateProductSchema
} from "../validators/product.validator.js";

const router = Router();


router.post(
  "/",
  validate(createProductSchema),
  ProductController.createProduct,
);


router.get(
  "/",
  ProductController.getProducts,
);

router.get(
  "/:slug",
  ProductController.getProductBySlug,
);

router.patch(
  "/:id",
  validate(updateProductSchema),
  ProductController.updateProduct,
);

router.delete(
  "/:id",
  ProductController.deleteProduct,
);

export default router;