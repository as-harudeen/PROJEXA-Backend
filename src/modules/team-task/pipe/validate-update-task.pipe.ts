import {
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { UpdateTeamTaskBodyDto } from '../dto/update-team-task.dto';

export class ValidateUpdateTaskPipe implements PipeTransform {
  transform(body: UpdateTeamTaskBodyDto) {
    if (Object.keys(body).length === 0)
      throw new BadRequestException('Could not find updated task details');

    if (body.task_priority) {
      const numberPriority = +body.task_priority;
      if (isNaN(numberPriority) || numberPriority < 1 || numberPriority > 5) {
        throw new BadRequestException('Invalid task priority');
      }
      body.task_priority = numberPriority;
    }

    if (body.task_title) {
      const trimedTaskTitle = body.task_title.trim();
      if (trimedTaskTitle.length < 3) {
        throw new BadRequestException('Task title should be more than 3 char');
      }
      body.task_title = trimedTaskTitle;
    }

    if (body.task_desc) {
      body.task_desc = body.task_desc.trim();
    }

    return body;
  }
}
