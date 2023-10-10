import { Module } from '@nestjs/common';
import { PersonalProjectController } from './personal-project.controller';
import { PersonalProjectService } from './personal-project.service';
import { PrismaModule } from 'src/modules/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PersonalProjectController],
  providers: [PersonalProjectService],
})
export class PersonalProjectModule {}
