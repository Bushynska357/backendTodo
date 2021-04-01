import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
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
}

export const UserSchema = SchemaFactory.createForClass(User);