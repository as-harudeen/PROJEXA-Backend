import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { AuthService } from 'src/modules/auth/auth.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserPayloadInterface } from 'src/modules/auth/interface';

@Injectable()
export class ChatService {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
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

  async storeTeamChat({
    team_id,
    user_id,
    message,
  }: {
    team_id: string;
    user_id: string;
    message: string;
  }) {
    try {
      return await this.prisma.teamChat.create({
        data: {
          team_id,
          chatter_id: user_id,
          chat_text: message,
        }, select: {
          chat_text: true,
          chatter: {
            select: {
              user_name: true,
              user_profile: true,
              user_id: true
            }
          },
          sended_at: true,
        }
      });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getAllTeamMessages({
    team_id,
    user_id,
  }: {
    team_id: string;
    user_id: string;
  }) {
      const {team_chats} = await this.prisma.team.findUniqueOrThrow({
        where: {
          team_id,
          OR: [
            {
              team_admins_id: { has: user_id },
            },
            {
              team_members_id: { has: user_id },
            },
          ],
        },
        select: {
          team_chats: {
            select: {
              chat_text: true,
              sended_at: true,
              chatter: {
                select: {
                  user_name: true,
                  user_profile: true,
                  user_id: true
                },
              },
              
            },
          },
        },
      });
      return team_chats;

  }
}
