import { z } from "zod";

export const deleteImageSchema = z.object({
  publicId: z.string().min(1, "Public ID is required."),
});

export type DeleteImageInput = z.infer<
  typeof deleteImageSchema
>;