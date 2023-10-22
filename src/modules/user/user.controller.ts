import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { Request } from 'express';
import { UserPayloadInterface } from '../auth/interface';
import { EdituserDto } from './dto/edit-user.dto';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { editUserSchema } from './schema/zod.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(UserAuthGuard)
  async getUser(@Req() request: Request) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.userService.getUser(user_id);
  }

 
}
