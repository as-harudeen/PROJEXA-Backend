import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamTaskDistributionStageTask } from './dto/create-team-task.dto';
import { GetUsersTasksDto } from './dto/get-users-tasks.dto';
import { AssignTeamTaskDto } from './dto/assign-team-task.dto';
import { ChangeTaskStageDto } from './dto/change-task-stage.dto';
import { RelocateTeamTaskDto } from './dto/relocate-team-task.dto';
import { RepositionTaskDto } from './dto/reposition-task.dto';

@Injectable()
export class TeamTaskDistributionService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask({
    team_lead_id,
    stage_id,
    task_priority,
    task_title,
    team_id,
    project_id,
  }: CreateTeamTaskDistributionStageTask) {
    try {
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }

    const {
      team_projects: { team_projects_id },
    } = await this.prisma.team.findUniqueOrThrow({
      where: {
        team_id,
        team_lead_id,
      },
      select: {
        team_projects: {
          select: {
            team_projects_id: true,
          },
        },
      },
    });

    const {
      task_distribution_board: { board_id },
    } = await this.prisma.teamIndividualProject.findUniqueOrThrow({
      where: {
        team_project_id: project_id,
        team_projects_id,
      },
      select: {
        task_distribution_board: {
          select: {
            board_id: true,
          },
        },
      },
    });

    await this.prisma.taskDistributionBoardStage.findUniqueOrThrow({
      where: {
        task_distribution_board_stage_id: stage_id,
        task_distribution_board_id: board_id,
      },
    });

    console.log('Creating team project task');
    return await this.prisma.teamProjectTask.create({
      data: {
        task_priority: +task_priority,
        task_title,
        team_project_id: project_id,
        task_distribution_board_stage_id: stage_id,
      },
      select: {
        task_id: true,
      },
    });
  }

  async getUsersTasks({ team_lead_id, team_id, project_id }: GetUsersTasksDto) {
    try {
      return await this.prisma.team.findUniqueOrThrow({
        where: {
          team_id,
          team_lead_id,
        },
        select: {
          team_members: {
            select: {
              team_task_assigned_to: {
                where: {
                  team_project_id: project_id,
                },
                select: {
                  task_id: true,
                  task_title: true,
                  task_priority: true,
                  task_status: true,
                  task_desc: true,
                },
              },
              user_name: true,
              user_id: true,
              user_profile: true,
            },
          },
          team_admins: {
            select: {
              team_task_assigned_to: {
                where: {
                  team_project_id: project_id,
                },
                select: {
                  task_id: true,
                  task_title: true,
                  task_priority: true,
                  task_status: true,
                  task_desc: true,
                },
              },
              user_name: true,
              user_id: true,
              user_profile: true,
            },
          },
        },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

}
