import { Module } from '@nestjs/common';
import { ProjectStageController } from './project-stage.controller';
import { ProjectStageService } from './project-stage.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TaskModule } from 'src/modules/task/task.module';

@Module({
  imports: [PrismaModule, TaskModule],
  controllers: [ProjectStageController],
  providers: [ProjectStageService]
})
export class ProjectStageModule {}
