import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Todo, TodoDocument } from './schemas/todo.schema';
import { CreateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectModel('Todo') private readonly todoModel: Model<TodoDocument>,
  ) {}

  //string as output because we need the generated id
  async create(createTodoDto: CreateTodoDto): Promise<String> {
    const newTodo = new this.todoModel(createTodoDto);
    const resp = await newTodo.save();
    return resp._id;
  }

  async findAll(): Promise<Todo[]> {
    const todos = await this.todoModel.find().exec();
    return todos.map((todo) => ({
      id: todo._id,
      desc: todo.desc,
      isdone: todo.isdone,
    }));
  }

  //return optional characters of object
  async findSingleTodo(id: string): Promise<Todo> {
    const todo = await this.todoModel.findById(id);
    if (!todo) {
      throw new NotFoundException('Could not find the todo');
    }
    return { id: todo._id, desc: todo.desc, isdone: todo.isdone };
  }

  async updateTodo(id: string, desc: string, isdone: boolean) {
    const updatedTodo = await this.todoModel.findById(id);
    if (!updatedTodo) {
      throw new NotFoundException('Could not find the todo');
    }
    if (desc) {
      updatedTodo.desc = desc;
    }
    if (isdone) {
      updatedTodo.isdone = isdone;
    }
    updatedTodo.save();
  }

  async delete(id: string) {
    const res = await this.todoModel.deleteOne({ _id: id }).exec();
    if (res.n === 0) {
      throw new NotFoundException('Could not find the todo');
    }
    return 'Deleted';
  }
}
