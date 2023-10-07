import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { projectSchema } from './schema/zod.schema';
import { UserAuthGuard } from 'src/modules/auth/guards/user-auth.guard';
import { Request } from 'express';
import { PersonalService } from './personal.service';
import { UserPayloadInterface } from 'src/modules/auth/interface';
import { GetProjectQueryPipe } from './pipe/get-project.pipe';
import { QueryService } from 'src/modules/prisma/query.service';

@Controller('/project/personal')
export class PersonalController {
  constructor(
    private readonly personalService: PersonalService,
    private readonly queryService: QueryService,
  ) {}

  @Post('new')
  @UseGuards(UserAuthGuard)
  @UsePipes(new ZodValidationPipe(projectSchema))
  async createProject(
    @Req() request: Request,
    @Body() createprojectDto: CreateProjectDto,
  ) {
    return this.personalService.createProject(
      createprojectDto,
      (request.user as UserPayloadInterface).user_id,
    );
  }

  @Get()
  @UseGuards(UserAuthGuard)
  @UsePipes(GetProjectQueryPipe)
  async getProject(@Req() req: Request, @Query() query: any) {
    const { user_id } = req.user as UserPayloadInterface;
    const prismaQuery = this.queryService.getPersonalProjectQuery(
      user_id,
      query.s || '',
      query.f,
    );
    return this.personalService.getProject(prismaQuery, query.p || 1);
  }

  @Get('count')
  @UseGuards(UserAuthGuard)
  @UsePipes(GetProjectQueryPipe)
  async getProjectCount(@Req() req: Request, @Query() query: any) {
    const { user_id } = req.user as UserPayloadInterface;
    const prismaQuery = this.queryService.getPersonalProjectQuery(
        user_id,
        query.s || '',
        query.f,
      );
    return this.personalService.getProjectCount(prismaQuery);
  }


}
