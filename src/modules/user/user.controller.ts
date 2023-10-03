import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';

import { LoginUerDto } from './dto/login-user.dto';
import { UserService } from './user.service';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { loginUserSchema } from './schema/zod.schema';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


}
