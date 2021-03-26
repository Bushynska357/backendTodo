import { IsEmail, MinLength } from "class-validator"

export class SignUpUserDto{
    @IsEmail()
    readonly email:string

    @MinLength(8)
    readonly password:string

    readonly fullname:string
}