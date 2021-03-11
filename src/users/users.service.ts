import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  //string as output because we need the generated id
  async create(createUserDto: CreateUserDto): Promise<String> {
    const newUser = new this.userModel(createUserDto);
    const resp = await newUser.save();
    return resp._id;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => ({
      id: user._id,
      name: user.name,
    }));
  }

  //return optional characters of object
  async findSingleUser(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('Could not find the user');
    }
    return { id: user._id, name: user.name };
  }

	async updateUser(id: string, name: string) {
    const updatedUser = await this.userModel.findById(id);
    if (!updatedUser) {
      throw new NotFoundException('Could not find the user');
    }
    if (name) {
      updatedUser.name = name;
    }
    updatedUser.save();
  }

  async delete(id: string) {
    const res = await this.userModel.deleteOne({ _id: id }).exec();
    if (res.n === 0) {
      throw new NotFoundException('Could not find the user');
    }
    return 'Deleted';
  }
}
