import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TeamTaskController } from './team-task.controller';
import { TeamTaskService } from './team-task.service';

@Module({
  imports: [PrismaModule],
  controllers: [TeamTaskController],
  providers: [TeamTaskService],
})
export class TeamTaskModule {}
