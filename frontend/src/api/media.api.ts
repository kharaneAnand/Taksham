export interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

const MEDIA_API_URL =
  import.meta.env.VITE_MEDIA_SERVICE_URL ||
  "http://localhost:5005/api/v1/media";

/*
 * ========================================
 * Upload Single Product Image
 * ========================================
 */

export const uploadProductImage =
  async (
    file: File,
  ): Promise<UploadedImage> => {
    const formData =
      new FormData();

    formData.append(
      "image",
      file,
    );

    const response =
      await fetch(
        `${MEDIA_API_URL}/upload/product`,
        {
          method: "POST",

          credentials: "include",

          body: formData,
        },
      );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result?.message ||
          "Failed to upload image",
      );
    }

    return result.data as UploadedImage;
  };

/*
 * ========================================
 * Upload Multiple Product Images
 * ========================================
 */

export const uploadProductImages =
  async (
    files: File[],
  ): Promise<UploadedImage[]> => {
    const formData =
      new FormData();

    files.forEach((file) => {
      formData.append(
        "images",
        file,
      );
    });

    const response =
      await fetch(
        `${MEDIA_API_URL}/upload/product/multiple`,
        {
          method: "POST",

          credentials: "include",

          body: formData,
        },
      );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result?.message ||
          "Failed to upload images",
      );
    }

    return result.data as UploadedImage[];
  };

/*
 * ========================================
 * Delete Single Image
 * ========================================
 */

export const deleteImage =
  async (
    publicId: string,
  ): Promise<void> => {
    const response =
      await fetch(
        `${MEDIA_API_URL}/delete`,
        {
          method: "DELETE",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body: JSON.stringify({
            publicId,
          }),
        },
      );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result?.message ||
          "Failed to delete image",
      );
    }
  };

/*
 * ========================================
 * Delete Multiple Images
 * ========================================
 */

export const deleteImages =
  async (
    publicIds: string[],
  ): Promise<void> => {
    if (publicIds.length === 0) {
      return;
    }

    const response =
      await fetch(
        `${MEDIA_API_URL}/delete/multiple`,
        {
          method: "DELETE",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",
          },

          body: JSON.stringify({
            publicIds,
          }),
        },
      );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result?.message ||
          "Failed to delete images",
      );
    }
  };