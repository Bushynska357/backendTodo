import { Body, ClassSerializerInterceptor, Controller, HttpException, HttpStatus, Param, Post, Res, SerializeOptions, UseInterceptors } from "@nestjs/common";

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
    async signIn(
        @Body() signInUser:SignInUserDto){ 
            // res = await this.authService.signIn(signInUser)
            // console.log(res.user)
        return await this.authService.signIn(signInUser)
    }

}