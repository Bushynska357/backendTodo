import { Module} from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";

import { AuthModule } from "../auth/auth.module";
import { RolesGuard } from "../auth/roles/roles.guard";
import {accessToken } from "../constants";
import { CounterModule } from "../counter/counter.module";
import { CounterService } from "../counter/counter.service";
import { ListController } from "./list.controller";
import { ListService } from "./list.service";
import { List, ListSchema } from "./schemas/list.schema";

@Module({
    providers:[ListService,RolesGuard],
    controllers:[ListController],
    imports:[AuthModule,
        JwtModule.register(accessToken),
        MongooseModule.forFeatureAsync([
            {
                name: List.name,
                imports:[CounterModule],
                useFactory:(counterService: CounterService) => {
                    const list = ListSchema;
                    
                    counterService.init(List.name) 
                    list.pre('save', async function(this: any) {
                        this._id = await counterService.replaceId(List.name);
                    });
                   
                    return list;
                },
                inject: [CounterService],
            }
        ])
    ],
    exports:[ListService]
})

export class listModule{
  
}