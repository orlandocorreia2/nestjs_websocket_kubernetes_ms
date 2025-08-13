import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LocatorGateway } from './locator/locator.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [LocatorGateway],
})
export class AppModule {}
