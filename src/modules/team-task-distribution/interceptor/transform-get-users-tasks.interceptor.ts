import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import { map  } from 'rxjs';

interface UserDetails {
  user_id: string;
  user_name: string;
  user_profile: string;
}

interface TaskDetails {
  task_id: string;
  task_title: string;
  task_priority: string;
  task_status: string;
  task_desc: string;
}

interface UserAndTasks extends UserDetails {
  team_task_assigned_to: TaskDetails[];
}

interface ResponseInterface {
  team_members: UserAndTasks[];
  team_admins: UserAndTasks[];
}

enum TeamRole {
  team_admin= "team_admin",
  team_member="team_member",
}

interface TransformData extends UserDetails {
  role: TeamRole;
  tasks: TaskDetails[];
}

export class TransformGetUsersTasksInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler<ResponseInterface>) {
    return next.handle().pipe(
      map((response) => {

        const data: TransformData[] = [
          ...response.team_admins.map((admin) => {
            return {
              user_id: admin.user_id,
              user_name: admin.user_name,
              user_profile: admin.user_profile,
              tasks: admin.team_task_assigned_to,
              role: TeamRole.team_admin,
            };
          }),
          ...response.team_members.map((member) => {
            return {
              user_id: member.user_id,
              user_name: member.user_name,
              user_profile: member.user_profile,
              tasks: member.team_task_assigned_to,
              role: TeamRole.team_member,
            };
          }),
        ];

        return data;
      }),
    );
  }
}
