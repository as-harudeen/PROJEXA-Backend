

import { z } from "zod";


export const projectSchema = z.object({
    project_name: z.string().trim().min(3),
    project_desc: z.string().trim().min(10),
    project_start_date: z.string(),
    project_end_date: z.string(),
    project_reference: z.array(z.object({
        title: z.string().trim().min(1),
        link: z.string().url()
    }))
}).refine(data => new Date(data.project_start_date) < new Date(data.project_end_date), {
    message: "End date can't be less than start date",
})

export const updateProjectSchema = z.object({
    project_name: z.string().trim().min(3).optional(),
    project_desc: z.string().trim().min(3).optional(),
    project_start_date: z.string().trim().optional(),
    project_end_date: z.string().trim().optional(),
    project_reference: z.object({
        title: z.string(),
        link: z.string().url()
    }).array().optional()
})