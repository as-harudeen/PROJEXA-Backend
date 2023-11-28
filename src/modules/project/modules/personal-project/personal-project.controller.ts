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
  UsePipes,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { projectSchema, updateProjectSchema } from './schema/zod.schema';
import { UserAuthGuard } from 'src/modules/auth/guards/user-auth.guard';
import { Request } from 'express';
import { PersonalProjectService } from './personal-project.service';
import { UserPayloadInterface } from 'src/modules/auth/interface';
import { GetProjectQueryPipe } from './pipe/get-project.pipe';
import { QueryService } from '../../../prisma/query.service';
import {
  UpdateProjectDto,
  UpdatedProjectDetails,
} from '../dto/update-project.dto';
import { ProjectStatus } from '@prisma/client';

@Controller('/project/personal')
export class PersonalProjectController {
  constructor(
    private readonly PersonalProjectService: PersonalProjectService,
    private readonly queryService: QueryService,
  ) {}

  @Post('new')
  @UseGuards(UserAuthGuard)
  @UsePipes(new ZodValidationPipe(projectSchema))
  async createProject(
    @Req() request: Request,
    @Body() createprojectDto: CreateProjectDto,
  ) {
    return this.PersonalProjectService.createProject(
      createprojectDto,
      (request.user as UserPayloadInterface).user_id,
    );
  }

  @Get()
  @UseGuards(UserAuthGuard)
  @UsePipes(GetProjectQueryPipe)
  async getProject(@Req() req: Request, @Query() query: any) {
    const { user_id } = req.user as UserPayloadInterface;
    const prismaQuery = this.queryService.getPersonalProjectsQuery(
      user_id,
      query.s || '',
      query.f,
    );
    return this.PersonalProjectService.getProjects(prismaQuery, query.p || 1);
  }

  @Get('count')
  @UseGuards(UserAuthGuard)
  @UsePipes(GetProjectQueryPipe)
  async getProjectCount(@Req() req: Request, @Query() query: any) {
    const { user_id } = req.user as UserPayloadInterface;
    const prismaQuery = this.queryService.getPersonalProjectsQuery(
      user_id,
      query.s || '',
      query.f,
    );
    return this.PersonalProjectService.getProjectsCount(prismaQuery);
  }

  @Get(':project_id')
  @UseGuards(UserAuthGuard)
  async getOneProject(
    @Req() req: Request,
    @Param('project_id') project_id: string,
  ) {
    const { user_id } = req.user as UserPayloadInterface;
    return this.PersonalProjectService.getOneProject(user_id, project_id);
  }

  @Patch(':project_id')
  @UseGuards(UserAuthGuard)
  async editProject(
    @Req() req: Request,
    @Param('project_id') project_id: string,
    @Body(new ZodValidationPipe(updateProjectSchema))
    updated_project_details: UpdatedProjectDetails,
  ) {
    const { user_id } = req.user as UserPayloadInterface;
    return await this.PersonalProjectService.editProject({
      updated_project_details,
      user_id,
      project_id,
    });
  }

  @Patch(':project_id/status')
  @UseGuards(UserAuthGuard)
  async updateProjectStatus(
    @Req() request: Request,
    @Param('project_id') project_id: string,
    @Body('new_project_status') new_project_status: ProjectStatus,
  ) {
    const { user_id: owner_id } = request.user as UserPayloadInterface;
    return this.PersonalProjectService.updateProjectStatus({
      owner_id,
      project_id,
      new_project_status,
    });
  }
}
