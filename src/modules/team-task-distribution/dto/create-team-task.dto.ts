export interface CreateTeamTaskDistributionStageTaskParam {
  team_id: string;
  stage_id: string;
  project_id: string;
}

export interface CreateTeamTaskDistributionStageTaskBody {
  task_title: string;
  task_priority: string;
}

export interface CreateTeamTaskDistributionStageTask
  extends CreateTeamTaskDistributionStageTaskBody,
    CreateTeamTaskDistributionStageTaskParam {
  team_lead_id: string;
}
