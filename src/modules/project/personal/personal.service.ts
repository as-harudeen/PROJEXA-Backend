import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { GetProjectQueryInterface } from '../../prisma/interface';

@Injectable()
export class PersonalService {
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
          project_name: createprojectDto.projectName,
          project_desc: createprojectDto.description,
          project_start_date: new Date(createprojectDto.startDate),
          project_end_date: new Date(createprojectDto.endDate),
          user_id,
          project_reference: createprojectDto.projectReferences,
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
  async getProject(query: GetProjectQueryInterface, p: number) {
    try {
      query.skip = (p - 1) * +process.env.PERSONAL_PROJECT_PAGINATION_LIMIT;
      query.take = +process.env.PERSONAL_PROJECT_PAGINATION_LIMIT;
      const projects = await this.prisma.project.findMany(query);
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
  async getProjectCount(query: GetProjectQueryInterface): Promise<number> {
    try {
      const count = await this.prisma.project.count(query);
      return count;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
