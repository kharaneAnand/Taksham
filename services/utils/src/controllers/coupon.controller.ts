import type {
  Request,
  Response,
} from "express";

import Coupon from "../models/coupon.model.js";

import {
  createCouponSchema,
  updateCouponSchema,
} from "../validators/coupon.validation.js";



export const createCoupon =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const data =
        createCouponSchema.parse(
          req.body,
        );

      const existingCoupon =
        await Coupon.findOne({
          code: data.code.toUpperCase(),
        });

      if (existingCoupon) {
        res.status(409).json({
          success: false,
          message:
            "Coupon code already exists",
        });

        return;
      }

      const coupon =
        await Coupon.create({
          ...data,
          code:
            data.code.toUpperCase(),
        });

      res.status(201).json({
        success: true,
        message:
          "Coupon created successfully",
        coupon,
      });
    } catch (error: any) {
      if (error?.name === "ZodError") {
        res.status(400).json({
          success: false,
          message:
            "Invalid coupon data",
          errors: error.issues,
        });

        return;
      }

      console.error(
        "Create coupon error:",
        error,
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to create coupon",
      });
    }
  };



export const getCoupons =
  async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const coupons =
        await Coupon.find()
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        coupons,
      });
    } catch (error) {
      console.error(
        "Get coupons error:",
        error,
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch coupons",
      });
    }
  };



export const getCouponById =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const coupon =
        await Coupon.findById(
          req.params.id,
        );

      if (!coupon) {
        res.status(404).json({
          success: false,
          message:
            "Coupon not found",
        });

        return;
      }

      res.status(200).json({
        success: true,
        coupon,
      });
    } catch (error) {
      console.error(
        "Get coupon error:",
        error,
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch coupon",
      });
    }
  };



export const updateCoupon =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const data =
        updateCouponSchema.parse(
          req.body,
        );

      const coupon =
        await Coupon.findById(
          req.params.id,
        );

      if (!coupon) {
        res.status(404).json({
          success: false,
          message:
            "Coupon not found",
        });

        return;
      }



      if (
        data.code &&
        data.code.toUpperCase() !==
          coupon.code
      ) {
        const existingCoupon =
          await Coupon.findOne({
            code:
              data.code.toUpperCase(),
            _id: {
              $ne: coupon._id,
            },
          });

        if (existingCoupon) {
          res.status(409).json({
            success: false,
            message:
              "Coupon code already exists",
          });

          return;
        }
      }

      Object.assign(
        coupon,
        {
          ...data,
          ...(data.code && {
            code:
              data.code.toUpperCase(),
          }),
        },
      );

      await coupon.save();

      res.status(200).json({
        success: true,
        message:
          "Coupon updated successfully",
        coupon,
      });
    } catch (error: any) {
      if (error?.name === "ZodError") {
        res.status(400).json({
          success: false,
          message:
            "Invalid coupon data",
          errors: error.issues,
        });

        return;
      }

      console.error(
        "Update coupon error:",
        error,
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update coupon",
      });
    }
  };


export const deleteCoupon =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const coupon =
        await Coupon.findByIdAndDelete(
          req.params.id,
        );

      if (!coupon) {
        res.status(404).json({
          success: false,
          message:
            "Coupon not found",
        });

        return;
      }

      res.status(200).json({
        success: true,
        message:
          "Coupon deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete coupon error:",
        error,
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete coupon",
      });
    }
  };
 

export const useCoupon =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const coupon =
        await Coupon.findById(
          req.params.id,
        );

      if (!coupon) {
        res.status(404).json({
          success: false,
          message:
            "Coupon not found",
        });

        return;
      }

      const now = new Date();

      /*
       * ========================================
       * RECHECK COUPON STATUS
       * ========================================
       */

      if (!coupon.isActive) {
        res.status(400).json({
          success: false,
          message:
            "This coupon is currently inactive",
        });

        return;
      }

      if (
        now < coupon.startDate
      ) {
        res.status(400).json({
          success: false,
          message:
            "This coupon is not active yet",
        });

        return;
      }

      if (
        now > coupon.endDate
      ) {
        res.status(400).json({
          success: false,
          message:
            "This coupon has expired",
        });

        return;
      }

      /*
       * ========================================
       * USAGE LIMIT
       * ========================================
       */

      if (
        coupon.usageLimit !==
          undefined &&
        coupon.usedCount >=
          coupon.usageLimit
      ) {
        res.status(400).json({
          success: false,
          message:
            "This coupon has reached its usage limit",
        });

        return;
      }

      /*
       * ========================================
       * INCREMENT USAGE
       * ========================================
       */

      coupon.usedCount += 1;

      await coupon.save();

      res.status(200).json({
        success: true,
        message:
          "Coupon usage recorded successfully",
        coupon: {
          _id: coupon._id,
          code: coupon.code,
          usedCount:
            coupon.usedCount,
          usageLimit:
            coupon.usageLimit,
        },
      });
    } catch (error) {
      console.error(
        "Use coupon error:",
        error,
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to record coupon usage",
      });
    }
  };



export const validateCoupon =
  async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const {
        code,
        subtotal,
      } = req.body;

      if (
        typeof code !== "string" ||
        !code.trim()
      ) {
        res.status(400).json({
          success: false,
          message:
            "Coupon code is required",
        });

        return;
      }

      if (
        typeof subtotal !== "number" ||
        subtotal < 0
      ) {
        res.status(400).json({
          success: false,
          message:
            "A valid subtotal is required",
        });

        return;
      }

      const coupon =
        await Coupon.findOne({
          code:
            code.trim().toUpperCase(),
        });

      if (!coupon) {
        res.status(404).json({
          success: false,
          message:
            "Invalid coupon code",
        });

        return;
      }

      const now = new Date();

  

      if (!coupon.isActive) {
        res.status(400).json({
          success: false,
          message:
            "This coupon is currently inactive",
        });

        return;
      }

    

      if (now < coupon.startDate) {
        res.status(400).json({
          success: false,
          message:
            "This coupon is not active yet",
        });

        return;
      }

      if (now > coupon.endDate) {
        res.status(400).json({
          success: false,
          message:
            "This coupon has expired",
        });

        return;
      }

  

      if (
        coupon.usageLimit !==
          undefined &&
        coupon.usedCount >=
          coupon.usageLimit
      ) {
        res.status(400).json({
          success: false,
          message:
            "This coupon has reached its usage limit",
        });

        return;
      }


      if (
        subtotal <
        coupon.minimumOrderAmount
      ) {
        res.status(400).json({
          success: false,
          message: `Minimum order amount of ₹${coupon.minimumOrderAmount.toLocaleString(
            "en-IN",
          )} is required for this coupon`,
        });

        return;
      }



      let discountAmount = 0;

      if (
        coupon.discountType ===
        "percentage"
      ) {
        discountAmount =
          (subtotal *
            coupon.discountValue) /
          100;



        if (
          coupon.maximumDiscountAmount !==
            undefined
        ) {
          discountAmount =
            Math.min(
              discountAmount,
              coupon.maximumDiscountAmount,
            );
        }
      } else {
        discountAmount =
          coupon.discountValue;
      }



      discountAmount =
        Math.min(
          discountAmount,
          subtotal,
        );

      discountAmount =
        Math.round(discountAmount);

      const finalAmount =
        Math.max(
          0,
          subtotal -
            discountAmount,
        );

      res.status(200).json({
        success: true,
        message:
          "Coupon applied successfully",

        coupon: {
          _id: coupon._id,
          code: coupon.code,
          description:
            coupon.description,
          discountType:
            coupon.discountType,
          discountValue:
            coupon.discountValue,
        },

        subtotal,

        discountAmount,

        finalAmount,
      });
    } catch (error) {
      console.error(
        "Validate coupon error:",
        error,
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to validate coupon",
      });
    }
  };



export const markCouponAsUsed =
  async (
    couponId: string,
  ): Promise<void> => {
    const coupon =
      await Coupon.findById(
        couponId,
      );

    if (!coupon) {
      throw new Error(
        "Coupon not found",
      );
    }

    /*
     * Safety check:
     * Don't allow usage beyond
     * the configured usage limit.
     */

    if (
      coupon.usageLimit !==
        undefined &&
      coupon.usedCount >=
        coupon.usageLimit
    ) {
      throw new Error(
        "Coupon usage limit has been reached",
      );
    }

    coupon.usedCount += 1;

    await coupon.save();
  };