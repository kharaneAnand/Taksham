import multer from "multer";
import ApiError from "../helpers/ApiError.js";
import { StatusCodes } from "../constants/http.js";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new ApiError(
        StatusCodes.BAD_REQUEST,
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      )
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

export default upload;