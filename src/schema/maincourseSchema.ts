import { z } from "zod";

const maincourseSchema = z.object({
    name: z.string().min(1, "Name is required"),
    image: z.any(),
    description: z.string().min(1, "Description is required"),
});

export type maincourseSchemaType = z.infer<typeof maincourseSchema> & { _id?: string };
export default maincourseSchema;