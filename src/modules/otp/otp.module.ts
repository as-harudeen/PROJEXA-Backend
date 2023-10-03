import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { MailModule } from '../mail/mail.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [MailModule, RedisModule],
  providers: [OtpService],
  exports: [OtpService]
})
export class OtpModule {}
