import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { plainToClass, serialize } from 'class-transformer';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoItem } from './dto/transform-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ListService } from './list.service';
import { List } from './schemas/list.schema';

@Controller('list')
export class ListController {
    
    constructor(private readonly listService:ListService){}
    
    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    getAll(){
        return this.listService.findAll()
    
       
        // return this.listService.findAll()
    
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createTodoDto:CreateTodoDto):Promise<List>{
        return this.listService.create(createTodoDto)
    }

    @Delete(':id')
    remove(@Param('id') id:string):Promise<List>{
        return this.listService.deleteById(id)
    }

    @Put(':id')
    update( @Param('id') id:string, @Body() updateTodoDto:UpdateTodoDto):Promise<List>{
        return this.listService.updateTodo(id,updateTodoDto)
    }

}
