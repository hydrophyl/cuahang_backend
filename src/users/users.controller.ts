import {  Body,  Controller,  Delete,  Get,  Param,  Patch,  Post,} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // get all users
  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // create new user
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const generatedId = await this.usersService.create(createUserDto);
    return { id: generatedId };
  }

  //find one user
  @Get(':id')
  async findSingleUser(@Param('id') id: string): Promise<User> {
    return this.usersService.findSingleUser(id);
  }

  // update user infos
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body('name') name: string,
  ) {
    await this.usersService.updateUser(id, name);
    return ;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.usersService.delete(id);
  }
}
