import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generate register token.
   * @param user - User credantials for payload
   * @returns jwtToken
   */
  async generateRegisterToken({
    user_email,
    user_name,
    password,
  }: {
    user_name: string;
    user_email: string;
    password: string;
  }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.jwtService.signAsync({
      user_name,
      user_email,
      password: hashedPassword,
    });
  }
}
