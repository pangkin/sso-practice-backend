import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ExpressUser, User, UserDocument } from '../schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AdminService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUsers(user: ExpressUser): Promise<User[]> {
    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('No Permission');
    }
    return this.userModel.find().select('_id username role').exec();
  }

  async changeRole(user: ExpressUser, updateUserDto: UpdateUserDto) {
    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('No Permission');
    }
    const { id, role } = updateUserDto;
    const target = await this.userModel.findById(id).exec();
    if (!target) {
      return { success: false };
    }
    target.role = role;
    await target.save();
    return { success: true };
  }

  async deleteUser(user: ExpressUser, id: string) {
    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('No Permission');
    }
    await this.userModel.findOneAndDelete({ _id: id }).exec();
    return { success: true };
  }
}
