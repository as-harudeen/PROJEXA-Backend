import { Module } from "@nestjs/common";
import { TeamInvitationController } from "./team-invitation.controller";
import { TeamInvitationService } from "./team-invitation.service";
import { PrismaModule } from "src/modules/prisma/prisma.module";


@Module({
    imports: [PrismaModule],
    controllers: [TeamInvitationController],
    providers: [TeamInvitationService]
})
export class TeamInvitationModule {}