import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: any): Promise<User> {
    const hashedPassword = createUserDto.password
      ? await bcrypt.hash(createUserDto.password, 10)
      : undefined;

    const createdUser = new this.userModel({
      ...createUserDto,
      passwordHash: hashedPassword,
    });
    return createdUser.save();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({ username }).exec();
  }

  async update(id: string, updateUserDto: any): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
      delete updateUserDto.password;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
