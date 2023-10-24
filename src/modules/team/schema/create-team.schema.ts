import { z } from "zod";


export const teamSchema = z.object({
    team_name: z.string().trim().min(4),
    team_desc: z.string().trim().min(10)
})