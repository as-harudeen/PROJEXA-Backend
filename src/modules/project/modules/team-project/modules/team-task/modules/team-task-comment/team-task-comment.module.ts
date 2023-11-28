import { Module } from '@nestjs/common';
import { TeamTaskCommentController } from './team-task-comment.controller';
import { TeamTaskCommentService } from './team-task-comment.service';
import { PrismaModule } from 'src/modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TeamTaskCommentController],
  providers: [TeamTaskCommentService]
})
export class TeamTaskCommentModule {}
