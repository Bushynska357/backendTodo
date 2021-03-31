import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { CounterModule } from "../counter/counter.module";

import { CounterService } from "../counter/counter.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Constants } from "../constants";
import { User, UserSchema } from "./user.schema";
import { JwtParseMiddleware } from "./jwt-parse.middleware";

@Module({
    providers:[AuthService],
    controllers:[AuthController],
    imports:[JwtModule.register({ secret: Constants.secret}),
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
    
})

export class AuthModule{

}