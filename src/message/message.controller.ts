import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';

@Controller('api/msg')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  async getMessage() {
    return this.messageService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Req() req, @Param('id') id) {
    return this.messageService.delete(req.user, id);
  }
}
