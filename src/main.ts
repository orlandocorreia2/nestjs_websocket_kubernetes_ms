import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './infra/redis.io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // REDIS FOR WEBSOCKET MICROSERVICES
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
