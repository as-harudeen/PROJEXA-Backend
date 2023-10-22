import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { EdituserDto } from './dto/edit-user.dto';

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
      return await this.prisma.user.findUniqueOrThrow({
        where: { user_id },
        select: {
          user_name: true,
          user_email: true,
          user_profile: true,
          summary: true,
          birthday: true,
        },
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * Edit user details by user ID.
   *
   * @param {string} user_id - The unique identifier of the user.
   * @param {EditUserDto} updatedUserData - An object containing the updated user data.
   *
   * This function allows you to edit the details of a user by providing their user ID and the updated user data.
   *
   * @returns {Promise<UserDetails>} - A Promise that resolve to an object
   * user_name - string - User name,
   * user_email - string - User email
   * user_profile - string | null - User profile image name,
   * summary - string | null - Summary of the user
   * birthday - Date | null - Birthday of the user.
   *
   * @throws {InternalServerErrorException} If an error occurs during the database update or if the provided user ID is invalid.
   */
  async editUser(user_id: string, updatedUserData: EdituserDto) {
    try {
      return await this.prisma.user.update({
        where: { user_id },
        data: updatedUserData,
        select: {
          user_name: true,
          user_email: true,
          user_profile: true,
          summary: true,
          birthday: true,
        },
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
 * Toggle Two-Factor Authentication (2FA) for a user.
 *
 * @param {string} user_id - The unique identifier of the user.
 * @param {boolean} isEnable - A boolean value indicating whether to enable (true) or disable (false) 2FA.
 *
 * This function allows you to toggle Two-Factor Authentication (2FA) for a user by specifying their user ID and whether to enable or disable 2FA.

 * @returns {Promise<{ two_factor_enabled: boolean }>} - A promise that resolves to an object indicating the 2FA status:
 * - two_factor_enabled: boolean - Whether 2FA is enabled (true) or disabled (false).

 * @throws {InternalServerErrorException} If an error occurs during the database update or if the provided user ID is invalid.
 */
  async toggleTwoFactorAuth(user_id: string, isEnable: boolean) {
    try {
      return await this.prisma.user.update({
        where: { user_id },
        data: { two_factor_enabled: isEnable },
        select: { two_factor_enabled: true },
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
