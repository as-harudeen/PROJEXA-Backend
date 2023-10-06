import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';

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
        },
      });
      return "Created";
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
