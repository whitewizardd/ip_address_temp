import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('api/hello')
  async getHello(@Query('visitor_name') visitor_name: string): Promise<object> {
    return await this.appService.getHello(visitor_name);
  }

  @Get()
  default_response(): string {
    return 'here is hng backend track stage 1 task!';
  }
}
