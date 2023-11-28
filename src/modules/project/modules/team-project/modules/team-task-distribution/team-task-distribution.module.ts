import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../../../prisma/prisma.module';
import { TeamTaskDistributionController } from './team-task-distribution.controller';
import { TeamTaskDistributionService } from './team-task-distribution.service';

@Module({
  imports: [PrismaModule],
  controllers: [TeamTaskDistributionController],
  providers: [TeamTaskDistributionService],
})
export class TeamTaskDistributionModule {}
