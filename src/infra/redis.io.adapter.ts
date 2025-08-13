// src/common/redis-io.adapter.ts
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

export class RedisIoAdapter extends IoAdapter {
  private adapter: any;

  async connectToRedis(): Promise<void> {
    // const pubClient = createClient({ url: `redis://localhost:6379` });
    const pubClient = createClient({
      username: 'default',
      password: 'CDkuq7MAbFLgAU24Duc8lGeyjgBKyJ6A',
      socket: {
        host: 'redis-14407.c263.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 14407,
      },
    });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    this.adapter = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapter);
    return server;
  }
}
