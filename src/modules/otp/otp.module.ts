import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { RedisModule } from '../redis/redis.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UserModule, MailModule, RedisModule, AuthModule],
  controllers: [OtpController],
  providers: [OtpService]
})
export class OtpModule {}
