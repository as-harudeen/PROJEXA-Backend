import { PaginationQueryInterface } from "src/pipes/pagination-query-transform.pipe";

export interface GetAllUsersQueryDto extends PaginationQueryInterface {}

export interface GetAllUsersDto extends GetAllUsersQueryDto {
    user_id: string;
}