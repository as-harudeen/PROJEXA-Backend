export class GetOneTeamProjectDetailsParamDto {
    team_id: string;
    project_id: string;
}


export class GetOneTeamProjectDetailsDto extends GetOneTeamProjectDetailsParamDto {
    user_id: string;
}