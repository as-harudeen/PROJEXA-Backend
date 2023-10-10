import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { GetProjectsQueryInterface } from '../prisma/interface';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class PersonalProjectService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * endpoint:- project/personal/new
   * method:- POST
   * @desc
   * Create new project with project-
   * details and user_id
   *
   * @param createprojectDto - Project details
   * @param user_id - user_id
   * @returns String
   * @throws InternalServerException - if any occure-
   * during create project in database
   */
  async createProject(createprojectDto: CreateProjectDto, user_id: string) {
    try {
      await this.prisma.project.create({
        data: {
          project_name: createprojectDto.project_name,
          project_desc: createprojectDto.project_desc,
          project_start_date: new Date(createprojectDto.project_start_date),
          project_end_date: new Date(createprojectDto.project_end_date),
          user_id,
          project_reference: createprojectDto.project_reference,
          project_type: 'personal',
        },
      });
      return 'Created';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * To Retrieve Personal projects.
   *
   * @param query - Primsa query the logic of retrive project
   * @returns - Array of projects.
   * @throws - InternalServerErrorException -
   *           if error occure when retrieve from
   *           data base.
   */
  async getProjects(query: GetProjectsQueryInterface, p: number) {
    try {
      query.skip = (p - 1) * +process.env.PERSONAL_PROJECT_PAGINATION_LIMIT;
      query.take = +process.env.PERSONAL_PROJECT_PAGINATION_LIMIT;
      console.log('Query ===>', query);
      const projects = await this.prisma.project.findMany(query);
      return projects;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   *Get total count of personal project-
   *based on specific query
   * @param query - Prisma query.
   * @returns Number- document count
   */
  async getProjectsCount(query: GetProjectsQueryInterface): Promise<number> {
    try {
      const count = await this.prisma.project.count(query);
      return count;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * Retrieve one project based on user_id
   * and project_id
   * @param user_id - User ID
   * @param project_id - project ID
   * @returns Project
   */
  async getOneProject(user_id: string, project_id: string) {
    try {
      const project = await this.prisma.project.findUnique({
        where: { project_id, user_id },
        select: {
          project_name: true,
          project_desc: true,
          project_start_date: true,
          project_end_date: true,
          project_status: true,
          project_id: true,
          project_reference: true,
        },
      });
      return project;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async editProject(
    user_id: string,
    project_id: string,
    updateProjectDto: UpdateProjectDto,
  ) {
    try {
      if (updateProjectDto.project_start_date)
        updateProjectDto.project_start_date = new Date(
          updateProjectDto.project_start_date,
        );
      if (updateProjectDto.project_end_date)
        updateProjectDto.project_end_date = new Date(
          updateProjectDto.project_end_date,
        );
      await this.prisma.project.update({
        where: { user_id, project_id },
        data: updateProjectDto,
      });
      return 'Updated successfully';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
