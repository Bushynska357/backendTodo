import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from 'mongoose';
import { List } from "src/list/schemas/list.schema";
import { userRole } from "./roles/role.enum";

export type UserDocument = User & Document;

@Schema()
export class User{
    @Prop()
    _id:number

    @Prop({required:true,unique:true})
    email:string

    @Prop({required:true})
    passwordHash:string

    @Prop({required:true})
    fullname:string

    @Prop({default: userRole.user})
    role:userRole

    @Prop()
    refreshToken:string;

    // @Prop({required:true, type: [{type: SchemaTypes.Number, ref: List.name}]})
    // items:List[];

}

export const UserSchema = SchemaFactory.createForClass(User);