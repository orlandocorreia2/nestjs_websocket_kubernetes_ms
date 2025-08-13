import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class LocatorGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    console.log('Client:', client.id);

    const podName = process.env.MY_POD_NAME || 'Pod Name Not Found';
    this.server.emit('message_response', { podName, payload });
    return 'Message Sended!';
  }
}
