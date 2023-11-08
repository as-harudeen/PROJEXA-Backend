import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway(8000, {
  cors: { origin: 'http://localhost:5173', credentials: true },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(client.id);
    console.log('connected');
  }

  handleDisconnect(client: Socket) {
    console.log('disconnected');
  }

  
}
