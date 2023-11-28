import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TeamTaskDistributionService } from './team-task-distribution.service';
import { Request } from 'express';
import { CreateTeamTaskDistributionStageTaskBody } from './dto/create-team-task.dto';
import { GetUsersTasksParamDto } from './dto/get-users-tasks.dto';
import { TransformGetUsersTasksInterceptor } from './interceptor/transform-get-users-tasks.interceptor';
import { ChangeTaskStageParamDto } from './dto/change-task-stage.dto';
import { RelocateTeamTaskParamDto } from './dto/relocate-team-task.dto';
import { RepositionTaskParamDto } from './dto/reposition-task.dto';
import { UserPayloadInterface } from 'src/modules/auth/interface';
import { UserAuthGuard } from 'src/modules/auth/guards/user-auth.guard';

@Controller('team/task-distribution')
export class TeamTaskDistributionController {
  constructor(
    private readonly teamTaskDistributionService: TeamTaskDistributionService,
  ) {}
// team/:team_id/project/:project_id/task-distribution
  @Post(':project_id/stage') //project_id
  @UseGuards(UserAuthGuard)
  async createNewStage(
    @Req() request: Request,
    @Param('project_id') project_id: string,
    @Body('task_distribution_board_stage_title')
    task_distribution_board_stage_title: string,
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.teamTaskDistributionService.createNewStage({
      project_id,
      team_lead_id: user_id,
      task_distribution_board_stage_title,
    });
  }

  @Get(':project_id/stage') //project_id
  @UseGuards(UserAuthGuard)
  async getTaskDistributionStages(
    @Req() request: Request,
    @Param('project_id') project_id: string,
  ) {
    console.log('from get task distribution stage');
    const { user_id: team_lead_id } = request.user as UserPayloadInterface;
    return this.teamTaskDistributionService.getTaskDistributionStages({
      team_lead_id,
      project_id,
    });
  }

  @Post('stage/:stage_id/task') //stage_id
  @UseGuards(UserAuthGuard)
  async createTask(
    @Req() request: Request,
    @Param('stage_id') stage_id: string,
    @Body() taskDetails: CreateTeamTaskDistributionStageTaskBody,
  ) {
    const { user_id: team_lead_id } = request.user as UserPayloadInterface;
    return this.teamTaskDistributionService.createTask({
      stage_id,
      ...taskDetails,
      team_lead_id,
    });
  }

  @Get('team/:team_id/users/tasks') //project_id //team_id
  @UseGuards(UserAuthGuard)
  @UseInterceptors(TransformGetUsersTasksInterceptor)
  async getUsersTasks(
    @Req() request: Request,
    @Param() param: GetUsersTasksParamDto,
  ) {

    const { user_id: team_lead_id } = request.user as UserPayloadInterface;
    return this.teamTaskDistributionService.getUsersTasks({
      ...param,
      team_lead_id,
    });
  }

  @Patch('task/:task_id/assign') //task_id
  @UseGuards(UserAuthGuard)
  async assignTask(
    @Req() request: Request,
    @Param('task_id') task_id: string ,
    @Body('user_id') user_id: string,
  ) {
    const { user_id: team_lead_id } = request.user as UserPayloadInterface;
    return this.teamTaskDistributionService.assignTask({
      task_id,
      user_id,
      team_lead_id,
    });
  }

  @Patch('change/stage/:stage_id/task/:task_id') //stage_id //task_id
  @UseGuards(UserAuthGuard)
  async changeTaskStage(
    @Req() request: Request,
    @Param() param: ChangeTaskStageParamDto,
    @Body('new_stage_id') new_stage_id: string,
  ) {
    const { user_id: team_lead_id } = request.user as UserPayloadInterface;
    return this.teamTaskDistributionService.changeTaskStage({
      ...param,
      new_stage_id,
      team_lead_id,
    });
  }

  @Patch('user/:user_id/relocate/task/:task_id')//user_id //task_id
  @UseGuards(UserAuthGuard)
  async relocateTask(
    @Req() request: Request,
    @Param() param: RelocateTeamTaskParamDto,
    @Body('stage_id') stage_id: string,
  ) {
    const { user_id: team_lead_id } = request.user as UserPayloadInterface;
    return this.teamTaskDistributionService.relocateTask({
      ...param,
      stage_id,
      team_lead_id,
    });
  }

  @Patch('reposition/task/:task_id/user/:user_id')//task_id user_id
  @UseGuards(UserAuthGuard)
  async repositionTask(
    @Req() request: Request,
    @Param() param: RepositionTaskParamDto,
    @Body('new_user_id') new_user_id: string,
  ) {
    const { user_id: team_lead_id } = request.user as UserPayloadInterface;
    return this.teamTaskDistributionService.repositionTask({
      ...param,
      new_user_id,
      team_lead_id,
    });
  }

  @Delete('stage/:stage_id') //stage_id
  @UseGuards(UserAuthGuard)
  async deleteStage(
    @Req() request: Request,
    @Param('stage_id') stage_id: string,
  ) {
    const { user_id: team_lead_id } = request.user as UserPayloadInterface;
    return this.teamTaskDistributionService.deleteStage({
      team_lead_id,
      stage_id,
    });
  }
}
