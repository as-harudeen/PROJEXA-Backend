import { Body, Controller, Get, Post, Req, Res, UseGuards, UsePipes } from '@nestjs/common';

import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { registerUserSchema } from '../user/schema/register-user.schema';
import { RegisterUserDto } from '../user/dto/register-user.dto';
import { Request, Response } from 'express';
import { OtpService } from './otp.service';
import { ValidateOTPPipe } from './pipe/validate-otp.pipe';
import { UserService } from '../user/user.service';
import { RegisterOTPGuard } from './guards/register-otp.guard';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService, private readonly userService: UserService) {}

  @Post('/generate/register-otp')
  @UsePipes(new ZodValidationPipe(registerUserSchema))
  async generateRegisterOTP(
    @Res({ passthrough: true }) response: Response,
    @Body() registerUserDto: RegisterUserDto,
  ) {
    return this.otpService.generateRegisterOTP(response, registerUserDto);
  }

  @Post("/validate/register-otp")
  @UseGuards(RegisterOTPGuard)
  @UsePipes(new ValidateOTPPipe())
  async validateRegisterOTP (@Req() request: Request, @Body("otp") otp: string) {
    const user = request.user as RegisterUserDto;
    await this.otpService.validateRegisterOTP(otp, user.user_email);
    return this.userService.register(user);
  }

  @Get("/regenerate/register-otp")
  @UseGuards(RegisterOTPGuard)
  async regenerateOTP (@Req() request: Request) {
    const {user_email} = request.user as RegisterUserDto;
    return this.otpService.generateAndMailRegisterOTP(user_email);
  }
}

