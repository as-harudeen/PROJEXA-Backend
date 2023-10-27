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

  @Delete('cancel/:team_invitation_id')
  @UseGuards(UserAuthGuard)
  async cancelTeamInvitation(
    @Req() request: Request,
    @Param('team_invitation_id') team_invitation_id: string,
  ) {
    const { user_id: team_inviter_id, user_name: inviter_name } =
      request.user as UserPayloadInterface;
    return this.teamInvitationService.cancelTeamInvitation({
      inviter_name,
      team_inviter_id,
      team_invitation_id,
    });
  }

  @Get('')
  @UseGuards(UserAuthGuard)
  async getTeamInvitations(@Req() request: Request) {
    const { user_id: team_invitee_id } = request.user as UserPayloadInterface;
    return this.teamInvitationService.getTeamInvitations(team_invitee_id);
  }

  @Put('accept/:team_invitation_id')
  @UseGuards(UserAuthGuard)
  async acceptTeamInvitation(
    @Req() request: Request,
    @Param('team_invitation_id') team_invitation_id: string,
  ) {
    const { user_name, user_id: team_invitee_id } =
      request.user as UserPayloadInterface;
    return this.teamInvitationService.acceptTeamInvitation({
      user_name,
      team_invitation_id,
      team_invitee_id,
    });
  }

  @Put('reject/:team_invitation_id')
  @UseGuards(UserAuthGuard)
  async rejectTeamInvitation(
    @Req() request: Request,
    @Param('team_invitation_id') team_invitation_id: string,
  ) {
    const { user_name: team_invitee_name, user_id: team_invitee_id } =
      request.user as UserPayloadInterface;
    return this.teamInvitationService.rejectTeamInvitation({
      team_invitee_name,
      team_invitation_id,
      team_invitee_id,
    });
  }
}
