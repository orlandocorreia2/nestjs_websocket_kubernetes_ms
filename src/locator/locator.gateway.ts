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

  private readonly podName = process.env.MY_POD_NAME;
  private readonly users = [
    {
      name: 'user1',
      group: {
        name: 'user1_group',
        users: [{ name: 'user1' }, { name: 'user2' }],
      },
    },
    {
      name: 'user2',
      group: {
        name: 'user2_group',
        users: [{ name: 'user2' }, { name: 'user1' }],
      },
    },
    {
      name: 'user3',
      group: {
        name: 'user3_group',
        users: [{ name: 'user3' }, { name: 'user2' }],
      },
    },
  ];

  @SubscribeMessage('joinGroup')
  handleJoinGroup(client: Socket, payload: any): any {
    const { userName } = payload;
    const groups = this.getGroups(userName);
    client.join(groups);
    this.server.to(groups).emit('userJoined', {
      podName: this.podName,
      user: userName,
      groups,
    });
  }

  @SubscribeMessage('coords')
  handleCoords(_: Socket, payload: any): any {
    const { userName, coords } = payload;
    const groups = this.getGroups(userName);
    this.server
      .to(groups)
      .emit('coords', { podName: this.podName, user: userName, coords });
  }

  private getGroups(userName: string) {
    const groups = this.users
      .filter((user) => user.group.users.some((u) => u.name === userName))
      ?.map((user) => user.group.name);
    if (!groups?.length) {
      throw new Error(`User ${userName} not found in any group`);
    }
    return groups;
  }
}
