export interface GetTaskParamDto {
    team_id: string;
    project_id: string;
}

export interface GetTaskDto extends GetTaskParamDto {
    user_id: string;
}