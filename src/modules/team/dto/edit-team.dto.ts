export interface EditTeamBodyDto {
    team_name?: string;
    team_desc?: string;
    team_dp?: string;
}

export interface EditTeamDto {
    updatedData: EditTeamBodyDto;
    admin_id: string;
    team_id: string;
}