import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TeamProjectService } from './team-project.service';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { CreateTeamProjectDto } from './dto/create-team-project.dto';
import { Request, query } from 'express';
import { TransformTeamProjectInterceptor } from './interceptor/transform-team-project.interceptor';
import { UserAuthGuard } from 'src/modules/auth/guards/user-auth.guard';
import {
  projectSchema,
  updateProjectSchema,
} from '../personal-project/schema/zod.schema';
import { UserPayloadInterface } from 'src/modules/auth/interface';
import { PaginationQueryTransformPipe } from 'src/pipes/pagination-query-transform.pipe';
import { GetTeamProjectsQueryDto } from './dto/get-team-projects.dto';
import { UpdatedProjectDetails } from '../dto/update-project.dto';
import { ProjectStatus } from '@prisma/client';

@Controller('team/projects')
export class TeamProjectController {
  constructor(private readonly teamProjectService: TeamProjectService) {}

  @Post(':team_id/new')
  @UseGuards(UserAuthGuard)
  async createTeamProject(
    @Req() request: Request,
    @Param('team_id') team_id: string,
    @Body(new ZodValidationPipe(projectSchema))
    createTeamProjectDto: CreateTeamProjectDto,
  ) {
    const { user_id: team_lead_id } = request.user as UserPayloadInterface;
    this.teamProjectService.createTeamProject({
      ...createTeamProjectDto,
      team_id,
      team_lead_id,
    });
  }

  @Get(':team_id')
  @UseGuards(UserAuthGuard)
  async getTeamProjects(
    @Req() request: Request,
    @Param('team_id') team_id: string,
    @Query(
      new PaginationQueryTransformPipe(
        +process.env.MAX_TEAM_PROJECT_PAGINATION_LIMIT,
      ),
    )
    query: GetTeamProjectsQueryDto,
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.teamProjectService.getTeamProjects({
      user_id,
      team_id,
      ...query,
    });
  }

  @Get('project/:project_id')
  @UseGuards(UserAuthGuard)
  @UseInterceptors(TransformTeamProjectInterceptor)
  async getOneTeamProject(
    @Req() request: Request,
    @Param('project_id') project_id: string,
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.teamProjectService.getOnePorjectDetails({
      user_id,
      project_id,
    });
  }

  @Patch('project/:project_id')
  @UseGuards(UserAuthGuard)
  async editProject(
    @Req() req: Request,
    @Param('project_id') project_id: string,
    @Body(new ZodValidationPipe(updateProjectSchema))
    updated_project_details: UpdatedProjectDetails,
  ) {
    const { user_id } = req.user as UserPayloadInterface;
    return await this.teamProjectService.editProject({
      project_id,
      updated_project_details,
      user_id,
    });
  }

  @Patch('project/:project_id/status')
  @UseGuards(UserAuthGuard)
  async updateTeamProjectStatus(
    @Req() request: Request,
    @Param('project_id') project_id: string,
    @Body('new_project_status') new_status: ProjectStatus,
  ) {
    const { user_id: team_lead_id } = request.user as UserPayloadInterface;
    console.log(new_status);
    return this.teamProjectService.updateTeamProjectStatus({
      project_id,
      team_lead_id,
      new_status,
    });
  }
}
