import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

/**
 * Create a new task with the provided task details.
 *
 * @param {CreateTaskInterface} taskDetails - The object containing the task details:
 * - user_id: string - Identifies the user creating the task.
 * - stage_id: string - Identifies the stage to which the task belongs.
 * - task_title: string - The title of the task.
 *
 * @returns {string} - Returns 'Task added successfully' upon successful task creation.
 *
 * @throws {InternalServerErrorException} - If an error occurs during database operations.
 */
  async createTask({ user_id, stage_id, task_title }: CreateTaskDto) {
    try {
      await this.prisma.stage.findFirstOrThrow({
        where: { owner: user_id, stage_id },
      });

      const position = await this.prisma.task.count({ where: { stage_id } });

      await this.prisma.task.create({
        data: {
          stage_id,
          task_title,
          position: position,
        },
      });
      return 'Task added successfully';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }


}
