import { Request, Response } from "express";

import asyncHandler from "../helpers/asyncHandler.js";
import { successResponse } from "../helpers/response.js";

import productService from "../services/product.service.js";

import { PRODUCT_MESSAGES } from "../constants/messages.js";

import {
  CreateProductInput,UpdateProductInput
} from "../validators/product.validator.js";

class ProductController {
  /**
   * POST /api/v1/products
   */
  createProduct = asyncHandler<
    Record<string, string>,
    unknown,
    CreateProductInput
  >(async (req, res) => {
    const product =
      await productService.createProduct(
        req.body,
      );

    return successResponse(
      res,
      201,
      PRODUCT_MESSAGES.PRODUCT_CREATED,
      product,
    );
  });

  /**
   * GET /api/v1/products
   */
  getProducts = asyncHandler(
    async (_req: Request, res: Response) => {
      const products =
        await productService.getProducts();

      return successResponse(
        res,
        200,
        PRODUCT_MESSAGES.PRODUCTS_FETCHED,
        products,
      );
    },
  );

  /**
   * GET /api/v1/products/:slug
   */
  getProductBySlug = asyncHandler<{
    slug: string;
  }>(async (req, res) => {
    const product =
      await productService.getProductBySlug(
        req.params.slug,
      );

    return successResponse(
      res,
      200,
      PRODUCT_MESSAGES.PRODUCT_FETCHED,
      product,
    );
  });


  updateProduct = asyncHandler<{
  id: string;
}, unknown, UpdateProductInput>(
  async (req, res) => {
    const product =
      await productService.updateProduct(
        req.params.id,
        req.body,
      );

    return successResponse(
      res,
      200,
      PRODUCT_MESSAGES.PRODUCT_UPDATED,
      product,
    );
  },
);

deleteProduct = asyncHandler<{
  id: string;
}>(async (req, res) => {
  await productService.deleteProduct(
    req.params.id,
  );

  return successResponse(
    res,
    200,
    PRODUCT_MESSAGES.PRODUCT_DELETED,
  );
});

}

export default new ProductController();