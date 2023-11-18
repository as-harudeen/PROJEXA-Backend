import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TeamTaskService } from './team-task.service';
import { Request } from 'express';
import { GetTaskParamDto } from './dto/get-task.dto';
import { TransformGetTaskInterceptor } from './interceptor/transform-get-task.interceptor';
import { TeamTaskStatus } from '@prisma/client';
import { ValidateUpdateTaskPipe } from './pipe/validate-update-task.pipe';
import { UpdateTeamTaskBodyDto } from './dto/update-team-task.dto';
import { UserPayloadInterface } from 'src/modules/auth/interface';
import { UserAuthGuard } from 'src/modules/auth/guards/user-auth.guard';

@Controller('team')
export class TeamTaskController {
  constructor(private readonly teamTaskService: TeamTaskService) {}

  @Get(':team_id/project/:project_id/task')
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

  @Patch('task/:task_id/status')
  @UseGuards(UserAuthGuard)
  async updateTaskStatus(
    @Req() request: Request,
    @Param('task_id') task_id: string,
    @Body('new_task_status') new_task_status: TeamTaskStatus,
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.teamTaskService.updateTaskStatus({
      task_id,
      user_id,
      new_task_status,
    });
  }

  @Patch('task/:task_id')
  @UseGuards(UserAuthGuard)
  async updateTeamTask(
    @Req() request: Request,
    @Param('task_id') task_id: string,
    @Body(new ValidateUpdateTaskPipe())
    updated_task_details: UpdateTeamTaskBodyDto,
  ) {
    const { user_id: team_lead_id } = request.user as UserPayloadInterface;
    return this.teamTaskService.updateTeamTask({
      task_id,
      team_lead_id,
      updated_task_details,
    });
  }

  @Delete('task/:task_id')
  @UseGuards(UserAuthGuard)
  async deleteTeamTask(
    @Req() request: Request,
    @Param('task_id') task_id: string,
  ) {
    const { user_id: team_lead_id } = request.user as UserPayloadInterface;
    return this.teamTaskService.deleteTeamTask({team_lead_id, task_id});
  }
}
