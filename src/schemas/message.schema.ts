import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop()
  body: string;

  @Prop()
  nickname: string;

  @Prop({ default: Date.now })
  date: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
