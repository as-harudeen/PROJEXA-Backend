

export interface RepositionTaskParamDto {
    user_id: string;
    task_id: string;
}

export interface RepositionTaskDto extends RepositionTaskParamDto {
    team_lead_id: string;
    new_user_id: string;
}