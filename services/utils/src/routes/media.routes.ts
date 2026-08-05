import { Router } from "express";
import MediaController from "../controllers/media.controller.js";
import validate from "../middleware/validate.middleware.js";
import upload from "../utils/multer.js";
import { deleteImageSchema,deleteImagesSchema,} from "../validators/media.validator.js";

const router = Router();


router.post(
  "/upload/avatar",
  upload.single("image"),
  MediaController.uploadAvatar
);

router.post(
  "/upload/product",
  upload.single("image"),
  MediaController.uploadProduct
);

router.post(
  "/upload/category",
  upload.single("image"),
  MediaController.uploadCategory
);

router.post(
  "/upload/brand",
  upload.single("image"),
  MediaController.uploadBrand
);

router.post(
  "/upload/review",
  upload.single("image"),
  MediaController.uploadReview
);



router.post(
  "/upload/product/multiple",
  upload.array("images", 10),
  MediaController.uploadProductImages
);

router.post(
  "/upload/review/multiple",
  upload.array("images", 10),
  MediaController.uploadReviewImages
);


router.delete(
  "/delete",
  validate(deleteImageSchema),
  MediaController.deleteImage
);

router.delete(
  "/delete/multiple",
  validate(deleteImagesSchema),
  MediaController.deleteImages
);

export default router;