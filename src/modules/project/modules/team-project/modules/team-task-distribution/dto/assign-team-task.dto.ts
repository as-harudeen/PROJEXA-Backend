export interface AssignTeamTaskBodyDto {
  user_id: string;
}

export interface AssignTeamTaskDto extends AssignTeamTaskBodyDto {
  team_lead_id: string;
  task_id: string;
}
