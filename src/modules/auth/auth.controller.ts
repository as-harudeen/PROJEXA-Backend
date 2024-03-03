import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { registerUserSchema } from '../user/schema/zod.schema';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterOTPGuard } from './guards/register-otp.guard';
import { ValidateOTPPipe } from './pipe/validate-otp.pipe';
import { Request, Response } from 'express';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { IsExistGuard } from './guards/is-exist.guard';
import { LoginUserGuard } from './guards/login-user.guard';
import { UserEntity } from '../user/entity/user.entity';
import { TwoAFGuard } from './guards/twoAF.guard';
import { UserPayloadInterface } from './interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('/generate/register-otp')
  @UseGuards(IsExistGuard)
  @UsePipes(new ZodValidationPipe(registerUserSchema))
  async generateRegisterOTP(
    @Res({ passthrough: true }) response: Response,
    @Body() registerUserDto: RegisterUserDto,
  ) {
    return this.authService.generateRegisterOTP(response, registerUserDto);
  }

  @Post('/validate/register-otp')
  @UseGuards(RegisterOTPGuard)
  @UsePipes(ValidateOTPPipe)
  async validateRegisterOTP(@Req() request: Request, @Body('otp') otp: string) {
    const user = request.user as RegisterUserDto;
    await this.authService.validateRegisterOTP(otp, user.user_email);
    return this.userService.register(user);
  }

  @Get('/regenerate/register-otp')
  @UseGuards(RegisterOTPGuard)
  async regenerateOTP(@Req() request: Request) {
    const { user_email } = request.user as RegisterUserDto;
    await this.authService.regenerateRegisterOTP(user_email);
  }

  @Post('login')
  @UseGuards(LoginUserGuard)
  async login(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { two_factor_enabled, user_id, user_name, user_email } =
      request.user as UserEntity;
    const payload = { user_name, user_id, user_email, two_factor_enabled };
    if (two_factor_enabled)
      return this.authService.generate2AFToken(response, payload);
    await this.authService.login(response, payload);
    return { user_id, user_name, isTwoFacAuthEnabled: two_factor_enabled };
  }

  @Post('validate/TFA-otp')
  @UseGuards(TwoAFGuard)
  @UsePipes(ValidateOTPPipe)
  async validate2AFOTP(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body('otp') otp: string,
  ) {
    const { user_name, user_id, user_email, two_factor_enabled } =
      req.user as UserPayloadInterface & { two_factor_enabled: boolean };
    await this.authService.validate2AFOTP(res, otp, { user_email, user_id });
    console.log(two_factor_enabled, ' from validate/TFA-otp');
    res.status(200);
    return { user_id, user_name, isTwoFacAuthEnabled: two_factor_enabled };
  }
}
