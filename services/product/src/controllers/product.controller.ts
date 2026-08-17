import asyncHandler from "../helpers/asyncHandler.js";

import {
  successResponse,
} from "../helpers/response.js";

import productService from "../services/product.service.js";

import type {
  ProductQueryInput,
} from "../validators/product-query.validator.js";

import {
  PRODUCT_MESSAGES,
} from "../constants/messages.js";

import type {
  CreateProductInput,
  UpdateProductInput,
} from "../validators/product.validator.js";

/*
 * ========================================
 * Types
 * ========================================
 */

interface DecreaseStockBody {
  productId: string;

  quantity: number;

  variantId?: string;
}

/*
 * ========================================
 * Product Controller
 * ========================================
 */

class ProductController {
  /*
   * ----------------------------------------
   * Create Product
   * POST /api/v1/products
   * ----------------------------------------
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

  /*
   * ----------------------------------------
   * Get Products
   * GET /api/v1/products
   * ----------------------------------------
   */

  getProducts =
    asyncHandler(
      async (
        req,
        res,
      ) => {
        console.log(
          "🔥 GET PRODUCTS CONTROLLER HIT",
        );

        const query =
          res.locals
            .validated as ProductQueryInput;

        console.log(
          "Validated query:",
          query,
        );

        const result =
          await productService.getProducts(
            query,
          );

        return successResponse(
          res,
          200,
          PRODUCT_MESSAGES.PRODUCTS_FETCHED,
          result,
        );
      },
    );

  /*
   * ----------------------------------------
   * Get Product By ID
   * GET /api/v1/products/id/:id
   * ----------------------------------------
   */

  getProductById =
    asyncHandler<{
      id: string;
    }>(
      async (
        req,
        res,
      ) => {
        const product =
          await productService.getProductById(
            req.params.id,
          );

        return successResponse(
          res,
          200,
          PRODUCT_MESSAGES.PRODUCT_FETCHED,
          product,
        );
      },
    );

  /*
   * ----------------------------------------
   * Get Product By Slug
   * GET /api/v1/products/:slug
   * ----------------------------------------
   */

  getProductBySlug =
    asyncHandler<{
      slug: string;
    }>(
      async (
        req,
        res,
      ) => {
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
      },
    );

  /*
   * ----------------------------------------
   * Decrease Product Stock
   *
   * POST
   * /api/v1/products/internal/decrease-stock
   * ----------------------------------------
   *
   * This endpoint will be used by the
   * Order Service.
   *
   * We will secure this route with an
   * internal service secret in the next
   * step.
   * ----------------------------------------
   */

  decreaseStock =
    asyncHandler<
      Record<string, string>,
      unknown,
      DecreaseStockBody
    >(
      async (
        req,
        res,
      ) => {
        const {
          productId,
          quantity,
          variantId,
        } = req.body;

        const result =
          await productService.decreaseStock(
            {
              productId,

              quantity,

              ...(variantId
                ? {
                    variantId,
                  }
                : {}),
            },
          );

        return successResponse(
          res,
          200,
          "Product stock updated successfully",
          result,
        );
      },
    );

  /*
   * ----------------------------------------
   * Update Product
   * PATCH /api/v1/products/:id
   * ----------------------------------------
   *
   * Admin panel continues to use this.
   *
   * Admin can manually update:
   *
   * - Product stock
   * - Variant stock
   * - Price
   * - Images
   * - Product information
   * - Variants
   * ----------------------------------------
   */

  updateProduct =
    asyncHandler<
      { id: string },
      unknown,
      UpdateProductInput
    >(
      async (
        req,
        res,
      ) => {
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

  /*
   * ----------------------------------------
   * Delete Product
   * DELETE /api/v1/products/:id
   * ----------------------------------------
   */

  deleteProduct =
    asyncHandler<{
      id: string;
    }>(
      async (
        req,
        res,
      ) => {
        await productService.deleteProduct(
          req.params.id,
        );

        return successResponse(
          res,
          200,
          PRODUCT_MESSAGES.PRODUCT_DELETED,
        );
      },
    );
}

export default new ProductController();