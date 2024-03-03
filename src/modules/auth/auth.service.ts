import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { RegisterUserDto } from './dto/register-user.dto';
import { OtpService } from '../otp/otp.service';
import { UserPayloadInterface } from './interface';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
    private readonly prisma: PrismaService,
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
        `${registerUserDto.user_email}-OTP`,
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

  async generate2AFToken(res: Response, payload: UserPayloadInterface) {
    await this.otpService.generateAndMailOTP(
      payload.user_email,
      `${payload.user_id}-2F-OTP`,
    );
    res.cookie(
      'two-AF-Token',
      await this.generateToken(payload, process.env.TWO_AF_TOKEN_SECRET),
    );
    res.status(201);
    return '2 Factor authentication OTP sent successfully';
  }

  /**
   * Generate token and store in cookie.
   * @param res - Response object for set cookie
   * @param user - email and user_id for payload.
   * @returns {string}
   */
  async login(res: Response, payload: UserPayloadInterface) {
    res.cookie('access_token', await this.generateToken(payload));
    res.status(200);
    return 'Login successfully';
  }

  /**
   * url :- /auth/validate/2AF-otp
   * method :- POST
   * validate otp and generate token
   *
   * @param res - Response object to set access_token
   * in cookie
   * @param otp - otp for validate.
   * @returns {string}
   */
  async validate2AFOTP(
    res: Response,
    otp: string,
    { user_email, user_id }: { user_email: string; user_id: string },
  ) {
    await this.otpService.validateOTP(otp, `${user_id}-2F-OTP`);
    const payload = { user_id, user_email };
    res.cookie('access_token', await this.generateToken(payload));
    console.log('varified successfully');
    return {user_email, user_id};
  }

  async getUserPayloadFromToken(token: string) {
    return this.jwtService.verifyAsync(token, { secret: process.env.SECRET });
  }

  async checkUserExistenceInTeam({
    user_id,
    team_id,
  }: {
    user_id: string;
    team_id: string;
  }) {
    try {

      this.prisma
      
      await this.prisma.team.findUniqueOrThrow({
        
        where: {
          team_id,
          OR: [
            {
              team_admins_id: { has: user_id },
            },
            {
              team_members_id: { has: user_id },
            },
          ],
        },
      });
      
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          user_id,
        },
        select: {
          user_name: true,
          user_full_name: true,
          user_profile: true
        },
      });
      return user;
    } catch (err) {
      console.log(err);
    }
  }
}
