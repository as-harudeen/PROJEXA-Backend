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
import { ChangeTaskPostionPipe } from './pipe/change-task-position.pipe';
import {
  ChangeTaskPositionBodyDto,
  ChangeTaskPositionParamDto,
} from './dto/change-task-postion.dto';
import { EditTaskBodyDto, EditTaskParamDto } from './dto/edit-task.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post(':project_id/:stage_id')
  @UseGuards(UserAuthGuard)
  async createTask(
    @Req() request: Request,
    @Param() params: CreateTaskParamDto,
    @Body(new ZodValidationPipe(taskSchema)) { task_title }: CreateTaskBodyDto,
  ) {
    const newTaskDetails = {
      user_id: (request.user as UserPayloadInterface).user_id,
      ...params,
      task_title: task_title,
    };
    return this.taskService.createTask(newTaskDetails);
  }

  @Patch(':stage_id/:task_id')
  @UseGuards(UserAuthGuard)
  async changeStage(
    @Req() req: Request,
    @Param() changeStageParam: ChangeTaskPositionParamDto,
    @Body(new ChangeTaskPostionPipe())
    { new_position, new_stage_id }: ChangeTaskPositionBodyDto,
  ) {
    const { user_id } = req.user as UserPayloadInterface;
    return this.taskService.changePosition({
      user_id,
      ...changeStageParam,
      new_stage_id,
      new_position,
    });
  }

  @Patch('edit/:stage_id/:task_id')
  @UseGuards(UserAuthGuard)
  async editTask(
    @Req() request: Request,
    @Param() params: EditTaskParamDto,
    @Body() updatedData: EditTaskBodyDto,
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.taskService.editTask({user_id, ...params, updatedData})
  }
}
