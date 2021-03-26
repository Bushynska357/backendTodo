import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt';


import { User, UserDocument } from "./user.schema";
import { userTransform } from "./transform-user.dto";

@Injectable()
export class AuthService{

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        ) {}

    async signUp(signUpUser):Promise<User>{
        const hashedPassword = await bcrypt.hash(signUpUser.password,10);
        try {
            const createdUser = new this.userModel({
              ...signUpUser,
              password: hashedPassword
            });
            // createdUser.password = undefined;
            const responseUser = await createdUser.save();
            const newTransformUser = new userTransform(responseUser.toObject())
            return newTransformUser
          } catch (error) {
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
          }
    }
}

