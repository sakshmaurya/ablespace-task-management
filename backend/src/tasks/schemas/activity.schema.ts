import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ActivityDocument = Activity & Document;

@Schema({ timestamps: true })
export class Activity {
  @Prop({ type: Types.ObjectId, ref: 'Task', required: true })
  taskId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  action: string;

  @Prop()
  oldValue: string;

  @Prop()
  newValue: string;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
