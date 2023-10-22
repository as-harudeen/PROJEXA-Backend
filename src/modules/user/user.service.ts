import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
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

  /**
   * Retrieve user details by user ID
   * @param {string} user_id - the unique indentifier of the user
   * @returns {Promise<UserDetails>} - A Promise that resolves to an object-
   * containing user details;
   * user_name - string - User name
   * user_email - string - User email
   * user_profile - string | null - User profile
   * summary - string | null - User summary
   * birthday - Date | null - User Birthday
   */
  async getUser(user_id: string) {
    try {
      return await this.prisma.user.findUniqueOrThrow({where: {user_id}, select: {
        user_name: true,
        user_email: true,
        user_profile: true,
        summary: true,
        birthday: true
      }})
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
