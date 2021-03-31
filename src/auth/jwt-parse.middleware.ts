import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { Constants } from 'src/constants';
import * as jwt from 'jsonwebtoken';
import { RequestModel } from './request.interface';
import { userDto } from './user.dto';

@Injectable()
export class JwtParseMiddleware implements NestMiddleware {

// constructor( private readonly jwtService: JwtService){}
   
 async use(req: RequestModel, res: Response, next: NextFunction) {
 
    const token = req.headers['authorization'].split(' ')[1];
 
    console.log(req.headers['authorization'])
   console.log(token)
        req.user = await new JwtService({
            secret: Constants.secret
        }).verifyAsync(token);
        console.log('req.user', req.user)
      
    
    next();
 } 
   
 
}
