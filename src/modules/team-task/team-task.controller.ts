import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TeamTaskService } from './team-task.service';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { Request } from 'express';
import { UserPayloadInterface } from '../auth/interface';
import { GetTaskParamDto } from './dto/get-task.dto';
import { TransformGetTaskInterceptor } from './interceptor/transform-get-task.interceptor';
import { UpdateTaskStatusParamDto } from './dto/update-task-status.dto';
import { TeamTaskStatus } from '@prisma/client';
import { ValidateUpdateTaskPipe } from './pipe/validate-update-task.pipe';
import {
  UpdateTeamTaskBodyDto,
  UpdateTeamTaskParamDto,
} from './dto/update-team-task.dto';

@Controller('team/:team_id/project/:project_id/task')
export class TeamTaskController {
  constructor(private readonly teamTaskService: TeamTaskService) {}

  @Get()
  @UseGuards(UserAuthGuard)
  @UseInterceptors(TransformGetTaskInterceptor)
  async getTeamProjectTask(
    @Req() request: Request,
    @Param() param: GetTaskParamDto,
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.teamTaskService.getTeamProjectTask({
      ...param,
      user_id,
    });
  }

  @Patch(':task_id/status')
  @UseGuards(UserAuthGuard)
  async updateTaskStatus(
    @Req() request: Request,
    @Param() param: UpdateTaskStatusParamDto,
    @Body('new_task_status') new_task_status: TeamTaskStatus,
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.teamTaskService.updateTaskStatus({
      ...param,
      user_id,
      new_task_status,
    });
  }

  @Patch(':task_id')
  @UseGuards(UserAuthGuard)
  async updateTeamTask(
    @Req() request: Request,
    @Param() param: UpdateTeamTaskParamDto,
    @Body(new ValidateUpdateTaskPipe())
    updated_task_details: UpdateTeamTaskBodyDto,
  ) {
    const { user_id: team_lead_id } = request.user as UserPayloadInterface;
    return this.teamTaskService.updateTeamTask({
      ...param,
      team_lead_id,
      updated_task_details,
    });
  }
}