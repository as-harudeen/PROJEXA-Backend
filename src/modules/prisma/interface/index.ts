import { ProjectStatus } from "@prisma/client"


/**
 * GET PROJECT QUERY INTERFACE.
 */
export interface GetProjectsQueryInterface {
    where: {
        owner_id: string,
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