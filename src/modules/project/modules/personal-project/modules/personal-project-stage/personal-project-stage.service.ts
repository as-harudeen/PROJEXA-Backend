import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../../../prisma/prisma.service';
import { CreateStageInterface } from './interface/create-stage.interface';
import { GetProjectStagesInterface } from './interface/get-stage.interface';
import { DeleteStageDto } from './dto/delete-stage.dto';

@Injectable()
export class PersonalProjectStageService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new project stage.
   *
   * This function ensures the creation of a valid project stage by using the user_id and project_id.
   *
   * @param {Object} param0 - An object containing user_id, project_id, and stage_title.
   * @param {string} param0.user_id - The unique identifier of the user creating the stage.
   * @param {string} param0.project_id - The unique identifier of the project where the stage is created.
   * @param {string} param0.stage_title - The title or name of the new stage.
   * @returns {string} A message indicating the success of the stage creation.
   * @throws {InternalServerErrorException} Throws an error if there is an issue during the creation process.
   */
  async createProjectStage({
    user_id,
    project_id,
    stage_title,
  }: CreateStageInterface) {
    try {
      await this.prisma.personalProject.findUniqueOrThrow({
        where: {
          owner_id: user_id,
          personal_project_id: project_id,
        },
      });

      // await this.prisma.project.findFirstOrThrow({
      //   where: { user_id, project_id },
      // });
      return await this.prisma.personalProjectStage.create({
        data: {
          stage_title,
          project_id,
          owner: user_id,
        },
        select: { tasks: true, stage_id: true, stage_title: true },
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * Retrieves project stages and associated tasks by project stage_id.
   * Additionally accepts user_id and project_id to ensure that the project stage's owner is the current user.
   *
   * @param {Object} param0 - An object containing user_id and project_id.
   * @param {string} param0.user_id - The unique identifier of the current user.
   * @param {string} param0.project_id - The unique identifier of the project for which stages and tasks are retrieved.
   * @returns {Promise<Array>} An array of project stages with associated tasks.
   * @throws {InternalServerErrorException} Throws an error if there is an issue during retrieval.
   */
  async getProjectStages({ user_id, project_id }: GetProjectStagesInterface) {
    try {
      const stages = await this.prisma.personalProjectStage.findMany({
        where: { project_id, owner: user_id },
        select: { tasks: true, stage_id: true, stage_title: true },
      });
      return stages.map((stage) => {
        stage.tasks.sort((a, b) => a.position - b.position);
        return stage;
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteStage({ stage_id, user_id }: DeleteStageDto) {
    try {
      const { stage_id: stageId } =
        await this.prisma.personalProjectStage.delete({
          where: {
            user: { user_id },
            stage_id,
          },
          select: { stage_id: true },
        });

      await this.prisma.personalProjectTask.deleteMany({
        where: {
          stage_id: stageId,
        },
      });

      return 'Stage deleted successfully';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
