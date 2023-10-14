import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { UserAuthGuard } from 'src/modules/auth/guards/user-auth.guard';
import { Request } from 'express';
import { UserPayloadInterface } from 'src/modules/auth/interface';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { taskSchema } from './schema/create-task.zod.schema';
import { CreateTaskBodyDto, CreateTaskParamDto } from './dto/create-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post(':project_id/:stage_id')
  @UseGuards(UserAuthGuard)
  async createTask(
    @Req() request: Request,
    @Param() params: CreateTaskParamDto,
    @Body(new ZodValidationPipe(taskSchema)) {task_title}: CreateTaskBodyDto,
  ) {
    const newTaskDetails = {
      user_id: (request.user as UserPayloadInterface).user_id,
      ...params,
      task_title: task_title,
    };
    return this.taskService.createTask(newTaskDetails);
  }


}
