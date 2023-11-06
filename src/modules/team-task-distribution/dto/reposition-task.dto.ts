

export interface RepositionTaskParamDto {
    team_id: string;
    project_id: string;
    user_id: string;
    task_id: string;
}

export interface RepositionTaskDto extends RepositionTaskParamDto {
    team_lead_id: string;
    new_user_id: string;
}