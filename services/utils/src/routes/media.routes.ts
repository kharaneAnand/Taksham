import { Router } from "express";

import validate from "../middleware/validate.middleware.js";
import {deleteImageSchema,} from "../validators/media.validator.js";
import MediaController from "../controllers/media.controller.js";
import upload from "../utils/multer.js";

const router = Router();

router.post(
  "/upload",
  upload.single("image"),
  MediaController.uploadImage
);

router.delete(
  "/delete",
  validate(deleteImageSchema),
  MediaController.deleteImage
);


export default router;