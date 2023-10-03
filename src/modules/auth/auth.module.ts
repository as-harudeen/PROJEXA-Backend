import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { OtpModule } from '../otp/otp.module';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TwoAFStrategy } from './strategy/twoAF.strategy';

@Module({
  imports: [PassportModule, JwtModule.register({
    signOptions: {expiresIn: "1h"},
    global: true
  }), UserModule, OtpModule, PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, TwoAFStrategy],
  exports: [AuthService]
})
export class AuthModule {}
