import { z } from "zod";

export const registerSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters"),
    email: z
        .string()
        .email("Invalid email"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
    password_confirmation: z
        .string()
})
    .refine(
        (data) => data.password === data.password_confirmation,
        {
            message: "Passwords do not match",
            path: ["password_confirmation"]
        }
    );

export const loginSchema = z.object({
    email: z
        .string()
        .email("Invalid email"),
    password: z
        .string()
        .min(1, "Password is required")
});