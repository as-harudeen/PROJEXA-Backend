
export class UpdatedProjectDetails {
  project_name?: string;
  project_desc?: string;
  project_start_date?: Date;
  project_end_date: Date;
  project_reference?: {
    title: string;
    link: string;
  };
}


export class UpdateProjectDto {
  updated_project_details: UpdatedProjectDetails;
  user_id: string;
  project_id: string;
}
