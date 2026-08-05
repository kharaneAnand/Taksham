import { Request, Response } from "express";

import MediaService from "../services/media.service.js";

import asyncHandler from "../helpers/asyncHandler.js";
import ApiError from "../helpers/ApiError.js";
import { successResponse } from "../helpers/response.js";

import { StatusCodes } from "../constants/http.js";
import { MEDIA_MESSAGES } from "../constants/messages.js";

class MediaController {
  uploadImage = asyncHandler(
    async (req: Request, res: Response) => {
      if (!req.file) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          MEDIA_MESSAGES.IMAGE_REQUIRED
        );
      }

      const folder = req.body.folder;

      if (!folder) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Folder is required."
        );
      }

      const image = await MediaService.uploadImage(
        req.file,
        folder
      );

      successResponse(
        res,
        StatusCodes.CREATED,
        MEDIA_MESSAGES.IMAGE_UPLOADED,
        image
      );
    }
  );

  deleteImage = asyncHandler(
    async (req: Request, res: Response) => {
      const publicId = req.params.publicId as string;

      if (!publicId) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Public ID is required."
        );
      }

      await MediaService.deleteImage(publicId);

      successResponse(
        res,
        StatusCodes.OK,
        MEDIA_MESSAGES.IMAGE_DELETED,
        null
      );
    }
  );
}

export default new MediaController();