export class CreateProjectDto {
    projectName: string;
    description: string;
    startDate: Date;
    endDate: Date;
    projectReferences: {title: string, link: string}[]
}