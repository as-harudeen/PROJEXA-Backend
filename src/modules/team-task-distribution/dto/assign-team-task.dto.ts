export interface AssignTeamTaskParamDto {
  team_id: string;
  project_id: string;
  task_id: string;
}

export interface AssignTeamTaskBodyDto {
  user_id: string;
}

export interface AssignTeamTaskDto
  extends AssignTeamTaskParamDto,
    AssignTeamTaskBodyDto {
        team_lead_id: string;
    }
