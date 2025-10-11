import { z } from "zod";

// Define the schema for your login inputs
export const LoginSchema = z.object({
    // Username/Email: Must be a non-empty string
    emailOrUsername: z
        .string()
        .min(1, { message: "Email or Username is required." }),

    // Password: Must be at least 6 characters (for a simple example)
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long." }),
});

// Infer the TypeScript type from the schema for maximum type safety
export type LoginInput = z.infer<typeof LoginSchema>;