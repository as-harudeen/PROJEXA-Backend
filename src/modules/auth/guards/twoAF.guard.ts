import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserPayloadInterface } from '../interface';

@Injectable()
export class TwoAFGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const token = request.cookies['two-AF-Token'];
    if (!token) throw new BadRequestException('Token require');
    try {
      const claim: UserPayloadInterface = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.TWO_AF_TOKEN_SECRET,
        },
      );
      if (!claim) throw new Error();
      request.user = claim;
      return true;
    } catch (err) {
      response.clearCookie('two-AF-Token');
      throw new BadRequestException('Invalid token');
    }
  }
}
