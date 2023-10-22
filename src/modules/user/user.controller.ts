import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { Request } from 'express';
import { UserPayloadInterface } from '../auth/interface';
import { EdituserDto } from './dto/edit-user.dto';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { editUserSchema } from './schema/zod.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileUploadTransformPipe } from './pipe/fileupload.pipe';
import { UsernameAvailableGuard } from './guard/UsernameAvailable.guard';
import { ChangeTwoFactorAuthPipe } from './pipe/change-two-factor-auth.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(UserAuthGuard)
  async getUser(@Req() request: Request) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.userService.getUser(user_id);
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
  async editUser(
    @Req() request: Request,
    @Body(new ZodValidationPipe(editUserSchema)) updatedUserData: EdituserDto,
    @UploadedFile(new FileUploadTransformPipe()) user_profile: string
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    if(user_profile) {
      updatedUserData.user_profile = user_profile
    }
    return this.userService.editUser(user_id, updatedUserData);
  }


  @Patch('two-factor-auth/:new_state')
  @UseGuards(UserAuthGuard)
  @UsePipes(ChangeTwoFactorAuthPipe)
  async changeTwoFactorAuthState (
    @Req() request: Request,
    @Param('new_state') new_state: 'enable' | 'disable'
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.userService.toggleTwoFactorAuth(user_id, new_state === 'enable')
  }
}
