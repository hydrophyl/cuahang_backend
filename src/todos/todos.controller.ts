import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodosService } from './todos.service';
import { Todo } from './schemas/todo.schema';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  // get all todos
  @Get()
  async findAll(): Promise<Todo[]> {
    return this.todosService.findAll();
  }

  // create new todo
  @Post()
  async create(@Body() createTodoDto: CreateTodoDto) {
    const generatedId = await this.todosService.create(createTodoDto);
    return { id: generatedId };
  }

  //find one todo
  @Get(':id')
  async findSingleTodo(@Param('id') id: string): Promise<Todo> {
    return this.todosService.findSingleTodo(id);
  }

  // update todo infos
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body('desc') desc: string,
    @Body('isdone') isdone: boolean,
  ) {
    await this.todosService.updateTodo(id, desc, isdone);
    return;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.todosService.delete(id);
  }
}
