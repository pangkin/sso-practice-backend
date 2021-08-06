import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Message, MessageDocument } from '../schemas/message.schema';
import { ExpressUser } from '../schemas/user.schema';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async getAll(): Promise<Message[]> {
    return this.messageModel.find().exec();
  }

  async create(createMessageDto: CreateMessageDto) {
    const newMessage = new this.messageModel(createMessageDto);
    newMessage.save();
    return { success: true };
  }

  async delete(user: ExpressUser, id: string) {
    if (!id) {
      throw new BadRequestException('invaild request');
    }
    const msg = await await this.messageModel.findById(id);
    if (!msg) {
      throw new NotFoundException('cant not find message');
    }
    if (user.role !== 'admin' && msg.nickname !== user.nickname) {
      throw new ForbiddenException('this message is not yours');
    }
    msg.deleteOne();
    return { success: true };
  }
}
