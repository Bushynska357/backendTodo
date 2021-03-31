import { Injectable, Req } from '@nestjs/common';
import { RequestModel } from './auth/request.interface';

@Injectable()
export class AppService {
  getHello(fullName): string {
    return `Hello ${fullName}!`;
  }
}
