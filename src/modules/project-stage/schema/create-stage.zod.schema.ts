import { z } from "zod";

export const stageSchema = z.object({
    stage_title: z.string().trim().min(1)
})