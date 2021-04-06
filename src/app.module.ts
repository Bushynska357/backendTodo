import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';


import { AppController } from './app.controller';
import { AppService } from './app.service';
import { listModule } from './list/list.module';
import { AuthModule } from './auth/auth.module';
import { dbAccessToken } from './constants';
import { JwtParseMiddleware } from './auth/jwt-parse.middleware';
import { ListController } from './list/list.controller';


@Module({
  imports: [
    listModule,
    AuthModule,
    MongooseModule.forRoot(dbAccessToken)
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtParseMiddleware)
      .forRoutes(AppController, ListController);
  }
}
