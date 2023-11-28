

export interface CreateTeamTaskDistributionStageTaskBody {
  task_title: string;
  task_priority: string;
  task_time_cap: string;
}

export interface CreateTeamTaskDistributionStageTask
  extends CreateTeamTaskDistributionStageTaskBody {
  team_lead_id: string;
  stage_id: string;
}
