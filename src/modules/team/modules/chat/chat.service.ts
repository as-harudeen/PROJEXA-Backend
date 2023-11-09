import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserPayloadInterface } from 'src/modules/auth/interface';

@Injectable()
export class ChatService {
  constructor(
    private readonly authService: AuthService,
  ) {}

  async getUserIdFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    if (!cookie) throw new WsException('Unauthorized user');

    const { access_token: token } = parse(cookie);

    if (!token) throw new WsException('Unauthorized user');

    const user = await this.authService.getUserPayloadFromToken(token);
    if (!user) throw new WsException('Invalid token');

    return (user as UserPayloadInterface).user_id;
  }

}
