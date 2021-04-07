import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Req, SerializeOptions, SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthGuard } from '../auth.guard';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoItem } from './dto/transform-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ListService } from './list.service';
import { List } from './schemas/list.schema';
import { Roles } from '../auth/roles/roles.decorator'
import { userRole } from '../auth/roles/role.enum';
import { RolesGuard } from '../auth/roles/roles.guard';
import { RequestModel } from '../auth/request.interface';


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
    @Roles(userRole.user, userRole.admin)
    getAll(@Req() req:RequestModel): Promise<List[]>{
        const { user } = req;
        if(user.role === userRole.admin) {
            return this.listService.findAll()  
        }
          
        return this.listService.findByUserId(user.id);
    }

    
    @Post()
    @Roles(userRole.user)
    @HttpCode(HttpStatus.CREATED)
    create(@Req() req: RequestModel,@Body() createTodoDto:CreateTodoDto):Promise<TodoItem>{
        const { user } = req;
        // console.log(req)
        return this.listService.create(createTodoDto, user.id)
    }

   
    @Delete(':id')
    @Roles(userRole.user, userRole.admin)
    remove(@Req() req: RequestModel,@Param('id') id:string):Promise<List>{
        const { user } = req;
        if(user.role === userRole.admin){
            return this.listService.deleteById(id)
        }
        if (user.role === userRole.user){
            return this.listService.deleteByUserId(id, user.id)
        }
       
    }

    
    @Put(':id')
    @Roles(userRole.user, userRole.admin)
    update(@Req() req: RequestModel, @Param('id') id:string, @Body() updateTodoDto:UpdateTodoDto):Promise<TodoItem>{
        const { user } = req;
        if(user.role === userRole.admin){
            return this.listService.updateTodo(id,updateTodoDto)
        }
        if (user.role === userRole.user){
            return this.listService.updateTodoByUserId(id, user.id, updateTodoDto)
        }
    }

}

