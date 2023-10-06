

import { z } from "zod";


export const projectSchema = z.object({
    projectName: z.string().trim().min(3),
    description: z.string().trim().min(10),
    startDate: z.string(),
    endDate: z.string(),
    projectReferences: z.array(z.object({
        title: z.string().trim().min(1),
        link: z.string().url()
    }))
}).refine(data => new Date(data.startDate) < new Date(data.endDate), {
    message: "End date can't be less than start date",
})