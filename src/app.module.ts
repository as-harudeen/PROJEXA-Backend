import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { PersonalProjectModule } from './modules/personal-project/personal-project.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule, AuthModule, PersonalProjectModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
