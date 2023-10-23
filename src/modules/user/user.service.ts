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
  async register({
    user_email,
    user_name,
    user_full_name,
    password,
  }: RegisterUserDto) {
    try {
      await this.prisma.user.create({
        data: {
          user_name,
          user_email,
          user_full_name,
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
  async getMyProfile(user_id: string) {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: { user_id },
        select: {
          user_name: true,
          user_email: true,
          user_full_name: true,
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
  async editMyProfile(user_id: string, updatedUserData: EdituserDto) {
    try {
      return await this.prisma.user.update({
        where: { user_id },
        data: updatedUserData,
        select: {
          user_name: true,
          user_email: true,
          user_profile: true,
          user_full_name: true,
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


  /**
   * Retrive user details by user name.
   * @param user_id - The unique indetifier of user
   * @param user_name - User name
   * @returns {Promise<UserDetails>}
   * -- user_id - string - user id,
   * -- user_name - string - user Name of the user,
   * -- user_full_name - string - Full name of user,
   * -- user_profile - string - Profile image name of user.
   * -- summary - string - summary of the user
   * -- numberOfFollowing - number - Following count,
   * -- numberOfFollowers - number - Followers count,
   * -- isCurrentUserFollowing - boolean
   * 
   * @throws {InternalServerErrorException} - If any error occure while performing with database.
   */
  async getUser(user_id: string, user_name: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { user_name },
        select: {
          user_id: true,
          user_name: true,
          user_full_name: true,
          user_profile: true,
          summary: true,
          followedByIDs: true,
          followingIDs: true,
        },
      });
      const { followedByIDs, followingIDs, ...userProfileDetails } = user;
      const userProfileSummary = {
        ...userProfileDetails,
        numberOfFollowing: followingIDs.length,
        numberOfFollowers: followedByIDs.length,
        isCurrentUserFollowing: followedByIDs.includes(user_id),
      };
      return userProfileSummary;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }


  /**
   * Retrive all users username and profile.
   * @param user_id - The unique identifier of the user.
   * @returns {Promise<UserDetails>}
   * -- user_name - string - user name
   * -- user_profile - string - profile image name
   * @throws {InternalServerErrorException} - If any error occure during perform with database.
   */
  async getAllUsers(user_id: string) {
    try {
      const users = await this.prisma.user.findMany({
        where: { user_id: { not: user_id } },
        select: { user_name: true, user_profile: true },
      });
      return users;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }



  /**
 * Create a connection between two users, allowing one user to follow the other.
 *
 * @param {string} followed_by_id - The unique identifier of the user following another user.
 * @param {string} following_id - The unique identifier of the user being followed.
 *
 * This function allows one user to follow another, creating a connection between them.

 * @returns {string} - Returns 'Created connection successfully' upon successful creation of the connection.

 * @throws {BadRequestException} If the provided user IDs are the same, indicating a user cannot follow themselves.
 * @throws {InternalServerErrorException} If an error occurs during the database operations or if the provided user IDs are invalid.
 */
  async createConnection(followed_by_id: string, following_id: string) {
    if (followed_by_id === following_id)
      throw new BadRequestException("User can't follow themself");
    try {
      await this.prisma.user.findUniqueOrThrow({
        where: { user_id: followed_by_id },
      });
      await this.prisma.user.findUniqueOrThrow({
        where: { user_id: following_id },
      });
      await this.prisma.user.update({
        where: { user_id: followed_by_id },
        data: { followingIDs: { push: following_id } },
      });
      await this.prisma.user.update({
        where: { user_id: following_id },
        data: { followedByIDs: { push: followed_by_id } },
      });
      return 'Created connection Successfully';
    } catch (err) {
      console.log(err.message);
      throw new InternalServerErrorException(err.message);
    }
  }


  /**
 * Remove a connection between two users, allowing one user to unfollow another.
 *
 * @param {string} followed_by_id - The unique identifier of the user following another user.
 * @param {string} following_id - The unique identifier of the user being unfollowed.
 *
 * This function allows one user to unfollow another, removing the connection between them.

 * @returns {string} - Returns 'Remove connection successfully' upon successful removal of the connection.

 * @throws {InternalServerErrorException} If an error occurs during the database operations or if the provided user IDs are invalid.
 */
  async removeConnection(followed_by_id: string, following_id: string) {
    try {
      const followedByUserDetails = await this.prisma.user.findUniqueOrThrow({
        where: { user_id: followed_by_id, followingIDs: { has: following_id } },
        select: { followingIDs: true },
      });
      const followingUserDetails = await this.prisma.user.findUniqueOrThrow({
        where: { user_id: following_id, followedByIDs: { has: followed_by_id } },
        select: {
          followedByIDs: true,
        },
      });

      await this.prisma.user.update({
        where: { user_id: followed_by_id },
        data: {
          followingIDs: {
            set: followedByUserDetails.followingIDs.filter(
              (id) => id !== following_id,
            ),
          },
        },
      });

      await this.prisma.user.update({
        where: { user_id: following_id },
        data: {
          followedByIDs: followingUserDetails.followedByIDs.filter(
            (id) => id !== followed_by_id,
          ),
        },
      });

      return 'remove connection successfully';
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
