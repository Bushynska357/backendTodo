import { Body, ClassSerializerInterceptor, Controller, Post, SerializeOptions, UseInterceptors } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { SignInUserDto } from "./auth-dto/sign-in.dto";
import { SignUpUserDto } from "./auth-dto/sign-up.dto";
import { User } from "./user.schema";

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
}