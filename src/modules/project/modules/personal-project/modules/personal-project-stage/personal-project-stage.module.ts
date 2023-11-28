import { Module } from '@nestjs/common';
import { PersonalProjectStageController } from './personal-project-stage.controller';
import { PersonalProjectStageService } from './personal-project-stage.service';
import { PrismaModule } from '../../../../../prisma/prisma.module';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [PrismaModule, TaskModule],
  controllers: [PersonalProjectStageController],
  providers: [PersonalProjectStageService],
})
export class ProjectStageModule {}
