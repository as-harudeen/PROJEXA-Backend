import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateStageDto } from './dto/create-stage.dto';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { stageSchema } from './schema/create-stage.zod.schema';
import { Request } from 'express';
import { PersonalProjectStageService } from './personal-project-stage.service';
import { UserAuthGuard } from 'src/modules/auth/guards/user-auth.guard';
import { UserPayloadInterface } from 'src/modules/auth/interface';

@Controller('project-stage')
export class PersonalProjectStageController {
  constructor(
    private readonly personalProjectStageService: PersonalProjectStageService,
  ) {}

  @Post(':project_id')
  @UseGuards(UserAuthGuard)
  async createStage(
    @Req() req: Request,
    @Param('project_id') project_id: string,
    @Body(new ZodValidationPipe(stageSchema)) createStageDto: CreateStageDto,
  ) {
    const { user_id } = req.user as UserPayloadInterface;
    const newStageDetails = {
      user_id,
      project_id,
      stage_title: createStageDto.stage_title,
    };
    return this.personalProjectStageService.createProjectStage(newStageDetails);
  }

  @Get(':project_id')
  @UseGuards(UserAuthGuard)
  async getProjectStages(
    @Req() req: Request,
    @Param('project_id') project_id: string,
  ) {
    const { user_id } = req.user as UserPayloadInterface;
    return this.personalProjectStageService.getProjectStages({
      user_id,
      project_id,
    });
  }


  @Delete(':stage_id')
  @UseGuards(UserAuthGuard)
  async deleteStage (
    @Req() request: Request,
    @Param('stage_id') stage_id: string
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.personalProjectStageService.deleteStage({user_id, stage_id})
  }
}
