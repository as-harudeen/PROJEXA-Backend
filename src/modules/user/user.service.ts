import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

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
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
