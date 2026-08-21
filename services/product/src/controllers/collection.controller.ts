import type {
  Request,
  Response,
} from "express";

import CollectionService from "../services/collection.service.js";

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

class CollectionController {
  /*
   * ========================================
   * GET ALL COLLECTIONS
   * ========================================
   */

  getCollections = asyncHandler(
    async (_req: Request, res: Response) => {
      const collections =
        await CollectionService.getCollections();

      successResponse(
        res,
        StatusCodes.OK,
        "Collections fetched successfully",
        collections,
      );
    },
  );

  /*
   * ========================================
   * GET ACTIVE COLLECTIONS
   * ========================================
   */

  getActiveCollections = asyncHandler(
    async (_req: Request, res: Response) => {
      const collections =
        await CollectionService.getActiveCollections();

      successResponse(
        res,
        StatusCodes.OK,
        "Active collections fetched successfully",
        collections,
      );
    },
  );

  /*
   * ========================================
   * GET COLLECTION BY ID
   * ========================================
   */

  getCollectionById = asyncHandler(
    async (req: Request, res: Response) => {
      const id = getParam(req.params.id);

      const collection =
        await CollectionService.getCollectionById(
          id,
        );

      successResponse(
        res,
        StatusCodes.OK,
        "Collection fetched successfully",
        collection,
      );
    },
  );

  /*
   * ========================================
   * GET COLLECTION BY SLUG
   * ========================================
   */

  getCollectionBySlug = asyncHandler(
    async (req: Request, res: Response) => {
      const slug = getParam(
        req.params.slug,
      );

      const collection =
        await CollectionService.getCollectionBySlug(
          slug,
        );

      successResponse(
        res,
        StatusCodes.OK,
        "Collection fetched successfully",
        collection,
      );
    },
  );

  /*
   * ========================================
   * CREATE COLLECTION
   * ========================================
   */

  createCollection = asyncHandler(
    async (req: Request, res: Response) => {
      const collection =
        await CollectionService.createCollection(
          req.body,
        );

      successResponse(
        res,
        StatusCodes.CREATED,
        "Collection created successfully",
        collection,
      );
    },
  );

  /*
   * ========================================
   * UPDATE COLLECTION
   * ========================================
   */

  updateCollection = asyncHandler(
    async (req: Request, res: Response) => {
      const id = getParam(req.params.id);

      const collection =
        await CollectionService.updateCollection(
          id,
          req.body,
        );

      successResponse(
        res,
        StatusCodes.OK,
        "Collection updated successfully",
        collection,
      );
    },
  );

  /*
   * ========================================
   * DELETE COLLECTION
   * ========================================
   */

  deleteCollection = asyncHandler(
    async (req: Request, res: Response) => {
      const id = getParam(req.params.id);

      await CollectionService.deleteCollection(
        id,
      );

      successResponse(
        res,
        StatusCodes.OK,
        "Collection deleted successfully",
        null,
      );
    },
  );
}

export default new CollectionController();