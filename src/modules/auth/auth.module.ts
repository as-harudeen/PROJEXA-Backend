import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PassportModule, JwtModule.register({
    secret: process.env.SECRET,
    signOptions: {expiresIn: "1h"},
    global: true
  })],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
