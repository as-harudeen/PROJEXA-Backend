import { PaginationQueryInterface } from 'src/pipes/pagination-query-transform.pipe';

export interface GetTeamQueryDto extends PaginationQueryInterface {}

export interface GetTeamDto extends GetTeamQueryDto {
  user_id: string;
}
