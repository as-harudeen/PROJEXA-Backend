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
   * generate jwt token
   * @param payload - payload
   * @returns - jwt token
   */
  async generateToken<T extends object>(
    payload: T,
    secret = process.env.SECRET,
  ) {
    return await this.jwtService.signAsync(payload, { secret });
  }

  /**
   * Generate register otp and set it cookie as
   * registerToken.
   * @param res - Response object for set cookie
   * @param registerUserDto - user credatials.
   * @returns "OTP send successfully"
   * @throw BadRequestException if some error occure
   */
  async generateRegisterOTP(res: Response, registerUserDto: RegisterUserDto) {
    try {
      await this.otpService.generateAndMailOTP(
        registerUserDto.user_email,
        `${registerUserDto.user_email}`,
      );
      const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);
      res.cookie(
        'registerToken',
        await this.generateToken<RegisterUserDto>(
          {
            ...registerUserDto,
            password: hashedPassword,
          },
          process.env.REGISTER_TOKEN_SECRET,
        ),
      );
      return 'OTP sent successfully';
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  /**
   * Validate register OTP
   * @param otp - OTP for pass to validateOTP function
   * @param user_email - user email for pass to validateOTP function
   * @returns Register OTP verified.
   */
  async validateRegisterOTP(otp: string, user_email: string) {
    await this.otpService.validateOTP(otp, `${user_email}-OTP`);
    return 'Register OTP Verified';
  }

  /**
   * Register OTP regenerate function.
   * @param user_email - user email
   * @returns OTP Send Successfully
   */
  async regenerateRegisterOTP(user_email: string) {
    return this.otpService.generateAndMailOTP(user_email, `${user_email}-OTP`);
  }

  /**
   * url:- auth/login
   * method:- POST
   * if user have 2AF otp send to mail and 
   * give 2AF token
   * 
   * else
   * generate access_token
   * @param res - Response object for set cookie
   * @param user - email and user_id for payload.
   * @returns String
   */
  async login(res: Response, user: UserEntity) {
    const { user_email, user_id } = user;
    const payload = { user_id, user_email };
    if (!user.two_factor_enabled) {
      res.cookie('access_token', await this.generateToken(payload));
      res.status(200);
      return 'Login successfully';
    }
    await this.otpService.generateAndMailOTP(user_email, `${user_id}-2F-OTP`);
    res.cookie('two-AF-Token', await this.generateToken(payload, process.env.TWO_AF_TOKEN_SECRET));
    res.status(201);
    return '2 Factor authentication OTP sent successfully';
  }

  /**
   * url :- /auth/validate/2AF-otp
   * method :- POST
   * validate otp and generate token
   * 
   * @param res - Response object to set access_token
   * in cookie
   * @param otp - otp for validate.
   * @returns String
   */
  async  validate2AFOTP (res: Response, otp: string, {user_email, user_id}: {user_email: string, user_id: string}) {
    await this.otpService.validateOTP(otp, `${user_id}-2F-OTP`);
    const payload = {user_id, user_email};
    res.cookie('access_token', await this.generateToken(payload));
    return 'Login successfully';
  }
}
