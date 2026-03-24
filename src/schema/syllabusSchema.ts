import { z } from "zod";

const syllabusSchema = z.object({
    courseId: z.string().min(1, "Course is required"),
    title: z.string().min(1, "Title is required"),
    moduleLabel: z.string().min(1, "Module label is required"),
    coverImage: z.string().optional(),
});

export type syllabusSchemaType = z.infer<typeof syllabusSchema> & { _id?: string };
export default syllabusSchema;
