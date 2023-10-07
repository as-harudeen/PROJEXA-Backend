import {
  Body,
  Controller,
  Get,
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
import { Request, query } from 'express';
import { PersonalService } from './personal.service';
import { UserPayloadInterface } from 'src/modules/auth/interface';

@Controller('/project/personal')
export class PersonalController {
  constructor(private readonly personalService: PersonalService) {}

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

}
