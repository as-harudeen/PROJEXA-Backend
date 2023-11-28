
export interface UpdateTeamTaskBodyDto {
    task_title?: string;
    task_desc?: string;
    task_priority?: number;
    task_time_cap?: number;
}


export class UpdateTeamTaskDto  {
    updated_task_details: UpdateTeamTaskBodyDto;
    team_lead_id: string;
    task_id: string;
}