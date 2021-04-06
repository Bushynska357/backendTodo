import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from './user.schema';
import { UserDto } from './user.dto';
import { SignUpUserDto } from './auth-dto/sign-up.dto';
import { SignInUserDto } from './auth-dto/sign-in.dto';
import { refreshTokenConfig, refreshTokenSecret } from '../constants';
import { classToPlain } from 'class-transformer';
import { RefreshTokenDto } from './refresh-token.dto';


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

        return new UserDto(responseUser.toObject());
    }
 

    async signIn(signIn: SignInUserDto) {
        
        const user = await this.userModel.findOne({ email: signIn.email });
      
   
        if (user != null){
            const isMatch = await bcrypt.compare(
                signIn.password,
                user.passwordHash,
            );
            if (isMatch) {
               
                const userForClassToPlain = new UserDto(user.toObject());
                const payload = classToPlain(userForClassToPlain, { excludePrefixes: ['_'] });

                return this.generateTokenPair(payload);
            }
            
        }else{
            throw new UnauthorizedException();
        }
    }

    async generateAccessToken(user){
        return this.jwtService.signAsync(user);
    }

    async generateRefreshToken(user){
        return this.jwtService.signAsync(user, refreshTokenConfig);  
    }

    async generateTokenPair(user){
        const refreshToken = await this.generateRefreshToken(user);
        const accessToken= await this.generateAccessToken(user);
        await this.userModel.findByIdAndUpdate(user.id, { refreshToken });
        
        return {
            success:true,
            accessToken,
            refreshToken
        }
    }
 
    async refresh(refreshTokenReq:RefreshTokenDto){
        try {
            const { id: userId } =  await this.jwtService.verifyAsync( refreshTokenReq.refreshToken, refreshTokenSecret );

            const userFromDb = await this.userModel.findById(userId);
            const userDtoForClassToPlain = new UserDto(userFromDb.toObject());
            const payload = classToPlain(userDtoForClassToPlain, { excludePrefixes: ['_'] });
            
            if (userFromDb.refreshToken === refreshTokenReq.refreshToken){
               return this.generateTokenPair(payload)
            }
            
            throw new HttpException('Invalid refresh token', HttpStatus.BAD_REQUEST)
        } catch (ex) {
            throw new BadRequestException(ex)
         }

        
    }
       
}

