import { TeamTaskStatus } from '@prisma/client';


export interface UpdateTaskStatusDto  {
  task_id: string;
  user_id: string;
  new_task_status: TeamTaskStatus;
}
