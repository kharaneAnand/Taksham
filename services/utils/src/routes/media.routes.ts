import { Router } from "express";

import MediaController from "../controllers/media.controller.js";
import upload from "../utils/multer.js";

const router = Router();

router.post(
  "/upload",
  upload.single("image"),
  MediaController.uploadImage
);

router.delete(
  "/:publicId",
  MediaController.deleteImage
);

export default router;