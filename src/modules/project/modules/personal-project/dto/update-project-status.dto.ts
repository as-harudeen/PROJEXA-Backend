import { ProjectStatus } from '@prisma/client';

export class UpdateProjectStatusDto {
  owner_id: string;
  project_id: string;
  new_project_status: ProjectStatus;
}
