import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { CreateTeamTaskDistributionStageTask } from './dto/create-team-task.dto';
import { GetUsersTasksDto } from './dto/get-users-tasks.dto';
import { AssignTeamTaskDto } from './dto/assign-team-task.dto';
import { ChangeTaskStageDto } from './dto/change-task-stage.dto';
import { RelocateTeamTaskDto } from './dto/relocate-team-task.dto';
import { RepositionTaskDto } from './dto/reposition-task.dto';
import { CreateTaskDistributionStageDto } from './dto/create-task-distribution-stage.dto';
import { GetTaskDistributionStagesDto } from './dto/get-task-distribution-stages.dto';
import { DeleteStageDto } from './dto/delete-stage.dto';

@Injectable()
export class TeamTaskDistributionService {
  constructor(private readonly prisma: PrismaService) {}

  async createNewStage({
    project_id,
    task_distribution_board_stage_title,
    team_lead_id,
  }: CreateTaskDistributionStageDto) {
    try {
      const {
        task_distribution_board: { board_id },
      } = await this.prisma.teamIndividualProject.findUniqueOrThrow({
        where: {
          team_project_id: project_id,
          team_projects: {
            team_lead_id,
          },
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
    project_id: team_project_id,
    team_lead_id,
  }: GetTaskDistributionStagesDto) {
    try {
      const { task_distribution_stages } =
        await this.prisma.taskDistributionBoard.findUniqueOrThrow({
          where: {
            project_id: team_project_id,
            team_project: {
              team_projects: {
                team_lead_id,
              },
            },
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
                    task_time_cap: true,
                    task_status: true,
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

  async createTask({
    team_lead_id,
    stage_id,
    task_priority,
    task_title,
    task_time_cap,
  }: CreateTeamTaskDistributionStageTask) {
    try {
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }

    const {
      task_distribution_board: { project_id },
    } = await this.prisma.taskDistributionBoardStage.findUniqueOrThrow({
      where: {
        task_distribution_board_stage_id: stage_id,
        task_distribution_board: {
          team_project: {
            team_projects: {
              team_lead_id,
            },
          },
        },
      },
      select: {
        task_distribution_board: {
          select: {
            project_id: true,
          },
        },
      },
    });

    console.log('Creating team project task');
    return await this.prisma.teamProjectTask.create({
      data: {
        task_priority: +task_priority,
        task_title,
        team_project_id: project_id,
        task_distribution_board_stage_id: stage_id,
        task_time_cap: +task_time_cap,
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

  async assignTask({ team_lead_id, task_id, user_id }: AssignTeamTaskDto) {
    try {
      await this.prisma.teamProjectTask.update({
        where: {
          task_id,
          team_project: {
            team_projects: {
              team: {
                team_lead_id,
                OR: [
                  { team_admins_id: { has: user_id } },
                  { team_members_id: { has: user_id } },
                ],
              },
            },
          },
        },
        data: {
          assigned_by_user_id: team_lead_id,
          assigned_to_user_id: user_id,
          assigned_at: new Date(),
          task_distribution_board_stage_id: null,
        },
      });

      return 'Task Assigned successfully';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async changeTaskStage({
    team_lead_id,
    task_id,
    stage_id,
    new_stage_id,
  }: ChangeTaskStageDto) {
    try {
      const { task_distribution_board_id } =
        await this.prisma.taskDistributionBoardStage.findUniqueOrThrow({
          where: {
            task_distribution_board_stage_id: new_stage_id,
            task_distribution_board: {
              team: {
                team_lead_id,
              },
            },
          },
          select: {
            task_distribution_board_id: true,
          },
        });

      await this.prisma.teamProjectTask.update({
        where: {
          task_id,
          task_distribution_board_stage_id: stage_id,
          task_distribution_board_stage: {
            task_distribution_board_id,
          },
        },
        data: {
          task_distribution_board_stage_id: new_stage_id,
        },
      });

      return 'Task stage changed successfully';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async relocateTask({
    task_id,
    user_id,
    team_lead_id,
    stage_id,
  }: RelocateTeamTaskDto) {
    try {
      await this.prisma.teamProjectTask.update({
        where: {
          task_id,
          assigned_to_user_id: user_id,
          task_status: 'todo',
          team_project: {
            team_projects: {
              team_lead_id,
            },
            task_distribution_board: {
              task_distribution_stages: {
                some: { task_distribution_board_stage_id: stage_id },
              },
            },
          },
        },
        data: {
          assigned_by_user_id: null,
          assigned_to_user_id: null,
          assigned_at: null,
          task_distribution_board_stage_id: stage_id,
        },
      });

      return 'Task relocate successfully';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async repositionTask({
    team_lead_id,
    task_id,
    user_id,
    new_user_id,
  }: RepositionTaskDto) {
    try {
      await this.prisma.teamProjectTask.update({
        where: {
          task_id,
          assigned_to_user_id: user_id,
          task_status: 'todo',
          team_project: {
            team_projects: {
              team: {
                team_lead_id,
                OR: [
                  { team_admins_id: { has: new_user_id } },
                  { team_members_id: { has: new_user_id } },
                ],
              },
            },
          },
        },
        data: {
          assigned_to_user_id: new_user_id,
          assigned_at: new Date(),
        },
      });

      return 'Task reposition successfully';
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteStage({ team_lead_id, stage_id }: DeleteStageDto) {
    try {
      await this.prisma.teamProjectTaskComment.deleteMany({
        where: {
          task: {
            task_distribution_board_stage_id: stage_id,
            task_distribution_board_stage: {
              task_distribution_board: {
                team: {
                  team_lead_id,
                },
              },
            },
          },
        },
      });

      await this.prisma.teamProjectTask.deleteMany({
        where: {
          task_distribution_board_stage_id: stage_id,
        },
      });

      await this.prisma.taskDistributionBoardStage.delete({
        where: {
          task_distribution_board_stage_id: stage_id,
        },
      });

      return 'Stage deleted successfully';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
