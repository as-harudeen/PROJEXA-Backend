import { Module } from "@nestjs/common";
import { PersonalProjectModule } from "./modules/personal-project/personal-project.module";
import { TeamProjectModule } from "./modules/team-project/team-project.module";

@Module({
    imports: [PersonalProjectModule, TeamProjectModule]
})
export class ProjectModule {}