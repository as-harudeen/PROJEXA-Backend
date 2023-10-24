import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [PrismaModule, MulterModule.register({
    dest: "./uploads"
})],
  controllers: [TeamController],
  providers: [TeamService]
})
export class TeamModule {}
