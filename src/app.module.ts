import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { OtpModule } from './modules/otp/otp.module';
import { AuthModule } from './modules/auth/auth.module';
import { PersonalModule } from './modules/project/personal/personal.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule, AuthModule, PersonalModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
