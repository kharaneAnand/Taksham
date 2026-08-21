import { Router } from "express";

import {
  createOffer,
  deleteOffer,
  getActiveOffers,
  getAllOffers,
  getOfferById,
  updateOffer,
} from "../controllers/offer.controller.js";

const router = Router();

/*
 * ========================================
 * CREATE OFFER
 * POST /api/v1/offers
 * ========================================
 */

router.post(
  "/",
  createOffer,
);

/*
 * ========================================
 * GET ALL OFFERS
 * GET /api/v1/offers
 * ========================================
 */

router.get(
  "/",
  getAllOffers,
);

/*
 * ========================================
 * GET ACTIVE OFFERS
 * GET /api/v1/offers/active
 *
 * IMPORTANT:
 * This route must come before "/:id".
 * ========================================
 */

router.get(
  "/active",
  getActiveOffers,
);

/*
 * ========================================
 * GET OFFER BY ID
 * GET /api/v1/offers/:id
 * ========================================
 */

router.get(
  "/:id",
  getOfferById,
);

/*
 * ========================================
 * UPDATE OFFER
 * PATCH /api/v1/offers/:id
 * ========================================
 */

router.patch(
  "/:id",
  updateOffer,
);

/*
 * ========================================
 * DELETE OFFER
 * DELETE /api/v1/offers/:id
 * ========================================
 */

router.delete(
  "/:id",
  deleteOffer,
);

export default router;