import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../../../prisma/prisma.module';
import { TeamTaskController } from './team-task.controller';
import { TeamTaskService } from './team-task.service';
import { TeamTaskCommentModule } from './modules/team-task-comment/team-task-comment.module';

@Module({
  imports: [PrismaModule, TeamTaskCommentModule],
  controllers: [TeamTaskController],
  providers: [TeamTaskService],
})
export class TeamTaskModule {}
