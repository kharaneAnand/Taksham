import cloudinary from "../config/cloudinary.js";
import { MediaFolder } from "../constants/media.js";
import ApiError from "../helpers/ApiError.js";
import { StatusCodes } from "../constants/http.js";
import { MEDIA_MESSAGES } from "../constants/messages.js";
import { UploadedImage } from "../types/media.types.js";

class MediaService {
  async uploadImage(
    file: Express.Multer.File,
    folder: MediaFolder
  ): Promise<UploadedImage> {
    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      {
        folder: `ecommerce/${folder}`,
      }
    );

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  }

  async uploadImages(
  files: Express.Multer.File[],
  folder: MediaFolder
): Promise<UploadedImage[]> {

  return Promise.all(
    files.map((file) =>
      this.uploadImage(file, folder)
    )
  );

}

 async deleteImage(
  publicId: string
): Promise<void> {

  const result = await cloudinary.uploader.destroy(publicId);

  if (result.result !== "ok") {
  throw new ApiError(
    StatusCodes.NOT_FOUND,
    MEDIA_MESSAGES.IMAGE_NOT_FOUND
  );
}

}

async deleteImages(
  publicIds: string[]
): Promise<any> {
  return await cloudinary.api.delete_resources(publicIds);
}

}

export default new MediaService();