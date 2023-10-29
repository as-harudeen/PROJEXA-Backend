export class CreateTeamProjectDto {
    team_id: string;
    team_lead_id: string;
    project_name: string;
    project_desc: string;
    project_start_date: Date;
    project_end_date: Date;
    project_reference: {title: string, link: string}[]
}