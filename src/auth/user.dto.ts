import { Exclude, Expose, Type } from 'class-transformer';
import { List } from '../list/schemas/list.schema';
import { userRole } from './roles/role.enum';

export class UserDto{
    // @Expose()
    readonly _id:number

    @Expose()
    get id(): number {
        return this._id;
    };

    @Expose()
    readonly email:string;

    @Exclude()
    readonly passwordHash:string;

    @Expose()
    readonly fullname:string;

    @Expose()
    readonly role:userRole;

    @Exclude()
    refreshToken:string;

    @Exclude()
    items:List[];

    constructor(partial: Partial<UserDto>) {
        Object.assign(this, partial);
    }
}