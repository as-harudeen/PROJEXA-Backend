import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
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
  async register({ password, ...registerUserDto }: RegisterUserDto) {
    try {
      this.mailService.sendOTP(registerUserDto.user_email);
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.prisma.user.create({
        data: {
          ...registerUserDto,
          password: hashedPassword,
        },
      });
      return 'User registered successfully';
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
