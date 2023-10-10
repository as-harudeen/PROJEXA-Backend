import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateTaskInterface } from './interface/create-task.interface';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  async createTask({
    user_id,
    project_id,
    stage_id,
    task_title,
  }: CreateTaskInterface) {
    try{
        await this.prisma.project.findFirstOrThrow({
          where: { user_id, project_id },
        });
        await this.prisma.project.findFirstOrThrow({
          where: { project_id, stages: { some: { stage_id } } },
        });
    
        await this.prisma.task.create({
            data: {
                stage_id,
                task_title
            }
        })
        return "Ok";
    } catch (err) {
        console.log(err);
        throw new InternalServerErrorException(err.message);
    }
    
  }
}
