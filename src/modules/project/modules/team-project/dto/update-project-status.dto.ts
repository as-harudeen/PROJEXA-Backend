import { ProjectStatus } from "@prisma/client";

export class UpdateProjectStatusDto {
    project_id: string;
    team_lead_id: string;
    new_status: ProjectStatus;
}