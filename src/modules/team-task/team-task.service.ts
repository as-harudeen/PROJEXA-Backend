import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetTaskDto } from './dto/get-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTeamTaskDto } from './dto/update-team-task.dto';

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
        },
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateTaskStatus({
    team_id,
    project_id,
    task_id,
    user_id,
    new_task_status,
  }: UpdateTaskStatusDto) {
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

      await this.prisma.teamProjectTask.update({
        where: {
          task_id,
          assigned_to_user_id: user_id,
          team_project_id: project_id,
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

}
