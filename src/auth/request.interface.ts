import {Request} from "@nestjs/common";
import { userDto } from "./user.dto";

export interface RequestModel extends Request {
    user: userDto;
}