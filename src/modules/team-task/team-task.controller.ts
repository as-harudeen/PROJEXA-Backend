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

}
