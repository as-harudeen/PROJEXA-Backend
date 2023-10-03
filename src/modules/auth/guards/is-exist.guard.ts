import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { RegisterUserDto } from 'src/modules/auth/dto/register-user.dto';

@Injectable()
export class IsExistGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requset: Request = context.switchToHttp().getRequest();
    const { user_email, user_name } = requset.body as RegisterUserDto;
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ user_email }, { user_name }] },
    });
    if (user != null)
      throw new BadRequestException('Username or email already exist');
    return true;
  }
}
