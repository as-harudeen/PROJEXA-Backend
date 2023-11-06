import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TeamTaskDistributionStageService } from './team-task-distribution-stage.service';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { Request } from 'express';
import { UserPayloadInterface } from '../auth/interface';
import { CreateTaskDistributionStageParamDto } from './dto/create-task-distribution-stage.dto';
import { GetTaskDistributionStagesParamDto } from './dto/get-task-distribution-stages.dto';

@Controller('team/:team_id/project/:team_project_id/task-distribution/stage')
export class TeamTaskDistributionStageController {
  constructor(
    private readonly teamTaskDistributionStage: TeamTaskDistributionStageService,
  ) {}

  @Post('')
  @UseGuards(UserAuthGuard)
  async createNewStage(
    @Req() request: Request,
    @Param() param: CreateTaskDistributionStageParamDto,
    @Body('task_distribution_board_stage_title')
    task_distribution_board_stage_title: string,
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.teamTaskDistributionStage.createNewStage({
      ...param,
      team_lead_id: user_id,
      task_distribution_board_stage_title,
    });
  }

  @Get('')
  @UseGuards(UserAuthGuard)
  async getTaskDistributionStages(
    @Req() request: Request,
    @Param() param: GetTaskDistributionStagesParamDto,
  ) {
    const { user_id: team_lead_id } = request.user as UserPayloadInterface;
    return this.teamTaskDistributionStage.getTaskDistributionStages({
      ...param,
      team_lead_id,
    });
  }
}
