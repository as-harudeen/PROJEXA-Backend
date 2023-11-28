import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { TeamTaskStatus } from '@prisma/client';
import { map } from 'rxjs';

interface TaskInterface {
  task_id: string;
  task_title: string;
  task_desc: string;
  task_priority: number;
  task_status: TeamTaskStatus;
}

export class TransformGetTaskInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler<TaskInterface[]>) {
    return next.handle().pipe(
      map((tasks) => {
        const response = {
          todo_tasks: [] as TaskInterface[],
          doing_tasks: [] as TaskInterface[],
          done_tasks: [] as TaskInterface[],
        };

        tasks.forEach(task => {
            if(task.task_status === 'todo') {
                response.todo_tasks.push(task);
            } else if (task.task_status === "doing") {
                response.doing_tasks.push(task);
            } else {
                response.done_tasks.push(task);
            }
        })

        return response;
      }),
    );
  }
}
