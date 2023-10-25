import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ZodValidationPipe } from 'src/pipes/zodValidation.pipe';
import { teamSchema } from './schema/create-team.schema';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { Request } from 'express';
import { FileUploadTransformPipe } from 'src/pipes/fileupload.pipe';
import { TeamService } from './team.service';
import { UserPayloadInterface } from '../auth/interface';
import { TransformTeamDetailsInterceptor } from './interceptor/transform-team-details.interceptor';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @UseGuards(UserAuthGuard)
  @UseInterceptors(
    FileInterceptor('team_dp', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, './uploads');
        },
        filename: (req, file, callback) => {
          console.log(file);
          const uniqueSuffix = Date.now() + -Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async createNewTeam(
    @Req() request: Request,
    @Body(new ZodValidationPipe(teamSchema)) body: CreateTeamDto,
    @UploadedFile(new FileUploadTransformPipe()) team_dp: string,
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    body.team_dp = team_dp || '';
    return this.teamService.createNewTeam(body, user_id);
  }

  @Get()
  @UseGuards(UserAuthGuard)
  async getTeams(@Req() request: Request) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.teamService.getTeams(user_id);
  }

  @Get(':team_id')
  @UseGuards(UserAuthGuard)
  @UseInterceptors(TransformTeamDetailsInterceptor)
  async getTeamDetails (@Req() request: Request, @Param('team_id') team_id: string) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.teamService.getTeamDetails(team_id, user_id);
  } 



}
