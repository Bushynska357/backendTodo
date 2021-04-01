import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, SerializeOptions, SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { plainToClass, serialize } from 'class-transformer';
import { AuthGuard } from '../auth.guard';
import { JwtParseMiddleware } from '../auth/jwt-parse.middleware';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoItem } from './dto/transform-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ListService } from './list.service';
import { List } from './schemas/list.schema';
import { Roles } from '../auth/roles/roles.decorator'
import { userRole } from '../auth/roles/role.enum';
import { RolesGuard } from '../auth/roles/roles.guard';


@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
    excludePrefixes: ['_'],
})
@Controller('list')
@UseGuards(AuthGuard)
@UseGuards(RolesGuard)
export class ListController {
    
    constructor(private readonly listService:ListService,
        private readonly jwtService: JwtService
        ){}
    
    
    @Get()
    @Roles('user')
    getAll(): Promise<TodoItem[]>{
        return this.listService.findAll()    
    }

    
    @Post()
    @Roles('user')
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createTodoDto:CreateTodoDto):Promise<TodoItem>{
        return this.listService.create(createTodoDto)
    }

   
    @Delete(':id')
    @Roles('admin')
    remove(@Param('id') id:string):Promise<List>{
        return this.listService.deleteById(id)
    }

    
    @Put(':id')
    @Roles('admin')
    update( @Param('id') id:string, @Body() updateTodoDto:UpdateTodoDto):Promise<TodoItem>{
        return this.listService.updateTodo(id,updateTodoDto)
    }

}

