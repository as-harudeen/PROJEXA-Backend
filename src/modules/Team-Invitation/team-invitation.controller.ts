import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TeamInvitationService } from './team-invitation.service';
import { UserAuthGuard } from '../auth/guards/user-auth.guard';
import { UserPayloadInterface } from '../auth/interface';
import { Request } from 'express';

@Controller('team-invitation')
export class TeamInvitationController {
  constructor(private readonly teamInvitationService: TeamInvitationService) {}

  @Post(':team_id')
  @UseGuards(UserAuthGuard)
  async createTeamInvitation(
    @Req() request: Request,
    @Param('team_id') team_id: string,
    @Body('invitee_id') invitee_id: string,
  ) {
    const { user_id: inviter_id, user_name: inviter_name } =
      request.user as UserPayloadInterface;
    return this.teamInvitationService.createTeamInvitation({
      team_id,
      inviter_id,
      invitee_id,
      inviter_name,
    });
  }

}
