import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from './user.schema';
import { userDto } from './user.dto';
import { SignUpUserDto } from './auth-dto/sign-up.dto';
import { SignInUserDto } from './auth-dto/sign-in.dto';
import { accessToken, refreshTokenByUser } from '../constants';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
    ) {}

    async getUserByEmail(email): Promise<User> {
        return this.userModel.findOne({ email });
    }

    async signUp(signUpUser: SignUpUserDto): Promise<User> {
        const isUserExist = await this.userModel.exists({ email: signUpUser.email });
        if (isUserExist)
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

        const hashedPassword = await bcrypt.hash(
            signUpUser.password,
            10,
        );

        const createdUser = new this.userModel({
            ...signUpUser,
            passwordHash: hashedPassword,
        });
        
        const responseUser = await createdUser.save();

        return new userDto(responseUser.toObject());
    }
 

    async signIn(signIn: SignInUserDto) {
        
        const user = await this.userModel.findOne({ email: signIn.email });
      
   
        if (user != null){
            const isMatch = await bcrypt.compare(
                signIn.password,
                user.passwordHash,
            );
            if (isMatch) {
               
                const payload= {
                    id: user.id,
                    email: user.email,
                    fullname: user.fullname,
                    role:user.role
                };
               
                const authToken = {
                   
                    // accessToken:  await this.jwtService.signAsync(payload, { secret:accessToken.secret, expiresIn:accessToken.expiresIn})
                    accessToken: await this.generateAccessToken(payload)
                };
                const authRefreshToken = {
                  
                    refreshToken: await this.generateRefreshToken(payload)
                };
                return {
                    success:'true',
                    ...authToken,
                    ...authRefreshToken
                };
            
            }
            
        }else{
            throw new UnauthorizedException();
        }
    }

    async generateAccessToken(user){
        const newAccessToken = await this.jwtService.signAsync(user, { secret:accessToken.secret, expiresIn:accessToken.expiresIn})
        return newAccessToken  
    }

    async generateRefreshToken(user){
        const newRefreshToken = await this.jwtService.signAsync(user, { secret:refreshTokenByUser.secret, expiresIn:refreshTokenByUser.expiresIn});
        await this.userModel.findByIdAndUpdate(user.id,{refreshtoken:newRefreshToken});
        return newRefreshToken  
    }

   
    async verifyRefreshToken(refreshTokenReq:string){
        console.log("refreshTokenReq", refreshTokenReq['refreshToken'])
        const userRefreshTokenResponse =  await this.jwtService.verifyAsync( refreshTokenReq['refreshToken'], {secret:refreshTokenByUser.secret});
        const refreshToken = await this.generateRefreshToken({id: userRefreshTokenResponse.id, fullname: userRefreshTokenResponse.fullname, email:userRefreshTokenResponse.email});
        const accessToken= await this.generateAccessToken({id: userRefreshTokenResponse.id, fullname: userRefreshTokenResponse.fullname, email:userRefreshTokenResponse.email})
        await this.userModel.findByIdAndUpdate(userRefreshTokenResponse.id,{refreshtoken:refreshToken});
        return {
            accessToken,
            refreshToken
        }
            
    }
       
}
