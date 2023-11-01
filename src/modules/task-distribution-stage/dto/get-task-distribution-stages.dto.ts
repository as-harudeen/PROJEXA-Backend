export interface GetTaskDistributionStagesParamDto {
  team_id: string;
  team_project_id: string;
}

export interface GetTaskDistributionStagesDto
  extends GetTaskDistributionStagesParamDto {
  team_lead_id: string;
}
