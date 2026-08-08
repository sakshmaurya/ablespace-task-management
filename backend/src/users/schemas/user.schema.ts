import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Theme, AccentColor } from '../../common/enums';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  avatar: string;

  @Prop()
  title: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  passwordHash: string;

  @Prop({ default: false })
  isGuest: boolean;

  @Prop({ type: String, enum: Theme, default: Theme.LIGHT })
  theme: Theme;

  @Prop({ type: String, enum: AccentColor, default: AccentColor.BLUE })
  accentColor: AccentColor;
}

export const UserSchema = SchemaFactory.createForClass(User);
