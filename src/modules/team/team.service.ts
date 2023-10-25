import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { CreateTeamInvitationDetailsDto } from './dto/team-invitation.dto';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create New Team
   * The user who initiate the team would be the -
   * defualt team_lead and team_admin
   * @param {teamDetails} CreateTeamDto -
   * - team_name - string
   * - team_desc - string
   * - team_dp  - string
   * @param user_id - id of the user who initiate the team
   * @returns {string}  Team created successfully
   * @throws {InternalServerErrorException} - If any erorr occure-
   * during creation fo the team in database.
   */
  async createNewTeam(
    { team_name, team_desc, team_dp }: CreateTeamDto,
    user_id: string,
  ) {
    try {
      await this.prisma.team.create({
        data: {
          team_name,
          team_desc,
          team_dp,
          team_admins_id: [user_id],
          team_lead_id: user_id,
        },
      });
      return 'Team created successfully';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  /**
   * Retrive team details of the certain user
   * @param user_id - The unique identifier of the user
   * @returns {Promise<TeamDetails>}
   * - team_id - string
   * - team_name - string
   * - team_desc - string
   * - team_dp - string
   * - team_lead -
   * ---- user_name - string
   * ---- user_profile - string
   */
  async getTeams(user_id: string) {
    try {
      return await this.prisma.team.findMany({
        where: {
          OR: [
            {
              team_admins_id: { has: user_id },
            },
            {
              team_members_id: { has: user_id },
            },
          ],
        },
        select: {
          team_id: true,
          team_name: true,
          team_dp: true,
          team_desc: true,
          team_lead: {
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


  /**
   * Retrive team detasils
   * @param team_id - The unique indetifier of the team
   * @param user_id  - The uniquer indefier of the user
   * @returns 
   */
  async getTeamDetails(team_id: string, user_id: string) {
    try {
      const teamDetails = await this.prisma.team.findUniqueOrThrow({
        where: {
          team_id,
          OR: [
            { team_admins_id: { has: user_id } },
            { team_members_id: { has: user_id } },
          ],
        },
        select: {
          team_id: true,
          team_name: true,
          team_desc: true,
          team_dp: true,
          team_lead: {
            select: {
              user_id: true,
              user_name: true,
              user_profile: true,
            },
          },
          team_admins: {
            select: {
              user_id: true,
              user_name: true,
              user_profile: true,
            },
          },
          team_members: {
            select: {
              user_id: true,
              user_name: true,
              user_profile: true,
            },
          },
          invitations: {
            where: {
              team_inviter_id: user_id,
            },
            select: {
              team_invitee_id: true,
            },
          },
        },
      });
      return teamDetails;
    } catch (err) {
      console.log(err.message);
      throw new InternalServerErrorException(err.message);
    }
  }

  async createTeamInvitation({
    team_id,
    inviter_id,
    invitee_id,
  }: CreateTeamInvitationDetailsDto) {
    try {
      await this.prisma.team.findUniqueOrThrow({
        where: { team_id, team_admins_id: { has: inviter_id } },
      });
      await this.prisma.user.findUniqueOrThrow({
        where: { user_id: invitee_id },
      });

      await this.prisma.teamInvitation.create({
        data: {
          team_id,
          team_invitee_id: invitee_id,
          team_inviter_id: inviter_id,
        },
      });
      return 'Invited successfully';
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }
}
