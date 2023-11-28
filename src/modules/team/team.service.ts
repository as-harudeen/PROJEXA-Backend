import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetTeamActivityLogsDto } from './dto/get-team-activity-log.dto';
import { PromoteToAdminDto } from './dto/promote-to-admin.dto';
import { DemoteAdminToMemberDto } from './dto/demote-to-member.dto';
import { EditTeamDto } from './dto/edit-team.dto';
import { CreateTeamDto } from './modules/team-Invitation/dto/create-team.dto';
import { GetTeamDto } from './dto/get-team.dto';

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
          team_members_id: [],
          team_activity_logs: {
            create: {},
          },
          team_projects: {
            create: {
              team_lead_id: user_id,
            },
          },
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
  async getTeams({ user_id, p: pageNum, l: limit, s }: GetTeamDto) {
    console.log(s)
    try {
      const skip = +limit * (pageNum - 1);
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
          team_name: { contains: s },
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
        skip,
        take: limit,
      });
    } catch (err) {
      console.log(err);
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
          team_admins_id: true,
          team_members_id: true,
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
              team_invitation_id: true,
              team_invitee_id: true,
            },
          },
        },
      });
      return { ...teamDetails, user_id };
    } catch (err) {
      console.log(err.message);
      throw new InternalServerErrorException(err.message);
    }
  }

  async getTeamActivityLogs({ team_id, user_id }: GetTeamActivityLogsDto) {
    try {
      const { team_activity_logs } =
        await this.prisma.teamActivity.findUniqueOrThrow({
          where: {
            team_id,
            team: {
              OR: [
                { team_admins_id: { has: user_id } },
                { team_members_id: { has: user_id } },
              ],
            },
          },
          select: {
            team_activity_logs: {
              orderBy: {
                logged_at: 'desc',
              },
              take: 10,
              select: {
                team_activity_log_id: true,
                log_text: true,
                logged_at: true,
              },
            },
          },
        });
      return team_activity_logs;
    } catch (err) {
      console.log('Error from get team activity logs - teamService');
      console.log(err.message);
      throw new InternalServerErrorException(err.message);
    }
  }

  async promoteToAdmin({ team_id, admin_id, member_id }: PromoteToAdminDto) {
    try {
      const { team_members_id } = await this.prisma.team.findUniqueOrThrow({
        where: {
          team_id,
          team_admins_id: { has: admin_id },
          team_members_id: { has: member_id },
        },
        select: {
          team_members_id: true,
        },
      });

      const updatedTeamMemberId = team_members_id.filter(
        (member) => member !== member_id,
      );

      await this.prisma.team.update({
        where: {
          team_id,
          team_admins_id: { has: admin_id },
          team_members_id: { has: member_id },
        },
        data: {
          team_admins_id: { push: member_id },
          team_members_id: updatedTeamMemberId,
        },
      });

      return 'Promote to admin successfully';
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async demoteToMember({
    team_id,
    curr_admin_id,
    admin_id,
  }: DemoteAdminToMemberDto) {
    try {
      const { team_admins_id } = await this.prisma.team.findUniqueOrThrow({
        where: {
          team_id,
          team_admins_id: { hasEvery: [curr_admin_id, admin_id] },
          team_lead_id: { not: admin_id },
        },
        select: {
          team_admins_id: true,
        },
      });

      const updatedTeamadminId = team_admins_id.filter((id) => id !== admin_id);

      await this.prisma.team.update({
        where: {
          team_id,
        },
        data: {
          team_members_id: { push: admin_id },
          team_admins_id: updatedTeamadminId,
        },
      });

      return 'Demoted to member successfully';
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err.message);
    }
  }

  async editTeam({ team_id, admin_id, updatedData }: EditTeamDto) {
    try {
      return await this.prisma.team.update({
        where: {
          team_id,
          team_admins_id: { has: admin_id },
        },
        data: updatedData,
        select: {
          team_name: true,
          team_desc: true,
          team_dp: true,
        },
      });
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
