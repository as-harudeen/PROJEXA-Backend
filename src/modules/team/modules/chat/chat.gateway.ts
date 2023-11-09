import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { AuthService } from 'src/modules/auth/auth.service';

@WebSocketGateway(8000, {
  cors: { origin: 'http://localhost:5173', credentials: true },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(client.id);
    console.log('connected');
  }

  handleDisconnect(client: Socket) {
    console.log('disconnected');
  }

  @SubscribeMessage('team:chat:join')
  async handleTeamChatJoin(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { team_id }: { team_id: string },
  ) {
    try {
      console.log(`team:chat:join`);
      const user_id = await this.chatService.getUserIdFromSocket(socket);
      const messages = await this.chatService.getAllTeamMessages({
        team_id,
        user_id,
      });

      socket.join(team_id);
      socket.emit('team:chats', messages);
    } catch (err) {
      throw new WsException(err.message);
    }
  }

  @SubscribeMessage('team:message:send')
  async handleSendMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { team_id, message }: { team_id: string; message: string },
  ) {
    const user_id = await this.chatService.getUserIdFromSocket(socket);
    const user = await this.authService.checkUserExistenceInTeam({
      team_id,
      user_id,
    });
    const newMessage = await this.chatService.storeTeamChat({
      message,
      team_id,
      user_id,
    });

    this.server
      .to(team_id)
      .except(socket.id)
      .emit('team:message:receive', newMessage);
  }

  @SubscribeMessage('team:chat:typing')
  async handleTeamChatTyping(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { team_id }: { team_id: string },
  ) {
    const user_id = await this.chatService.getUserIdFromSocket(socket);
    const { user_name } = await this.authService.checkUserExistenceInTeam({
      team_id,
      user_id,
    });

    this.server
      .to(team_id)
      .except(socket.id)
      .emit('team:chat:typing', { user_name });
  }

}
