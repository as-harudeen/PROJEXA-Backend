import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStageInterface } from './interface/create-stage.interface';
import { GetProjectStagesInterface } from './interface/get-stage.interface';

@Injectable()
export class ProjectStageService {
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
      await this.prisma.project.findFirstOrThrow({
        where: { user_id, project_id },
      });
      await this.prisma.stage.create({
        data: {
          stage_title,
          project_id,
        },
      });
      return 'Stage create successfully';
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
      await this.prisma.project.findFirstOrThrow({
        where: {user_id, project_id},
        select: {user_id: true}
      })
      const stages = await this.prisma.stage.findMany({
        where: { project_id },
        select: {tasks: true, stage_id: true, stage_title: true}
      });

      return stages;
    } catch (err) {
        throw new InternalServerErrorException(err.message);
    }
  }
}
