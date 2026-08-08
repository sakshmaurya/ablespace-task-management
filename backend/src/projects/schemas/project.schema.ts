import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Priority } from '../../common/enums';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: String, enum: Priority, default: Priority.NONE })
  priority: Priority;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  lead: Types.ObjectId;

  @Prop()
  dueDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
