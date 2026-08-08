import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TaskStatus, Priority } from '../../common/enums';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: String, enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @Prop({ type: String, enum: Priority, default: Priority.NONE })
  priority: Priority;

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  projectId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  members: Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  labels: string[];

  @Prop()
  dueDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reporter: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  resources: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
