export interface CreateTaskDistributionStageParamDto {
  team_id: string;
  team_project_id: string;
}

export interface CreateTaskDistributionStageDto
  extends CreateTaskDistributionStageParamDto {
  team_lead_id: string;
  task_distribution_board_stage_title: string;
}
