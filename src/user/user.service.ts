import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByNickname(nickname: string) {
    return await this.userModel.findOne({ nickname }).exec();
  }

  async newUser(createUserDto: CreateUserDto): Promise<boolean> {
    const user = await this.userModel
      .findOne({ nickname: createUserDto.nickname })
      .exec();
    if (user) {
      throw new ConflictException('username already exist');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    try {
      newUser.save();
    } catch (e) {
      throw new BadRequestException();
    }
    return true;
  }

  async findOrCreate(profile: any, accessToken: string, refreshToken: string) {
    try {
      let user = await this.findByNickname(profile.nickname);
      if (!user)
        user = await this.userModel.create({
          accessToken,
          refreshToken,
          role: profile.role,
          nickname: profile.nickname,
          email: profile.email,
          accountId: profile.accountId,
        });
      else {
        await user
          .updateOne({
            accessToken,
            refreshToken,
            role: profile.role,
            nickname: profile.nickname,
            email: profile.email,
            accountId: profile.accountId,
          })
          .exec();
      }
      return user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
