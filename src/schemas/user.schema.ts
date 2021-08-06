import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  accountId: string;

  @Prop()
  nickname: string;

  @Prop()
  email: string;

  //@Prop()
  //password: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop()
  accessToken: string;

  @Prop()
  refreshToken: string;
}

export class ExpressUser implements Express.User {
  jwt: string;
  nickname: string;
  role: string;
  email: string;
  accountId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
