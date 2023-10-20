export interface EditTaskParamDto {
  stage_id: string;
  task_id: string;
}

export interface EditTaskBodyDto {
  task_title?: string;
  task_desc?: string;
}

export interface EditTaskDto extends EditTaskParamDto {
    user_id: string;
    updatedData: EditTaskBodyDto
}
