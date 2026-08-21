import {
  Router,
} from "express";

import {
  createCoupon,
  deleteCoupon,
  getCouponById,
  getCoupons,
  updateCoupon,
  useCoupon,
  validateCoupon,
} from "../controllers/coupon.controller.js";

const router = Router();



router.post(
  "/validate",
  validateCoupon,
);


router.post(
  "/",
  createCoupon,
);



router.get(
  "/",
  getCoupons,
);



router.get(
  "/:id",
  getCouponById,
);


router.patch(
  "/:id",
  updateCoupon,
);



router.delete(
  "/:id",
  deleteCoupon,
);

router.post(
  "/:id/use",
  useCoupon,
);

export default router;