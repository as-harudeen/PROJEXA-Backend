import { MailService } from '../mail/mail.service';
import { RedisService } from '../redis/redis.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  constructor(
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Generate OTP , store in redis store and Mail.
   * @param user_email - Email address of the recipient of the email.
   * @param key - key for storing redis store
   * @returns "OTP Sent successfully"
   */
  async generateAndMailOTP (user_email: string, key: string) {
    const OTP = await this.mailService.sendOTP(user_email);
    this.redisService.setItem(key, OTP);
    return "OTP Sent successfully";
  }


  /**
   * Retrive OTP from redis store by
   * it's key, and validate it.
   * 
   * @param otp - OTP for validate.
   * @param key - redis store key for 
   *              retrive original OTP.
   * @throws BadRequestException -
   *         if OTP not found within the key or
   *         if OTP not valid
   */
  async validateOTP (otp: string, key: string) {
    const OTP = await this.redisService.getItem(key);
    if(!OTP) throw new BadRequestException("OTP Expired");
    if(OTP !== otp) throw new BadRequestException("Invalid OTP");
  }

}
