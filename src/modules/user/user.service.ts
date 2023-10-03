import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginUerDto } from './dto/login-user.dto';
import { AuthService } from '../auth/auth.service';
import { Response } from 'express';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  /**
   * The method for check is user exist within given user_name
   * and email,
   * @param user_name -
   * @param user_email -
   * @throws - BadRequestException -
   *           if user exist.
   */
  async isExist(user_name: string, user_email: string) {
    try {
      console.log(user_name, user_email);
      const user = await this.prisma.user.findFirst({
        where: { OR: [{ user_email }, { user_name }] },
      });
      if (user != null) {
        throw new BadRequestException('Username or email already exist');
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  /**
   * Create new user with credentails.
   * @param param0 - User creadantials.
   * @returns - User registered successfully.
   * @throws - BadRequestException -
   *           if create user on database get fail.
   */
  async register({ user_email, user_name, password }: RegisterUserDto) {
    try {
      await this.prisma.user.create({
        data: {
          user_email,
          user_name,
          password,
        },
      });
      return 'User registered successfully';
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async login(res: Response, loginUserDto: LoginUerDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { user_email: loginUserDto.user_email },
      });
      if (user == null) throw new Error('Incorrect email or password');
      const token = await this.authService.login(user, loginUserDto.password);
      res.cookie('token', token);
      return {
        two_factor_enabled: user.two_factor_enabled
      }
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
