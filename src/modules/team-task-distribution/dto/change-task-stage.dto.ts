export interface ChangeTaskStageParamDto {
    team_id: string;
    project_id: string;
    task_id: string;
    stage_id: string;
}

export interface ChangeTaskStageDto extends ChangeTaskStageParamDto {
    team_lead_id: string;
    new_stage_id: string;
}