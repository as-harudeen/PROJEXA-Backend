import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamInvitationDetailsDto } from './dto/team-invitation.dto';
import { AcceptInvitationDto } from './dto/accept-invitation.dto';
import { CancelTeamInvitationDto } from './dto/cancel-team-invitation.dto';
import { RejectTeamInvitationDto } from './dto/reject-team-invitation.dto';
@Injectable()
export class TeamInvitationService {
  constructor(private readonly prisma: PrismaService) {}

  async createTeamInvitation({
    team_id,
    inviter_id,
    invitee_id,
    inviter_name,
  }: CreateTeamInvitationDetailsDto) {
    try {
      //validating team_id and esuring that
      //given user_id is not a id of the member of the team.
      const {
        team_activity_logs: { team_activity_id },
      } = await this.prisma.team.findUniqueOrThrow({
        where: {
          team_id,
          AND: [
            {
              team_admins_id: { has: inviter_id },
            },
            {
              NOT: [
                { team_admins_id: { has: invitee_id } },
                { team_members_id: { has: invitee_id } },
              ],
            },
          ],
        },
        select: {
          team_activity_logs: {
            select: {
              team_activity_id: true,
            },
          },
        },
      });

      //validating user_id
      //also checking that whether he got the
      //invitation from the same user to the same team
      const { user_name: invitee_name } =
        await this.prisma.user.findUniqueOrThrow({
          where: {
            user_id: invitee_id,
            recieved_team_invitations: {
              none: {
                team_id,
                team_invitee_id: invitee_id,
                team_inviter_id: inviter_id,
                status: { equals: 'pending' },
              },
            },
          },
          select: { user_name: true },
        });

      const expiryDate = new Date(
        new Date().getTime() + 5 * 24 * 60 * 60 * 1000,
      );

      const teamInvitation = await this.prisma.teamInvitation.create({
        data: {
          team_id,
          team_invitee_id: invitee_id,
          team_inviter_id: inviter_id,
          team_invitation_expiry_date: expiryDate,
          team_activity_id,
        },
        select: {
          team_invitation_id: true,
        },
      });

      const invitedLog = `${inviter_name} has invited ${invitee_name}`;
      await this.prisma.teamActivityLog.create({
        data: {
          team_activity_id,
          log_text: invitedLog,
        },
      });

      return teamInvitation;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async cancelTeamInvitation({
    inviter_name,
    team_invitation_id,
    team_inviter_id,
  }: CancelTeamInvitationDto) {
    try {
      const {
        team_invitee: { user_name: invitee_name },
        team_activity_id,
      } = await this.prisma.teamInvitation.delete({
        where: { team_invitation_id, team_inviter_id },
        select: {
          team_invitee: {
            select: {
              user_name: true,
            },
          },
          team_id: true,
          team_activity_id: true,
        },
      });

      const cancelLog = `${inviter_name} has canceled the invitation for ${invitee_name}.`;
      await this.prisma.teamActivityLog.create({
        data: {
          team_activity_id,
          log_text: cancelLog,
        },
      });

      console.log('cancelled');
      return 'Invitation cancelled';
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async getTeamInvitations(team_invitee_id: string) {
    console.log('from get team invitation service');
    try {
      return this.prisma.teamInvitation.findMany({
        where: {
          team_invitee_id,
        },
        select: {
          team_invitation_id: true,
          team: {
            select: {
              team_name: true,
              team_desc: true,
              team_dp: true,
            },
          },
          team_inviter: {
            select: {
              user_name: true,
              user_profile: true,
            },
          },
        },
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async acceptTeamInvitation({
    team_invitation_id,
    team_invitee_id,
    user_name,
  }: AcceptInvitationDto) {
    try {
      const { team_id, team_activity_id } = await this.prisma.teamInvitation.delete({
        where: { team_invitation_id, team_invitee_id },
        select: {
          team_id: true,
          team_activity_id: true
        },
      });
      await this.prisma.team.update({
        where: { team_id },
        data: {
          team_members_id: { push: team_invitee_id },
        },
      });

      const joinedLog = `${user_name} has joined`;
      await this.prisma.teamActivityLog.create({
        data: {
          team_activity_id,
          log_text: joinedLog,
        },
      });

      return 'Team invited accepted';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async rejectTeamInvitation({
    team_invitation_id,
    team_invitee_id,
    team_invitee_name,
  }: RejectTeamInvitationDto) {
    try {
      const { team_activity_id } = await this.prisma.teamInvitation.delete({
        where: {
          team_invitation_id,
          team_invitee_id,
        },
        select: {
          team_activity_id: true,
        },
      });

      const rejectTeamInvitationLog = `${team_invitee_name} has rejected the invitation`;

      await this.prisma.teamActivityLog.create({
        data: {
          team_activity_id,
          log_text: rejectTeamInvitationLog
        }
      });

      return 'Rejected successfully';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
