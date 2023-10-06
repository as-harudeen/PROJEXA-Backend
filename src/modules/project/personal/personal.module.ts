import { Module } from '@nestjs/common';
import { PersonalController } from './personal.controller';
import { PersonalService } from './personal.service';
import { PrismaModule } from 'src/modules/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
  controllers: [PersonalController],
  providers: [PersonalService]
})
export class PersonalModule {}
