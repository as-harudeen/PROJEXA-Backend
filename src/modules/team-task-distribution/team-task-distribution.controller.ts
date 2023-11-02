import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TeamTaskDistributionService } from './team-task-distribution.service';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { Request } from 'express';
import {
  CreateTeamTaskDistributionStageTaskBody,
  CreateTeamTaskDistributionStageTaskParam,
} from './dto/create-team-task.dto';
import { UserPayloadInterface } from '../auth/interface';
import { GetUsersTasksParamDto } from './dto/get-users-tasks.dto';
import { TransformGetUsersTasksInterceptor } from './interceptor/transform-get-users-tasks.interceptor';
import { AssignTeamTaskParamDto } from './dto/assign-team-task.dto';
import { ChangeTaskStageParamDto } from './dto/change-task-stage.dto';
import { RelocateTeamTaskParamDto } from './dto/relocate-team-task.dto';
import { RepositionTaskParamDto } from './dto/reposition-task.dto';

@Controller('team/:team_id/project/:project_id/task-distribution')
export class TeamTaskDistributionController {
  constructor(private readonly teamTaskDistributionService: TeamTaskDistributionService) {}

  @Post('stage/:stage_id/task')
  @UseGuards(UserAuthGuard)
  async createTask(
    @Req() request: Request,
    @Param() param: CreateTeamTaskDistributionStageTaskParam,
    @Body() taskDetails: CreateTeamTaskDistributionStageTaskBody,
  ) {
    const { user_id: team_lead_id } = request.user as UserPayloadInterface;
    return this.teamTaskDistributionService.createTask({
      ...param,
      ...taskDetails,
      team_lead_id,
    });
  }
  
}
