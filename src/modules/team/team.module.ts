import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { TeamInvitationModule } from './modules/team-Invitation/team-invitation.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [PrismaModule, MulterModule.register({
    dest: "./uploads"
}), TeamInvitationModule, ChatModule],
  controllers: [TeamController],
  providers: [TeamService]
})
export class TeamModule {}
