import type {
  Request,
  Response,
} from "express";

import Offer from "../models/offer.model.js";

import {
  createOfferSchema,
  updateOfferSchema,
} from "../validators/offer.validation.js";

/* ========================================
 * GET ALL OFFERS
 * ======================================== */

export const getAllOffers = async (
  _req: Request,
  res: Response,
) => {
  const offers =
    await Offer.find()
      .sort({
        createdAt: -1,
      })
      .lean();

  return res.status(200).json({
    success: true,
    data: offers,
  });
};

/* ========================================
 * GET ACTIVE OFFERS
 * ======================================== */

export const getActiveOffers = async (
  _req: Request,
  res: Response,
) => {
  const now = new Date();

  const offers =
    await Offer.find({
      isActive: true,

      startDate: {
        $lte: now,
      },

      endDate: {
        $gte: now,
      },
    })
      .sort({
        discountValue: -1,
      })
      .lean();

  return res.status(200).json({
    success: true,
    data: offers,
  });
};

/* ========================================
 * GET OFFER BY ID
 * ======================================== */

export const getOfferById = async (
  req: Request,
  res: Response,
) => {
  const offer =
    await Offer.findById(
      req.params.id,
    ).lean();

  if (!offer) {
    return res.status(404).json({
      success: false,
      message: "Offer not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: offer,
  });
};

/* ========================================
 * GET OFFER BY SLUG
 * ======================================== */

export const getOfferBySlug = async (
  req: Request,
  res: Response,
) => {
  const offer =
    await Offer.findOne({
      slug: req.params.slug,
    }).lean();

  if (!offer) {
    return res.status(404).json({
      success: false,
      message: "Offer not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: offer,
  });
};

/* ========================================
 * CREATE OFFER
 * ======================================== */

export const createOffer = async (
  req: Request,
  res: Response,
) => {
  const parsed =
    createOfferSchema.safeParse(
      req.body,
    );

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid offer data",
      errors:
        parsed.error.flatten(),
    });
  }

  const data =
    parsed.data;

  const existingOffer =
    await Offer.findOne({
      slug: data.slug,
    });

  if (existingOffer) {
    return res.status(409).json({
      success: false,
      message:
        "An offer with this slug already exists",
    });
  }

  const offer =
    await Offer.create(
      data,
    );

  return res.status(201).json({
    success: true,
    message:
      "Offer created successfully",
    data: offer,
  });
};

/* ========================================
 * UPDATE OFFER
 * ======================================== */

export const updateOffer = async (
  req: Request,
  res: Response,
) => {
  const parsed =
    updateOfferSchema.safeParse(
      req.body,
    );

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid offer data",
      errors:
        parsed.error.flatten(),
    });
  }

  const existingOffer =
    await Offer.findById(
      req.params.id,
    );

  if (!existingOffer) {
    return res.status(404).json({
      success: false,
      message: "Offer not found",
    });
  }

  /*
   * Check slug uniqueness only when
   * the slug is being changed.
   */
  if (
    parsed.data.slug &&
    parsed.data.slug !==
      existingOffer.slug
  ) {
    const slugExists =
      await Offer.exists({
        slug: parsed.data.slug,

        _id: {
          $ne: existingOffer._id,
        },
      });

    if (slugExists) {
      return res.status(409).json({
        success: false,
        message:
          "An offer with this slug already exists",
      });
    }
  }

  /*
   * Merge current data with incoming
   * PATCH data so complete business
   * rules can be validated.
   */
  const mergedData = {
    name:
      parsed.data.name ??
      existingOffer.name,

    slug:
      parsed.data.slug ??
      existingOffer.slug,

    description:
      parsed.data.description ??
      existingOffer.description,

    discountType:
      parsed.data.discountType ??
      existingOffer.discountType,

    discountValue:
      parsed.data.discountValue ??
      existingOffer.discountValue,

    appliesTo:
      parsed.data.appliesTo ??
      existingOffer.appliesTo,

    productIds:
      parsed.data.productIds ??
      existingOffer.productIds.map(
        (id) => id.toString(),
      ),

    collectionIds:
      parsed.data.collectionIds ??
      existingOffer.collectionIds.map(
        (id) => id.toString(),
      ),

    startDate:
      parsed.data.startDate ??
      existingOffer.startDate,

    endDate:
      parsed.data.endDate ??
      existingOffer.endDate,

    isActive:
      parsed.data.isActive ??
      existingOffer.isActive,
  };

  /*
   * Validate the complete merged offer.
   */
  const completeValidation =
    createOfferSchema.safeParse(
      mergedData,
    );

  if (!completeValidation.success) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid offer data",
      errors:
        completeValidation.error.flatten(),
    });
  }

  Object.assign(
    existingOffer,
    completeValidation.data,
  );

  await existingOffer.save();

  return res.status(200).json({
    success: true,
    message:
      "Offer updated successfully",
    data: existingOffer,
  });
};

/* ========================================
 * DELETE OFFER
 * ======================================== */

export const deleteOffer = async (
  req: Request,
  res: Response,
) => {
  const offer =
    await Offer.findByIdAndDelete(
      req.params.id,
    );

  if (!offer) {
    return res.status(404).json({
      success: false,
      message: "Offer not found",
    });
  }

  return res.status(200).json({
    success: true,
    message:
      "Offer deleted successfully",
  });
};