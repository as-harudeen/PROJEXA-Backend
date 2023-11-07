export interface UpdateTeamTaskParamDto {
    team_id: string;
    project_id: string;
    task_id: string;
}

export interface UpdateTeamTaskBodyDto {
    task_title?: string;
    task_desc?: string;
    task_priority?: number;
}


export interface UpdateTeamTaskDto extends UpdateTeamTaskParamDto {
    updated_task_details: UpdateTeamTaskBodyDto;
    team_lead_id: string;
}