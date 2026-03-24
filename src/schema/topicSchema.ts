import { z } from "zod";

const topicSchema = z.object({
    syllabusId: z.string().min(1, "Syllabus is required"),
    courseId: z.string().min(1, "Course is required"),
    title: z.string().min(1, "Title is required"),
    videoUrl: z.string().min(1, "Video is required"),
    overview: z.string().min(10, "Overview must be at least 10 characters"),
    order: z.number().int().min(0).optional(),
});

export type topicSchemaType = z.infer<typeof topicSchema> & { _id?: string };
export default topicSchema;
