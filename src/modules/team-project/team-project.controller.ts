import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TeamProjectService } from './team-project.service';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { projectSchema } from '../personal-project/schema/zod.schema';
import { CreateTeamProjectDto } from './dto/create-team-project.dto';
import { Request } from 'express';
import { UserPayloadInterface } from '../auth/interface';
import { GetOneTeamProjectDetailsParamDto } from './dto/get-one-project-details.dto';

@Controller('team/:team_id/projects')
export class TeamProjectController {
  constructor(private readonly teamProjectService: TeamProjectService) {}

  @Post('new')
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

  @Get()
  @UseGuards(UserAuthGuard)
  async getTeamProjects(
    @Req() request: Request,
    @Param('team_id') team_id: string,
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.teamProjectService.getTeamProjects({ user_id, team_id });
  }

  @Get(':project_id')
  @UseGuards(UserAuthGuard)
  async getOneTeamProject(
    @Req() request: Request,
    @Param() param: GetOneTeamProjectDetailsParamDto,
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.teamProjectService.getOnePorjectDetails({
      user_id,
      ...param,
    });
  }
}
