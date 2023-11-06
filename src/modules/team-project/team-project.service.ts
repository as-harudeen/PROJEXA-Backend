import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProjectDto } from '../personal-project/dto/create-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamProjectDto } from './dto/create-team-project.dto';
import { GetTeamProjectsDto } from './dto/get-team-projects.dto';
import { GetOneTeamProjectDetailsDto } from './dto/get-one-project-details.dto';

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
            create: {team_id}
          }
        },
      });
      return 'Created';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getTeamProjects({ user_id, team_id }: GetTeamProjectsDto) {
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
                select: {
                  team_project_id: true,
                  project_name: true,
                  project_desc: true,
                  project_status: true,
                  project_start_date: true,
                  project_end_date: true,
                  project_reference: true,
                },
              },
            },
          },
        },
      });

      return team_projects;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getOnePorjectDetails({
    user_id,
    team_id,
    project_id,
  }: GetOneTeamProjectDetailsDto) {
    const {
      team_projects: { team_projects_id },
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
            team_projects_id: true,
          },
        },
      },
    });

    return await this.prisma.teamIndividualProject.findUniqueOrThrow({
      where: {
        team_project_id: project_id,
        team_projects_id,
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
    });
  }
}
