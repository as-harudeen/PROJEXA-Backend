import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { ObjectId } from 'mongodb';
import { CreateTaskDto } from './dto/create-task.dto';
import { EditTaskDto } from './dto/edit-task.dto';
import { DeleteTaskDto } from './dto/delete-task.dto';

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
      await this.prisma.personalProjectStage.findFirstOrThrow({
        where: { owner: user_id, stage_id },
      });

      const position = await this.prisma.personalProjectTask.count({
        where: { stage_id },
      });

      return await this.prisma.personalProjectTask.create({
        data: {
          stage_id,
          task_title,
          position: position,
          task_priority: 5,
        },
        select: {
          task_id: true,
        },
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
 * Update the position of tasks within a stage.
 *
 * @param {string} stage_id - Identifies the stage where tasks are being updated.
 * @param {boolean} increment - If true, increment task positions; otherwise, decrement.
 * @param {number} start - The starting position to update.
 * @param {number} [end] - Optional ending position to update (inclusive).
 *
 * This function adjusts the position of tasks within a stage by incrementing or decrementing their positions.
 * If 'end' is provided, it updates tasks with positions greater than or equal to 'start' and less than or equal to 'end'.
 * If 'end' is not provided, it updates tasks with positions greater than or equal to 'start'.

 * Example:
 * - To increment positions from 3 onwards: updateTaskPosition('stage_id', true, 3)
 * - To decrement positions from 5 to 10: updateTaskPosition('stage_id', false, 5, 10)
 *
 * @throws {Error} If an error occurs during the database update.
 */
  private async updateTaskPosition(
    stage_id: string,
    increment: boolean,
    start: number,
    end?: number,
  ) {
    const updateOperation = increment ? { increment: 1 } : { decrement: 1 };
    const positionQuery =
      end && end !== 0 ? { gte: start, lte: end } : { gte: start };
    await this.prisma.personalProjectTask.updateMany({
      where: {
        stage_id,
        position: positionQuery,
      },
      data: { position: updateOperation },
    });
  }

  /**
 * Change the position of a task within a stage or move it to a different stage.
 *
 * @param {object} options - An object containing the following parameters:
 * - task_id: string - The unique identifier of the task to be moved.
 * - user_id: string - Identifies the user initiating the change.
 * - stage_id: string - Identifies the current stage of the task.
 * - new_stage_id?: string - (Optional) Identifies the new stage for the task if moving it.
 * - new_position: number - The new position for the task within the same or new stage.
 *
 * This function allows users to change the position of a task within the same stage or move it to a different stage.
 * If 'new_stage_id' is provided, the task is moved to a new stage, and its 'new_position' is set.
 * If 'new_stage_id' is not provided, the task's position is adjusted within the same stage.

 * Example:
 * - To move a task to a different stage and set its new position: 
 *   changePosition({ task_id: 'task_id', user_id: 'user_id', stage_id: 'stage_id', new_stage_id: 'new_stage_id', new_position: 5 })
 * - To change the position of a task within the same stage: 
 *   changePosition({ task_id: 'task_id', user_id: 'user_id', stage_id: 'stage_id', new_position: 3 })
 *
 * @returns {string} - Returns 'Task position changed' upon successful task position update.
 *
 * @throws {Error} If an error occurs during the database update or if the provided IDs are invalid.
 */
  async changePosition({
    task_id,
    user_id,
    stage_id,
    new_stage_id,
    new_position,
  }: {
    task_id: string;
    user_id: string;
    stage_id: string;
    new_stage_id?: string;
    new_position: number;
  }) {
    await this.prisma.personalProjectStage.findUniqueOrThrow({
      where: { stage_id, owner: user_id },
    });
    if (new_stage_id && ObjectId.isValid(new_stage_id)) {
      await this.prisma.personalProjectStage.findUniqueOrThrow({
        where: { stage_id: new_stage_id, owner: user_id },
      });
    }
    const currTask = await this.prisma.personalProjectTask.findUniqueOrThrow({
      where: { task_id, stage_id },
    });
    if (new_stage_id && stage_id !== new_stage_id) {
      await this.updateTaskPosition(stage_id, false, currTask.position + 1);
      await this.updateTaskPosition(new_stage_id, true, new_position);
      await this.prisma.personalProjectTask.update({
        where: { task_id },
        data: { stage_id: new_stage_id, position: new_position },
      });
    } else {
      if (new_position > currTask.position) {
        await this.updateTaskPosition(
          stage_id,
          false,
          currTask.position + 1,
          new_position,
        );
      } else {
        await this.updateTaskPosition(
          stage_id,
          true,
          new_position,
          currTask.position - 1,
        );
      }
    }

    const updateData =
      stage_id === new_stage_id
        ? { position: new_position }
        : { position: new_position, stage_id: new_stage_id };
    await this.prisma.personalProjectTask.update({
      where: { task_id },
      data: updateData,
    });

    return 'Task position changed';
  }

  /**
   * Edit the details of a task within a stage.
   *
   * @param {EditTaskDto} editData - An object containing the following parameters:
   * - user_id: string - Identifies the user making the edit.
   * - stage_id: string - Identifies the stage to which the task belongs.
   * - task_id: string - Identifies the task to be edited.
   * - updatedData: object - Contains the updated data for the task.
   *
   * This function allows users to edit the details of a task within a stage, provided that they own the stage.
   * The 'updatedData' object should contain the fields to be updated.
   *
   * @returns {string} - Returns 'Task updated successfully' upon successful task update.
   *
   * @throws {InternalServerErrorException} If an error occurs during the database update or if the provided IDs are invalid.
   */
  async editPersonalProjectTask({
    user_id,
    stage_id,
    task_id,
    updatedData,
  }: EditTaskDto) {
    try {
      await this.prisma.personalProjectStage.findUniqueOrThrow({
        where: { stage_id, owner: user_id },
      });
      await this.prisma.personalProjectTask.update({
        where: { stage_id, task_id },
        data: updatedData,
      });
      return 'Task updated sucessfully';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async deleteTask({user_id, task_id}: DeleteTaskDto) {
    try {
      await this.prisma.personalProjectTask.delete({
        where: {
          stage: {
            user: {
              user_id
            }
          },
          task_id
        }
      })
      return 'Task deleted successfully';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
