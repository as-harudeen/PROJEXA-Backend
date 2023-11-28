import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { TeamTaskCommentService } from './team-task-comment.service';
import { Request } from 'express';
import { UserAuthGuard } from 'src/modules/auth/guards/user-auth.guard';
import { UserPayloadInterface } from 'src/modules/auth/interface';

@Controller('team-task/:task_id/comment')
export class TeamTaskCommentController {
  constructor(
    private readonly teamTaskCommentService: TeamTaskCommentService,
  ) {}

  @Post()
  @UseGuards(UserAuthGuard)
  async createTeamTaskComment(
    @Req() request: Request,
    @Param('task_id') task_id: string,
    @Body('comment_text') task_comment_text: string,
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.teamTaskCommentService.createTeamTaskComment({
      user_id,
      task_id,
      task_comment_text,
    });
  }
}
