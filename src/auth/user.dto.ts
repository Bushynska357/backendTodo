import { Exclude, Expose, Type } from 'class-transformer';
import { userRole } from './roles/role.enum';

export class userDto{
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

    @Expose()
    refreshtoken:string;

    constructor(partial: Partial<userDto>) {
        Object.assign(this, partial);
    }
}