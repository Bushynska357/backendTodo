import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RequestModel } from './request.interface';

@Injectable()
export class JwtParseMiddleware implements NestMiddleware {
    constructor( private readonly jwtService: JwtService){}
   
    async use(req: RequestModel, res: Response, next: NextFunction) {
    
        const token = req.headers['authorization'].split(' ')[1];
    
        if (token) {
            req.user = await this.jwtService.verifyAsync(token);
        }
        
        // TODO: remove it 
        console.log('req.user', req.user)
        next();
    } 
}
