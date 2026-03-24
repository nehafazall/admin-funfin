import { z } from "zod";

// userSchema kept for legacy compatibility — use adminSchema for new code
const userSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin", "mentor", "counsilor"]),
    isActive: z.boolean().default(true),
})

export default userSchema;