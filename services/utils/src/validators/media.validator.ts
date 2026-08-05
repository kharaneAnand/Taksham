import { z } from "zod";

export const deleteImageSchema = z.object({
  publicId: z.string().min(1, "Public ID is required."),
});

export type DeleteImageInput = z.infer<
  typeof deleteImageSchema
>;

export const deleteImagesSchema = z.object({
  publicIds: z
    .array(z.string().min(1))
    .min(1, "At least one public ID is required."),
});

export type DeleteImagesInput =
  z.infer<typeof deleteImagesSchema>;