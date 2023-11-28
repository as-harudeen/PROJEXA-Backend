import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { GetTaskDto } from './dto/get-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTeamTaskDto } from './dto/update-team-task.dto';
import { DeleteTaskDto } from './dto/delete-task.dto';

@Injectable()
export class TeamTaskService {
  constructor(private readonly prisma: PrismaService) {}

  async getTeamProjectTask({ team_id, project_id, user_id }: GetTaskDto) {
    try {
      const {
        team_projects: { team_projects_id },
      } = await this.prisma.team.findUniqueOrThrow({
        where: {
          team_id,
          OR: [
            { team_admins_id: { has: user_id } },
            { team_members_id: { has: user_id } },
          ],
        },
        select: {
          team_projects: {
            select: {
              team_projects_id: true,
            },
          },
        },
      });

      await this.prisma.teamIndividualProject.findUniqueOrThrow({
        where: {
          team_project_id: project_id,
          team_projects_id,
        },
      });

      return await this.prisma.teamProjectTask.findMany({
        where: {
          team_project_id: project_id,
          assigned_to_user_id: user_id,
        },
        select: {
          task_id: true,
          task_title: true,
          task_desc: true,
          task_priority: true,
          task_status: true,
          task_time_cap: true,
          task_comments: {
            select: {
              commented_at: true,
              task_comment_text: true,
              commented_by: {
                select: {
                  user_name: true,
                },
              },
            },
          },
        },
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateTaskStatus({
    task_id,
    user_id,
    new_task_status,
  }: UpdateTaskStatusDto) {
    try {
      await this.prisma.teamProjectTask.update({
        where: {
          task_id,
          assigned_to_user_id: user_id,
          task_status: { not: new_task_status },
        },
        data: {
          task_status: new_task_status,
        },
      });

      return 'Task status updated successfully';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateTeamTask({
    task_id,
    team_lead_id,
    updated_task_details,
  }: UpdateTeamTaskDto) {
    try {
      await this.prisma.teamProjectTask.update({
        where: {
          task_id,
          team_project: {
            team_projects: {
              team_lead_id,
            },
          },
        },
        data: updated_task_details,
      });

      return 'Task updated successfully';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteTeamTask({ team_lead_id, task_id }: DeleteTaskDto) {
    try {
      await this.prisma.teamProjectTaskComment.deleteMany({
        where: {
          task_id,
          task: {
            assigned_to_user_id: { equals: null },
            team_project: {
              team_projects: {
                team_lead_id,
              },
            },
          },
        },
      });
      await this.prisma.teamProjectTask.delete({
        where: {
          task_id,
        },
      });

      return 'Task deleted successfully';
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
