import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../user/entity/user.entity';
import { Response } from 'express';
import { RegisterUserDto } from './dto/register-user.dto';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  /**
   * Generate register token.
   * @param user - User credantials for payload
   * @returns jwtToken
   */
  async generateRegisterToken({
    user_email,
    user_name,
    password,
  }: {
    user_name: string;
    user_email: string;
    password: string;
  }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.jwtService.signAsync({
      user_name,
      user_email,
      password: hashedPassword,
    });
  }

  async login(res: Response, user: UserEntity) {}

  async generateRegisterOTP(res: Response, registerUserDto: RegisterUserDto) {
    try {
      await this.otpService.generateAndMailOTP(
        registerUserDto.user_email,
        `${registerUserDto.user_email}`,
      );
      res.cookie(
        'registerToken',
        await this.generateRegisterToken(registerUserDto),
      );
      return 'OTP sent successfully';
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async validateRegisterOTP(otp: string, user_email: string) {
    await this.otpService.validateOTP(otp, `${user_email}-OTP`);
    return 'Register OTP Verified';
  }

  async regenerateRegisterOTP(user_email: string) {
    return this.otpService.generateAndMailOTP(user_email, `${user_email}-OTP`);
  }
}
