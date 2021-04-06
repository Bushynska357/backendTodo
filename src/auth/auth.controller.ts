import { Body, ClassSerializerInterceptor, Controller, HttpException, HttpStatus, Post, Req, SerializeOptions, UseInterceptors } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { SignInUserDto } from "./auth-dto/sign-in.dto";
import { SignUpUserDto } from "./auth-dto/sign-up.dto";
import { User } from "./user.schema";
import { nextTick } from "node:process";
import { RequestModel } from "./request.interface";
import { RefreshTokenDto } from "./refresh-token.dto";

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
    excludePrefixes: ['_'],
})

@Controller('auth')
export class AuthController{
    constructor(private readonly authService:AuthService){}

    @Post('sign-up')
    async signUp(@Body() signUpUser:SignUpUserDto):Promise<User>{
        return await this.authService.signUp(signUpUser)            
    }

    @Post('sign-in')
    async signIn(@Body() signInUser:SignInUserDto){ 
        return await this.authService.signIn(signInUser)
    }

    @Post('refresh')
    async refresh(@Body() token:RefreshTokenDto){
      if (!token){
        throw new HttpException('Refresh token not found', HttpStatus.BAD_REQUEST)
      }
      return await this.authService.refresh(token)        
    }
}