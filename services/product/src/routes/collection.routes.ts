import { Router } from "express";

import CollectionController from "../controllers/collection.controller.js";

import validate from "../middleware/validate.middleware.js";

import authenticate from "../middleware/auth.middleware.js";

import authorize from "../middleware/authorize.middleware.js";

import {
  createCollectionSchema,
  updateCollectionSchema,
} from "../validators/collection.validator.js";

const router = Router();

/*
 * ========================================
 * PUBLIC ROUTES
 * ========================================
 */

/*
 * GET /api/v1/collections
 */

router.get(
  "/",
  CollectionController.getCollections,
);

/*
 * GET /api/v1/collections/active
 *
 * IMPORTANT:
 * Keep this before "/:slug"
 */

router.get(
  "/active",
  CollectionController.getActiveCollections,
);

/*
 * GET /api/v1/collections/id/:id
 *
 * IMPORTANT:
 * Keep this before "/:slug"
 */

router.get(
  "/id/:id",
  CollectionController.getCollectionById,
);

/*
 * GET /api/v1/collections/:slug
 */

router.get(
  "/:slug",
  CollectionController.getCollectionBySlug,
);

/*
 * ========================================
 * ADMIN ROUTES
 * ========================================
 */

/*
 * POST /api/v1/collections
 */

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createCollectionSchema),
  CollectionController.createCollection,
);

/*
 * PATCH /api/v1/collections/:id
 */

router.patch(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(updateCollectionSchema),
  CollectionController.updateCollection,
);

/*
 * DELETE /api/v1/collections/:id
 */

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  CollectionController.deleteCollection,
);

export default router;