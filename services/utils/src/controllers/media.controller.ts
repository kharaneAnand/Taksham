import { Request, Response } from "express";

import MediaService from "../services/media.service.js";

import asyncHandler from "../helpers/asyncHandler.js";
import ApiError from "../helpers/ApiError.js";
import { successResponse } from "../helpers/response.js";

import { StatusCodes } from "../constants/http.js";
import { MEDIA_MESSAGES } from "../constants/messages.js";
import { MediaFolder } from "../constants/media.js";

class MediaController {
  uploadAvatar = asyncHandler(
    async (req: Request, res: Response) => {

      if (!req.file) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          MEDIA_MESSAGES.IMAGE_REQUIRED
        );
      }

      const image = await MediaService.uploadImage(
        req.file,
        MediaFolder.USER_AVATAR
      );

      successResponse(
        res,
        StatusCodes.CREATED,
        MEDIA_MESSAGES.IMAGE_UPLOADED,
        image
      );

    }
  );

  uploadProduct = asyncHandler(
    async (req: Request, res: Response) => {

      if (!req.file) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          MEDIA_MESSAGES.IMAGE_REQUIRED
        );
      }

      const image = await MediaService.uploadImage(
        req.file,
        MediaFolder.PRODUCT
      );

      successResponse(
        res,
        StatusCodes.CREATED,
        MEDIA_MESSAGES.IMAGE_UPLOADED,
        image
      );

    }
  );


  uploadCategory = asyncHandler(
    async (req: Request, res: Response) => {

      if (!req.file) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          MEDIA_MESSAGES.IMAGE_REQUIRED
        );
      }

      const image = await MediaService.uploadImage(
        req.file,
        MediaFolder.CATEGORY
      );

      successResponse(
        res,
        StatusCodes.CREATED,
        MEDIA_MESSAGES.IMAGE_UPLOADED,
        image
      );

    }
  );


  uploadBrand = asyncHandler(
    async (req: Request, res: Response) => {

      if (!req.file) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          MEDIA_MESSAGES.IMAGE_REQUIRED
        );
      }

      const image = await MediaService.uploadImage(
        req.file,
        MediaFolder.BRAND
      );

      successResponse(
        res,
        StatusCodes.CREATED,
        MEDIA_MESSAGES.IMAGE_UPLOADED,
        image
      );

    }
  );


  uploadReview = asyncHandler(
    async (req: Request, res: Response) => {

      if (!req.file) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          MEDIA_MESSAGES.IMAGE_REQUIRED
        );
      }

      const image = await MediaService.uploadImage(
        req.file,
        MediaFolder.REVIEW
      );

      successResponse(
        res,
        StatusCodes.CREATED,
        MEDIA_MESSAGES.IMAGE_UPLOADED,
        image
      );

    }
  );


  uploadProductImages = asyncHandler(
    async (req: Request, res: Response) => {

      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          MEDIA_MESSAGES.IMAGE_REQUIRED
        );
      }

      const images = await MediaService.uploadImages(
        files,
        MediaFolder.PRODUCT
      );

      successResponse(
        res,
        StatusCodes.CREATED,
        MEDIA_MESSAGES.IMAGES_UPLOADED,
        images
      );

    }
  );


  uploadReviewImages = asyncHandler(
    async (req: Request, res: Response) => {

      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          MEDIA_MESSAGES.IMAGE_REQUIRED
        );
      }

      const images = await MediaService.uploadImages(
        files,
        MediaFolder.REVIEW
      );

      successResponse(
        res,
        StatusCodes.CREATED,
        MEDIA_MESSAGES.IMAGES_UPLOADED,
        images
      );

    }
  );


  deleteImage = asyncHandler(
    async (req: Request, res: Response) => {

      const { publicId } = req.body;

      await MediaService.deleteImage(publicId);

      successResponse(
        res,
        StatusCodes.OK,
        MEDIA_MESSAGES.IMAGE_DELETED,
        null
      );

    }
  );


  deleteImages = asyncHandler(
    async (req: Request, res: Response) => {

      const { publicIds } = req.body;

      const result = await MediaService.deleteImages(publicIds);

      successResponse(
        res,
        StatusCodes.OK,
        MEDIA_MESSAGES.IMAGES_DELETED,
        result
      );

    }
  );

}

export default new MediaController();