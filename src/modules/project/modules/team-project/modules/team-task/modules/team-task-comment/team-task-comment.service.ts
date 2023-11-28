import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class TeamTaskCommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createTeamTaskComment({
    task_comment_text,
    task_id,
    user_id,
  }: CreateTaskCommentDto) {
    try {
      await this.prisma.teamProjectTask.findUniqueOrThrow({
        where: {
          task_id,
          OR: [
            { assigned_by_user_id: user_id },
            { assigned_to_user_id: user_id },
          ],
          // team_project: {
          //     team_projects: {
          //         team: {
          //             team_id
          //         }
          //     }
          // },
        },
      });

      return await this.prisma.teamProjectTaskComment.create({
        data: {
          task_id,
          task_comment_text,
          commented_by_id: user_id,
        },
        select: {
          commented_by: {
            select: {
              user_name: true,
            },
          },
          task_comment_text: true,
          commented_at: true,
        },
      });
    } catch (err) {
        console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
