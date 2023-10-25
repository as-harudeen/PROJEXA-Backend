import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs/operators';

interface UserBasicInfoInterface {
  user_id: string;
  user_name: string;
  user_profile: string;
}

interface ResponseDataInterface {
  team_id: string;
  team_name: string;
  team_desc: string;
  team_dp: string;
  team_lead: UserBasicInfoInterface;
  team_admins: UserBasicInfoInterface[];
  team_members: UserBasicInfoInterface[];
  invitations: { team_invitee_id: string }[];
}

export class TransformTeamDetailsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data: ResponseDataInterface) => {

        const { invitations, ...restData } = data;

        return {
          ...restData,
          all_team_member_ids: [
            ...data.team_admins.map((admin) => admin.user_id),
            ...data.team_members.map((member) => member.user_id),
          ],
          team_invitee_ids: invitations.map(invitee => invitee.team_invitee_id)
        };
      }),
    );
  }
}
