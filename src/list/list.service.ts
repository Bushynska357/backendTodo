import { forwardRef, Inject, Injectable} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { classToPlain, deserialize, plainToClass, serialize } from "class-transformer";
import { Model } from "mongoose";
import { User, UserDocument } from "../auth/user.schema";
import { Counter, CounterDocument } from "src/counter/counter.schema";
import { CounterService } from "src/counter/counter.service";


import { CreateTodoDto } from "./dto/create-todo.dto";
import { TodoItem } from "./dto/transform-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { listModule } from "./list.module";
import { List, ListDocument } from "./schemas/list.schema";

@Injectable()
export class ListService{
    constructor(
        @InjectModel(List.name) private listModel: Model<ListDocument>,
        ) {}

    async findAll(): Promise<TodoItem[]>{
        const getItemResponse =  await this.listModel.find().exec()
        return getItemResponse.map(m => new TodoItem(m.toObject()))
    }

    async create(todoDto:CreateTodoDto): Promise<TodoItem>{
        const newTodo = new this.listModel(todoDto)
        const result = await newTodo.save()
        const newTransformItem = new TodoItem(result.toObject())
        return newTransformItem
    }

    async deleteById(id): Promise<List>{
        return this.listModel.findByIdAndRemove(id)
    }

    async updateTodo(id, updateTodoDto:UpdateTodoDto):Promise<TodoItem>{
        const updateResponse = await this.listModel.findByIdAndUpdate(id, updateTodoDto,  {new: true})
        return  new TodoItem(updateResponse.toObject())   
    }
}
