import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { CreateStageDto } from './dto/create-stage.dto';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { stageSchema } from './schema/create-stage.zod.schema';
import { Request } from 'express';
import { UserPayloadInterface } from '../auth/interface';
import { ProjectStageService } from './project-stage.service';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';

@Controller('project-stage/:project_id')
export class ProjectStageController {

    constructor(private readonly projectStageService: ProjectStageService) {}

    @Post()
    @UseGuards(UserAuthGuard)
    async createStage (@Req() req: Request, @Param('project_id') project_id: string, @Body(new ZodValidationPipe(stageSchema)) createStageDto: CreateStageDto) {
        const { user_id } = req.user as UserPayloadInterface;
        const newStageDetails = {user_id, project_id, stage_title: createStageDto.stage_title};
        return this.projectStageService.createProjectStage(newStageDetails);
    }

    @Get()
    @UseGuards(UserAuthGuard)
    async getProjectStages (@Req() req: Request, @Param('project_id') project_id: string) {
        const { user_id } = req.user as UserPayloadInterface;
        return this.projectStageService.getProjectStages({user_id, project_id});
    }
}
