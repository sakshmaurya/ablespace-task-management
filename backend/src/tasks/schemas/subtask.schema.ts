import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Priority } from '../../common/enums';

export type SubtaskDocument = Subtask & Document;

@Schema({ timestamps: true })
export class Subtask {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Task', required: true })
  taskId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ type: String, enum: Priority, default: Priority.NONE })
  priority: Priority;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  members: Types.ObjectId[];

  @Prop()
  dueDate: Date;

  @Prop({ default: false })
  completed: boolean;
}

export const SubtaskSchema = SchemaFactory.createForClass(Subtask);
