import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { QueryService } from './query.service';

@Module({
  providers: [PrismaService, QueryService],
  exports: [PrismaService, QueryService],
})
export class PrismaModule {}
