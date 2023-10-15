export interface ChangeTaskPositionParamDto {
    stage_id: string;
    task_id: string;
}

export interface ChangeTaskPositionBodyDto {
    new_position: number;
    new_stage_id?: string;
}

export interface ChangeTaskPositionDto extends ChangeTaskPositionBodyDto, ChangeTaskPositionParamDto {}