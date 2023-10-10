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
import { QueryService } from '../prisma/query.service';
import { UpdateProjectDto } from './dto/update-project.dto';

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
    console.log(prismaQuery, 'query     ');
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
    console.log(project_id, user_id);
    return this.PersonalProjectService.getOneProject(user_id, project_id);
  }

  @Patch(':project_id')
  @UseGuards(UserAuthGuard)
  async editProject(
    @Req() req: Request,
    @Param('project_id') project_id: string,
    @Body(new ZodValidationPipe(updateProjectSchema))
    updateProjectDto: UpdateProjectDto,
  ) {
    const { user_id } = req.user as UserPayloadInterface;
    return await this.PersonalProjectService.editProject(
      user_id,
      project_id,
      updateProjectDto,
    );
  }
}
