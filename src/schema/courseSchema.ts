import { z } from "zod";

const courseSchema = z.object({
    title: z.string().min(2, "Title must be at least 2 characters"),
    photo: z.string().optional().or(z.literal("")),
    videoUrl: z.string().url("Invalid video URL").optional().or(z.literal("")),
    description: z.string().min(10, "Description must be at least 10 characters"),
    duration: z.string().min(1, "Duration is required"),
    rating: z.number().min(0).max(5).optional(),
    totalModules: z.number().int().min(0).optional(),
    isPublished: z.boolean().default(false),
}).refine(
    (data) => !!(data.photo?.length) || !!(data.videoUrl?.length),
    { message: "At least one image or video is required", path: ["photo"] }
);

export type courseSchemaType = z.infer<typeof courseSchema> & { _id?: string };
export default courseSchema;
