import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { User, UserDocument } from "../auth/user.schema";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { TodoItem } from "./dto/transform-todo.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { List, ListDocument } from "./schemas/list.schema";

@Injectable()
export class ListService{
    constructor(
        @InjectModel(List.name) private listModel: Model<ListDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
        ) {}
 
    async findAll(): Promise<TodoItem[]>{
        const getItemResponse =  await this.listModel.find().exec()
        return getItemResponse.map(m => new TodoItem(m.toObject()))
    }

    async findByUserId(userId: number): Promise<List[]>{
        const user = await this.userModel.findById(userId).exec();
        const populatedUser = await user.populate('items').execPopulate();

        const getItemResponse = populatedUser.items as ListDocument[];
        return getItemResponse.map(m => new TodoItem(m.toObject()));      
    }

    async create(todoDto:CreateTodoDto, userId?: number): Promise<TodoItem>{
        const newTodo = new this.listModel(todoDto)
        const result = await newTodo.save()
        const todo = new TodoItem(result.toObject())
        
        if (userId) {
            await this.userModel.findByIdAndUpdate(userId, {
                $push: { items: result._id},
            }).exec();
        }

        return todo
    }

    async deleteById(id): Promise<List>{
        return this.listModel.findByIdAndRemove(id)
    }

    async deleteByUserId(id, userId):Promise<List>{
        const item = await this.listModel.findById(id).exec();

        if(!item) throw new NotFoundException();

        const user = await this.userModel.findById(userId).exec();
        const populatedUser = await user.populate('items').execPopulate();
        const itemsOfUser = populatedUser.items as ListDocument[];
        
        if(itemsOfUser.find(x => x.id == id)) {
            await this.userModel.findByIdAndUpdate(userId, {
                $pull: { items: id},
            }).exec();

            const response = await this.listModel.findByIdAndRemove(id).exec();
            return new TodoItem(response.toObject())
        }

        throw new ForbiddenException();         
    }
    
    async updateTodo(id, updateTodoDto:UpdateTodoDto):Promise<TodoItem>{
        const updateResponse = await this.listModel.findByIdAndUpdate(id, updateTodoDto,  {new: true})
        return new TodoItem(updateResponse.toObject())
    }

    async updateTodoByUserId(id, userId,updateTodoDto:UpdateTodoDto):Promise<TodoItem>{
        const item = await this.listModel.findById(id).exec();

        if(!item) throw new NotFoundException();

        const user = await this.userModel.findById(userId).exec();
        const populatedUser = await user.populate('items').execPopulate();
        const itemsOfUser = populatedUser.items as ListDocument[];

        if(itemsOfUser.find(x => x.id == id)){
            const updateResponse = await this.listModel.findByIdAndUpdate(id, updateTodoDto,  {new: true})
            return new TodoItem(updateResponse.toObject())
        }

        throw new ForbiddenException();  

    }
}
