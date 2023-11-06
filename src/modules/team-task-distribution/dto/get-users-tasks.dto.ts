export interface GetUsersTasksParamDto {
    team_id: string;
    project_id: string;
}

export interface GetUsersTasksDto extends GetUsersTasksParamDto {
    team_lead_id: string;
}