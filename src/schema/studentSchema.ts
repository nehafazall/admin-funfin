import { z } from "zod";

const studentSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email").optional(),
    code: z.string().min(1, "Code is required"),
    limit: z.number().min(0, "Limit is required"),
    limitAvailable: z.number().min(0, "Limit Available is required").optional(),
    isActive: z.boolean().optional(),
    buyedCourse: z.string().min(1, "Buyed Course is required"),
})

export default studentSchema;