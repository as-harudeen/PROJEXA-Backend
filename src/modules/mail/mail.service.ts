import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailInterface } from './interface';
import { generateOTP } from 'src/utils/generateOTP';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}


  /**
   * This method for sending mail.
   * @param param0 - The to email and message of the mail.
   */
  private async sendMail({ to, subject, text }: SendMailInterface) {
    await this.mailerService.sendMail({
      from: process.env.USER_EMAIL,
      to,
      subject,
      text,
    });
  }


  /**
   * The method for genarate and send OTP via email.
   * @param to - holds the recipient's email address.
   * @returns - 6 digit of OTP.
   */
  async sendOTP(to: string) {
    const OTP = generateOTP(6);
    const text = `Your OTP is ${OTP}`;
    const subject = 'One-Time-Password';
    await this.sendMail({ to, subject, text });
    return OTP;
  }
}
