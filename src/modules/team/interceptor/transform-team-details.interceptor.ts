import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';

interface UserBasicInfoInterface {
  user_id: string;
  user_name: string;
  user_profile: string;
}

interface ResponseDataInterface {
  user_id: string;
  team_id: string;
  team_name: string;
  team_desc: string;
  team_dp: string;
  team_lead: UserBasicInfoInterface;
  team_admins_id: string[];
  team_members_id: string[];
  team_admins: UserBasicInfoInterface[];
  team_members: UserBasicInfoInterface[];
  invitations: { team_invitee_id: string; team_invitation_id: string }[];
}

export class TransformTeamDetailsInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data: ResponseDataInterface) => {
        const { user_id, team_admins_id, team_members_id, ...restData } = data;

        return {
          ...restData,
          all_team_member_ids: [...team_admins_id, ...team_members_id],
          isCurrentUserAdmin: team_admins_id.includes(user_id),
          isCureentUserLeader: restData.team_lead.user_id === user_id,
        };
      }),
    );
  }
}
