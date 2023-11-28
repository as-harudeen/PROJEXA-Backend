export interface RelocateTeamTaskParamDto {
    task_id: string;
    user_id: string;
}

export interface RelocateTeamTaskDto extends RelocateTeamTaskParamDto {
    team_lead_id: string;
    stage_id: string;
}