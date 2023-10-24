import { z } from "zod";


export const registerUserSchema = z.object({
    user_name: z.string().min(4),
    user_full_name: z.string().min(4),
    user_email: z.string().email(),
    password: z.string().min(6)
});


export const loginUserSchema = z.object({
    user_email: z.string().email(),
    password: z.string().min(6)
});


export const editUserSchema = z.object({
    user_name: z.string().min(4).optional(),
    summary: z.string().optional()
})