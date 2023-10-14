export interface CreateTaskBodyDto {
    task_title: string;
}
export interface CreateTaskParamDto {
    stage_id: string;
    user_id: string;
}

export interface CreateTaskDto extends CreateTaskBodyDto, CreateTaskParamDto {}
