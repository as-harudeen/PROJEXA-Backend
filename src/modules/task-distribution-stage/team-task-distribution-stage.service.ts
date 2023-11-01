import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDistributionStageDto } from './dto/create-task-distribution-stage.dto';
import { GetTaskDistributionStagesDto } from './dto/get-task-distribution-stages.dto';

@Injectable()
export class TeamTaskDistributionStageService {
  constructor(private readonly prisma: PrismaService) {}

  async createNewStage({
    team_id,
    team_project_id,
    task_distribution_board_stage_title,
    team_lead_id,
  }: CreateTaskDistributionStageDto) {
    try {
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
          team_projects_id,
          team_project_id,
        },
        select: {
          task_distribution_board: {
            select: {
              board_id: true,
            },
          },
        },
      });

      return await this.prisma.taskDistributionBoardStage.create({
        data: {
          task_distribution_board_stage_title,
          task_distribution_board_id: board_id,
        },
        select: {
          task_distribution_board_stage_id: true,
          task_distribution_board_stage_title: true,
        },
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async getTaskDistributionStages({
    team_id,
    team_project_id,
    team_lead_id,
  }: GetTaskDistributionStagesDto) {
    try {
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
          team_project_id,
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

      const { task_distribution_stages } =
        await this.prisma.taskDistributionBoard.findUniqueOrThrow({
          where: {
            board_id,
          },
          select: {
            task_distribution_stages: {
              select: {
                task_distribution_board_stage_id: true,
                task_distribution_board_stage_title: true,
                tasks: {
                  select: {
                    task_id: true,
                    task_title: true,
                    task_desc: true,
                    task_priority: true,
                  },
                },
              },
            },
          },
        });

      return task_distribution_stages;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
