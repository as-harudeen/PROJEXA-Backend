import { ProjectStatus, ProjectType } from "@prisma/client"


/**
 * GET PROJECT QUERY INTERFACE.
 */
export interface GetProjectQueryInterface {
    where: {
        user_id: string,
        project_type: keyof typeof ProjectType,
        project_name?: {
            contains: string
        },
        project_status?: {
            in: ProjectStatus[]
        }
    },
    take?: number;
    skip?: number;
}