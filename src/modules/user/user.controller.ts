import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';

import { UserService } from './user.service';
import { Request, query } from 'express';
import { EdituserDto } from './dto/edit-user.dto';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { editUserSchema } from './schema/zod.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileUploadTransformPipe } from '../../pipes/fileupload.pipe';
import { UsernameAvailableGuard } from './guard/UsernameAvailable.guard';
import { ChangeTwoFactorAuthPipe } from './pipe/change-two-factor-auth.pipe';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { UserPayloadInterface } from '../auth/interface';
import { PaginationQueryTransformPipe } from 'src/pipes/pagination-query-transform.pipe';
import { GetAllUsersQueryDto } from './dto/get-all-users.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('myprofile')
  @UseGuards(UserAuthGuard)
  async getMyProfile(@Req() request: Request) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.userService.getMyProfile(user_id);
  }

  @Patch()
  @UseGuards(UserAuthGuard)
  @UseGuards(UsernameAvailableGuard)
  @UseInterceptors(
    FileInterceptor('user_profile', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, './uploads');
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + -Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async editMyProfile(
    @Req() request: Request,
    @Body(new ZodValidationPipe(editUserSchema)) updatedUserData: EdituserDto,
    @UploadedFile(new FileUploadTransformPipe()) user_profile: string,
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    if (user_profile) {
      updatedUserData.user_profile = user_profile;
    }
    return this.userService.editMyProfile(user_id, updatedUserData);
  }

  @Patch('two-factor-auth/:new_state')
  @UseGuards(UserAuthGuard)
  @UsePipes(ChangeTwoFactorAuthPipe)
  async changeTwoFactorAuthState(
    @Req() request: Request,
    @Param('new_state') new_state: 'enable' | 'disable',
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.userService.toggleTwoFactorAuth(
      user_id,
      new_state === 'enable',
    );
  }

  @Get('get-all-users')
  @UseGuards(UserAuthGuard)
  async getAllUsers(@Req() request: Request, @Query(new PaginationQueryTransformPipe(+process.env.MAX_USERS_PAGINATION_LIMIT)) query: GetAllUsersQueryDto) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.userService.getAllUsers({...query, user_id});
  }

  @Get(':user_name/following-users')
  @UseGuards(UserAuthGuard)
  async getFollowingUsers(@Param('user_name') user_name: string) {
    return this.userService.getFollowingUsers(user_name);
  }

  @Get(':user_name/followers')
  @UseGuards(UserAuthGuard)
  async getFollowers(@Param('user_name') user_name: string) {
    return this.userService.getFollowers(user_name);
  }

  @Get(':user_name')
  @UseGuards(UserAuthGuard)
  async getUser(
    @Req() request: Request,
    @Param('user_name') user_name: string,
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    console.log('fetching user details');
    return this.userService.getUser(user_id, user_name);
  }

  @Post('follow/:following_id')
  @UseGuards(UserAuthGuard)
  async createConnection(
    @Req() request: Request,
    @Param('following_id') following_id: string,
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.userService.createConnection(user_id, following_id);
  }

  @Post('unfollow/:following_id')
  @UseGuards(UserAuthGuard)
  async removeConnection(
    @Req() request: Request,
    @Param('following_id') following_id: string,
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.userService.removeConnection(user_id, following_id);
  }
}
