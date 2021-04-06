import {Request} from "@nestjs/common";
import { UserDto } from "./user.dto";

export interface RequestModel extends Request {
    user: UserDto;
}