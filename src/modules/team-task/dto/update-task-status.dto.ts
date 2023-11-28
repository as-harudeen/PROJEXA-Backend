import { TeamTaskStatus } from '@prisma/client';

export interface UpdateTaskStatusParamDto {
  team_id: string;
  project_id: string;
  task_id: string;
}

export interface UpdateTaskStatusDto extends UpdateTaskStatusParamDto {
  user_id: string;
  new_task_status: TeamTaskStatus;
}
