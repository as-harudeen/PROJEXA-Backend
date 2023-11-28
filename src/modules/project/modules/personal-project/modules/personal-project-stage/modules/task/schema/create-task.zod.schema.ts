import { z } from "zod";

export const taskSchema = z.object({
    task_title: z.string().min(1)
})