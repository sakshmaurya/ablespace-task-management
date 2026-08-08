import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task, TaskSchema } from './schemas/task.schema';
import { Subtask, SubtaskSchema } from './schemas/subtask.schema';
import { Activity, ActivitySchema } from './schemas/activity.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: Subtask.name, schema: SubtaskSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
