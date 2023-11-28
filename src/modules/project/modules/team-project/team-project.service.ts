import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTeamProjectDto } from './dto/create-team-project.dto';
import { GetTeamProjectsDto } from './dto/get-team-projects.dto';
import { GetOneTeamProjectDetailsDto } from './dto/get-one-project-details.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';

@Injectable()
export class TeamProjectService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create new team project
   *
   * @param createprojectDto - Project details
   * @param user_id - user_id
   * @returns String
   * @throws InternalServerException - if any occure-
   * during create project in database
   */
  async createTeamProject({
    team_id,
    team_lead_id,
    ...projectDetails
  }: CreateTeamProjectDto) {
    try {
      const { team_projects_id } =
        await this.prisma.teamProjectCollection.findUniqueOrThrow({
          where: {
            team_id,
            team_lead_id,
          },
          select: {
            team_projects_id: true,
          },
        });

      await this.prisma.teamIndividualProject.create({
        data: {
          team_projects_id,
          project_name: projectDetails.project_name,
          project_desc: projectDetails.project_desc,
          project_start_date: new Date(projectDetails.project_start_date),
          project_end_date: new Date(projectDetails.project_end_date),
          project_reference: projectDetails.project_reference,
          task_distribution_board: {
            create: { team_id },
          },
        },
      });
      return 'Created';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getTeamProjects({ user_id, team_id, p, l, s }: GetTeamProjectsDto) {
    const skip = l * (p - 1);
    try {
      const {
        team_projects: { team_projects },
      } = await this.prisma.team.findUniqueOrThrow({
        where: {
          team_id,
          OR: [
            {
              team_admins_id: { has: user_id },
            },
            {
              team_members_id: { has: user_id },
            },
          ],
        },
        select: {
          team_projects: {
            select: {
              team_projects: {
                where: {
                  project_name: { contains: s },
                },
                select: {
                  team_project_id: true,
                  project_name: true,
                  project_desc: true,
                  project_status: true,
                  project_start_date: true,
                  project_end_date: true,
                  project_reference: true,
                },
                take: l,
                skip,
              },
            },
          },
        },
      });

      return team_projects;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async getOnePorjectDetails({
    user_id,
    project_id,
  }: GetOneTeamProjectDetailsDto) {

    console.log(user_id, project_id);
    const {
      team_projects: { team_lead_id },
      ...projectDetails
    } = await this.prisma.teamIndividualProject.findUniqueOrThrow({
      where: {
        team_project_id: project_id,
        team_projects: {
          team: {
            OR: [
              {
                team_admins_id: { has: user_id },
              },
              {
                team_members_id: { has: user_id },
              },
            ],
          },
        },
      },
      select: {
        team_project_id: true,
        project_name: true,
        project_desc: true,
        project_status: true,
        project_start_date: true,
        project_end_date: true,
        project_reference: true,
        team_project_tasks: {
          where: {
            assigned_by_user_id: { not: null },
          },
          select: {
            task_priority: true,
            task_status: true,
            task_title: true,
            task_desc: true,
            task_time_cap: true,
            assigned_at: true,
            assigned_to: {
              select: {
                user_name: true,
                user_profile: true,
              },
            },
          },
        },
        team_projects: {
          select: {
            team_lead_id: true,
          },
        },
      },
    });

    return { ...projectDetails, isCurrentUserLeader: user_id === team_lead_id };
  }

  async editProject({
    project_id,
    user_id: admin_id,
    updated_project_details,
  }: UpdateProjectDto) {
    try {
      if (updated_project_details.project_start_date)
        updated_project_details.project_start_date = new Date(
          updated_project_details.project_start_date,
        );
      if (updated_project_details.project_end_date)
        updated_project_details.project_end_date = new Date(
          updated_project_details.project_end_date,
        );

      await this.prisma.teamIndividualProject.update({
        where: {
          team_project_id: project_id,
          team_projects: {
            team: {
              team_admins_id: { has: admin_id },
            },
          },
        },
        data: updated_project_details,
      });

      return updated_project_details;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateTeamProjectStatus({
    new_status,
    project_id,
    team_lead_id,
  }: UpdateProjectStatusDto) {
    try {
      await this.prisma.teamIndividualProject.update({
        where: {
          team_project_id: project_id,
          team_projects: {
            team_lead_id,
          },
        },
        data: {
          project_status: new_status,
        },
      });

      return new_status;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
