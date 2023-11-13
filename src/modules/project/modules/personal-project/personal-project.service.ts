import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { GetProjectsQueryInterface } from '../../../prisma/interface';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';

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
  async createProject(createprojectDto: CreateProjectDto, owner_id: string) {
    try {
      await this.prisma.personalProject.create({
        data: {
          project_name: createprojectDto.project_name,
          project_desc: createprojectDto.project_desc,
          project_start_date: new Date(createprojectDto.project_start_date),
          project_end_date: new Date(createprojectDto.project_end_date),
          owner_id,
          project_reference: createprojectDto.project_reference,
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

      const projects = await this.prisma.personalProject.findMany(query);
      return projects;
    } catch (err) {
      console.log(err);
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
      const count = await this.prisma.personalProject.count(query);
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
  async getOneProject(owner_id: string, personal_project_id: string) {
    try {
      const personal_projects = await this.prisma.personalProject.findUnique({
        where: { personal_project_id, owner_id },
        select: {
          project_name: true,
          project_start_date: true,
          project_end_date: true,
          project_status: true,
          personal_project_id: true,
          project_desc: true,
          project_reference: true,
        },
      });
      return personal_projects;
    } catch (err) {
      console.log(err);
      console.log(owner_id, personal_project_id);
      throw new InternalServerErrorException(err.message);
    }
  }

  async editProject(
    owner_id: string,
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

      await this.prisma.personalProject.update({
        where: {
          personal_project_id: project_id,
          owner_id,
        },
        data: updateProjectDto,
      });
      return 'Updated successfully';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async updateProjectStatus({
    owner_id,
    project_id,
    new_project_status,
  }: UpdateProjectStatusDto) {
    try {
      await this.prisma.personalProject.update({
        where: {
          personal_project_id: project_id,
          owner_id,
        },
        data: {
          project_status: new_project_status,
        },
      });

      return 'Project status updated';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
