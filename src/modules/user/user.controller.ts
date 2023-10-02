import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { registerUserSchema } from './schema/register-user.schema';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { RegisterUserDto } from './dto/register-user.dto';
import { MailService } from '../mail/mail.service';
import { RedisService } from '../redis/redis.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
  ) {}

  @Post('register')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerUserSchema))
  async register(@Body() registerUserDto: RegisterUserDto) {
    await this.userService.isExist(
      registerUserDto.user_name,
      registerUserDto.user_email,
    );
    const OTP = await this.mailService.sendOTP(registerUserDto.user_email);
    this.redisService.setItem(`${registerUserDto.user_email}-OTP`, OTP);
    return "OK";
  }
}
