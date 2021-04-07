import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { CounterModule } from "../counter/counter.module";

import { CounterService } from "../counter/counter.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { accessToken } from "../constants";
import { User, UserSchema } from "./user.schema";
import { RolesGuard } from "./roles/roles.guard";
import { APP_GUARD } from "@nestjs/core";

@Module({
    providers:[AuthService,{
        provide: APP_GUARD,
        useClass: RolesGuard,
      } ],
    controllers:[AuthController],
    imports:[JwtModule.register({
        secret: accessToken.secret,
        signOptions: { expiresIn: accessToken.expiresIn },
    }),
        MongooseModule.forFeatureAsync([
            {
                name: User.name,
                imports:[CounterModule],
                useFactory:(counterService: CounterService) => {
                    const user = UserSchema;
                    
                    counterService.init(User.name) 
                    user.pre('save', async function(this: any) { 
                        this._id = await counterService.replaceId(User.name); 
                    });
                   
                    return user;
                },
                inject: [CounterService],
            }
        ])
    ],
    exports: [JwtModule,MongooseModule] // You need to reexport JwtModule because of you want to use it in AppModule (jwt-parse middleware)
    
})

export class AuthModule{

}