import { PaginationQueryInterface } from "src/pipes/pagination-query-transform.pipe";

export interface GetTeamProjectsQueryDto extends PaginationQueryInterface {}

export interface GetTeamProjectsDto extends GetTeamProjectsQueryDto {
    user_id: string;
    team_id: string;
} 