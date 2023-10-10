import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { UserAuthGuard } from 'src/modules/auth/guards/user-auth.guard';
import { Request } from 'express';
import { CreateTaskParamInterface } from './interface/create-task.interface';
import { UserPayloadInterface } from 'src/modules/auth/interface';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { taskSchema } from './schema/create-task.zod.schema';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('task/:project_id/:stage_id')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @Post()
    @UseGuards(UserAuthGuard)
    async createTask (@Req() req: Request, @Param() createTaskParam: CreateTaskParamInterface, @Body(new ZodValidationPipe(taskSchema)) createTaskDto: CreateTaskDto ) {
        const newTaskDetails = {
            user_id: (req.user as UserPayloadInterface).user_id,
            ...createTaskParam,
            task_title: createTaskDto.task_title
        }
        console.log(newTaskDetails);
        return this.taskService.createTask(newTaskDetails);
    }
}
