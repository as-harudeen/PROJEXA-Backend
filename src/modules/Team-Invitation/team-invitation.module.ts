import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { TeamInvitationController } from "./team-invitation.controller";
import { TeamInvitationService } from "./team-invitation.service";


@Module({
    imports: [PrismaModule],
    controllers: [TeamInvitationController],
    providers: [TeamInvitationService]
})
export class TeamInvitationModule {}