import { Module } from '@nestjs/common';
import { TeamProjectController } from './team-project.controller';
import { TeamProjectService } from './team-project.service';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
  imports: [PrismaModule],
  controllers: [TeamProjectController],
  providers: [TeamProjectService],
})
export class TeamProjectModule {}
