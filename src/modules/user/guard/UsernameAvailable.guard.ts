import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class UsernameAvailableGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const { user_name } = request.body;
    if (!user_name) return true;
    let user = null;
    try {
      user = await this.prisma.user.findUnique({
        where: { user_name },
        select: { user_name: true },
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
    if (user !== null) throw new BadRequestException('Username Already exist');
    return true;
  }
}
