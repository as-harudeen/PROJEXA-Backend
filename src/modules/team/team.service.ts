import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeamDto } from './dto/create-team.dto';

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
      return "Team created successfully";
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }


}
