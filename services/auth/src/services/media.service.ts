import axios from "axios";
import FormData from "form-data";
import MEDIA_SERVICE_URL from "../config/media.js";
import ApiError from "../helpers/ApiError.js";
import { StatusCodes } from "../constants/http.js";

interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

class MediaService {
  async uploadAvatar(
    file: Express.Multer.File
  ): Promise<UploadedImage> {

    const formData = new FormData();

    formData.append(
      "image",
      file.buffer,
      {
        filename: file.originalname,
        contentType: file.mimetype,
      }
    );

    try {

      const { data } = await axios.post(
        `${MEDIA_SERVICE_URL}/upload/avatar`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          maxBodyLength: Infinity,
        }
      );

      return data.data;

    } catch(error) {
      console.log(error)
      throw new ApiError(
        StatusCodes.BAD_GATEWAY,
        "Unable to upload avatar."
      );

    }
  }

  async deleteImage(
    publicId: string
  ): Promise<void> {

    try {
      await axios.delete(
        `${MEDIA_SERVICE_URL}/delete`,
        {
          data: {
            publicId,
          },
        }
      );

    } catch(error) {
      console.log(error) ;
      throw new ApiError(
        StatusCodes.BAD_GATEWAY,
        "Unable to delete image."
      );

    }

  }
}

export default new MediaService();