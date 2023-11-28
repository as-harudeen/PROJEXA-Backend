import { Module } from '@nestjs/common';
import { TeamProjectController } from './team-project.controller';
import { TeamProjectService } from './team-project.service';
import { PrismaModule } from 'src/modules/prisma/prisma.module';
import { TeamTaskDistributionModule } from './modules/team-task-distribution/team-task-distribution.module';
import { TeamTaskModule } from './modules/team-task/team-task.module';

@Module({
  imports: [
    PrismaModule,
    TeamTaskDistributionModule,
    TeamTaskModule
  ],
  controllers: [TeamProjectController],
  providers: [TeamProjectService],
})
export class TeamProjectModule {}
