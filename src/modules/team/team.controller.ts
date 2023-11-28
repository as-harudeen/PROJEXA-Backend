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
} from '@nestjs/common';
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
import { TransformTeamActivityLogInterceptor } from './interceptor/transform-team-activity-log.interceptor';
import { PromoteToAdminParamDto } from './dto/promote-to-admin.dto';
import { DemoteAdminToMemberParamDto } from './dto/demote-to-member.dto';
import { EditTeamBodyDto } from './dto/edit-team.dto';
import { CreateTeamDto } from './modules/team-Invitation/dto/create-team.dto';
import { GetTeamQueryDto } from './dto/get-team.dto';
import { PaginationQueryTransformPipe } from 'src/pipes/pagination-query-transform.pipe';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @UseGuards(UserAuthGuard)
  @UseInterceptors(
    FileInterceptor('team_dp', {
      //todo write in another class
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
  async getTeams(
    @Req() request: Request,
    @Query(
      new PaginationQueryTransformPipe(+process.env.MAX_TEAM_PAGINATION_LIMIT),
    )
    query: GetTeamQueryDto,
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.teamService.getTeams({ ...query, user_id });
  }

  @Get(':team_id')
  @UseGuards(UserAuthGuard)
  @UseInterceptors(TransformTeamDetailsInterceptor)
  async getTeamDetails(
    @Req() request: Request,
    @Param('team_id') team_id: string,
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.teamService.getTeamDetails(team_id, user_id);
  }

  @Patch(':team_id')
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
  async editTeam(
    @Req() request: Request,
    @Param('team_id') team_id: string,
    @Body() updatedData: EditTeamBodyDto,
    @UploadedFile(new FileUploadTransformPipe()) team_dp: string,
  ) {
    const { user_id: admin_id } = request.user as UserPayloadInterface;
    if (team_dp) updatedData.team_dp = team_dp;
    return this.teamService.editTeam({ updatedData, team_id, admin_id });
  }

  @Get('activity-logs/:team_id')
  @UseGuards(UserAuthGuard)
  @UseInterceptors(TransformTeamActivityLogInterceptor)
  async getTeamActivityLogs(
    @Req() request: Request,
    @Param('team_id') team_id: string,
  ) {
    const { user_id } = request.user as UserPayloadInterface;
    return this.teamService.getTeamActivityLogs({ user_id, team_id });
  }

  @Patch(':team_id/member/:member_id/promote')
  @UseGuards(UserAuthGuard)
  async promoteToAdmin(
    @Req() request: Request,
    @Param() param: PromoteToAdminParamDto,
  ) {
    const { user_id: admin_id } = request.user as UserPayloadInterface;
    return this.teamService.promoteToAdmin({ ...param, admin_id });
  }
  @Patch(':team_id/member/:admin_id/demote')
  @UseGuards(UserAuthGuard)
  async demoteToMember(
    @Req() request: Request,
    @Param() param: DemoteAdminToMemberParamDto,
  ) {
    const { user_id: curr_admin_id } = request.user as UserPayloadInterface;
    return this.teamService.demoteToMember({ ...param, curr_admin_id });
  }
}
