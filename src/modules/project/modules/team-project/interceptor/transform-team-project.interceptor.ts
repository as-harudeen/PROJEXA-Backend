import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import {
  ProjectReference,
  ProjectStatus,
  TeamTaskStatus,
} from '@prisma/client';
import { map } from 'rxjs';

interface TaskDetails {
  task_priority: number;
  task_status: TeamTaskStatus;
  task_title: string;
  task_desc: string;
  task_time_cap: number;
  assigned_to: {
    user_name: string;
    user_profile: string;
  };
}

interface Response {
  team_proejct_id: string;
  project_name: string;
  project_desc: string;
  project_status: ProjectStatus;
  project_start_date: Date;
  project_end_date: Date;
  project_reference: ProjectReference[];
  team_project_tasks: TaskDetails[];
  isCurrentUserLeader: boolean;
}

interface TransformedTaskData {
  [key: `P${number}`]: {
    todo: TaskDetails[];
    doing: TaskDetails[];
    done: TaskDetails[];
  };
}

export class TransformTeamProjectInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler<Response>) {
    return next.handle().pipe(
      map((res) => {
        const { team_project_tasks, ...projectDetails } = res;

        const completedTaskCount = team_project_tasks.reduce((acc, curr) => {
          if (curr.task_status === 'done') acc++;
          return acc;
        }, 0);

        const completedTaskPercentage =
          100 * (completedTaskCount / team_project_tasks.length);

        const transformedTaskData: TransformedTaskData = {};
        team_project_tasks.forEach((task) => {
          const currTaskPriorityKey = `P${task.task_priority}`;
          if (!transformedTaskData[currTaskPriorityKey]) {
            transformedTaskData[currTaskPriorityKey] = {
              todo: [],
              doing: [],
              done: [],
            };
          }
          transformedTaskData[currTaskPriorityKey][task.task_status].push(task);
        });

        console.log('Transformed Task');
        console.log(transformedTaskData);

        return {
          ...projectDetails,
          tasks: transformedTaskData,
          completedTaskPercentage
        };
      }),
    );
  }
}
