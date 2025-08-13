import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('/healthz')
  index() {
    return {
      message: 'ok',
    };
  }
}
