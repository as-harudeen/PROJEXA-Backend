import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { LoginUerDto } from 'src/modules/auth/dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUserGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const { user_email, password } = request.body as LoginUerDto;
    if (!user_email || !password)
      throw new BadRequestException('Email and password are mandatory');

    try {
      const user = await this.prisma.user.findUnique({
        where: { user_email },
      });
      if (user == null || !(await bcrypt.compare(password, user.password)))
        throw new Error('Incorrect email or password');

      request.user = user;
      return true;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
