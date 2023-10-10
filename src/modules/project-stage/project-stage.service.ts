import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStageInterface } from './interface/create-stage.interface';

@Injectable()
export class ProjectStageService {
  constructor(private readonly prisma: PrismaService) {}

  async createProjectStage({
    user_id,
    project_id,
    stage_title,
  }: CreateStageInterface) {
    try {
      await this.prisma.project.findFirstOrThrow({
        where: { user_id, project_id },
      });
      await this.prisma.stage.create({
        data: {
          stage_title,
          project_id,
        },
      });
      return 'Stage create successfully';
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
