import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.PASSWORD,
        },
      },
    })
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
