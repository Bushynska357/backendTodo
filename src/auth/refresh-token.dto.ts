import { Exclude, Expose, Type } from 'class-transformer';
import { userRole } from './roles/role.enum';

export class RefreshTokenDto{
    refreshToken:string;
}