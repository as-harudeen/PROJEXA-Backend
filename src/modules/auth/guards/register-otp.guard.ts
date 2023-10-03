import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class RegisterOTPGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    if (request.cookies.registerToken == null) {
      throw new UnauthorizedException('Require token');
    }
    try {
      const claim = await this.jwtService.verifyAsync(
        request.cookies.registerToken,
        {
          secret: process.env.SECRET,
        },
      );
      if (!claim.user_email || !claim.user_name || !claim.password) {
      }
      console.log(claim, "jwt claim");
      request.user = claim;
    } catch (err) {
      response.clearCookie('registerToken');
      throw new BadRequestException('Invalid token');
    }

    return true;
  }
}
