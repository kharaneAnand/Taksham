import cloudinary from "../config/cloudinary.js";
import { UploadedImage } from "../types/media.types.js";

class MediaService {
  async uploadImage(
    file: Express.Multer.File,
    folder: string
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

 async deleteImage(
  publicId: string
): Promise<void> {

  const result = await cloudinary.uploader.destroy(publicId);

  if (result.result !== "ok") {
    throw new Error("Image not found or already deleted.");
  }

}
}

export default new MediaService();