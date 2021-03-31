import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestModel } from './auth/request.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req()req: RequestModel): string {
    return this.appService.getHello(req.user?.fullname);
  }
}
