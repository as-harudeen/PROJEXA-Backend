import { Module } from '@nestjs/common';
import { TeamTaskDistributionStageController } from './team-task-distribution-stage.controller';
import { TeamTaskDistributionStageService } from './team-task-distribution-stage.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TeamTaskDistributionStageController],
  providers: [TeamTaskDistributionStageService],
})
export class TeamTaskDistributionStageModule {}
