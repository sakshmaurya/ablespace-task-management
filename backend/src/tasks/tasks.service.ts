import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { Subtask, SubtaskDocument } from './schemas/subtask.schema';
import { Activity, ActivityDocument } from './schemas/activity.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskPriorityDto } from './dto/update-task-priority.dto';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Subtask.name) private subtaskModel: Model<SubtaskDocument>,
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const createdTask = new this.taskModel({
      ...createTaskDto,
      createdBy: new Types.ObjectId(userId),
    });
    const task = await createdTask.save();

    await this.createActivity(task._id.toString(), userId, 'created', null, task.title);
    return task;
  }

  async findAll(query: any = {}): Promise<Task[]> {
    const filter: any = {};

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.priority) {
      filter.priority = query.priority;
    }

    if (query.projectId) {
      filter.projectId = new Types.ObjectId(query.projectId);
    }

    if (query.members) {
      filter.members = { $in: [new Types.ObjectId(query.members)] };
    }

    if (query.labels) {
      filter.labels = { $in: query.labels };
    }

    if (query.dueDate) {
      filter.dueDate = { $lte: new Date(query.dueDate) };
    }

    if (query.reporter) {
      filter.reporter = new Types.ObjectId(query.reporter);
    }

    return this.taskModel
      .find(filter)
      .populate('projectId')
      .populate('members')
      .populate('reporter')
      .populate('createdBy')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<Task> {
    const task = await this.taskModel
      .findById(id)
      .populate('projectId')
      .populate('members')
      .populate('reporter')
      .populate('createdBy')
      .exec();

    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    const oldTask = await this.findById(id);

    if (updateTaskDto.status && updateTaskDto.status !== oldTask.status) {
      await this.createActivity(id, userId, 'status_changed', oldTask.status, updateTaskDto.status);
    }

    if (updateTaskDto.priority && updateTaskDto.priority !== oldTask.priority) {
      await this.createActivity(id, userId, 'priority_changed', oldTask.priority, updateTaskDto.priority);
    }

    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .populate('projectId')
      .populate('members')
      .populate('reporter')
      .populate('createdBy')
      .exec();

    if (!updatedTask) {
      throw new NotFoundException('Task not found');
    }
    return updatedTask;
  }

  async updateStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto, userId: string): Promise<Task> {
    const task = await this.findById(id);
    await this.createActivity(id, userId, 'status_changed', task.status, updateTaskStatusDto.status);

    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, { status: updateTaskStatusDto.status }, { new: true })
      .populate('projectId')
      .populate('members')
      .populate('reporter')
      .populate('createdBy')
      .exec();

    if (!updatedTask) {
      throw new NotFoundException('Task not found');
    }
    return updatedTask;
  }

  async updatePriority(id: string, updateTaskPriorityDto: UpdateTaskPriorityDto, userId: string): Promise<Task> {
    const task = await this.findById(id);
    await this.createActivity(id, userId, 'priority_changed', task.priority, updateTaskPriorityDto.priority);

    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, { priority: updateTaskPriorityDto.priority }, { new: true })
      .populate('projectId')
      .populate('members')
      .populate('reporter')
      .populate('createdBy')
      .exec();

    if (!updatedTask) {
      throw new NotFoundException('Task not found');
    }
    return updatedTask;
  }

  async delete(id: string): Promise<Task> {
    const deletedTask = await this.taskModel.findByIdAndDelete(id).exec();
    if (!deletedTask) {
      throw new NotFoundException('Task not found');
    }

    await this.subtaskModel.deleteMany({ taskId: new Types.ObjectId(id) });
    await this.activityModel.deleteMany({ taskId: new Types.ObjectId(id) });

    return deletedTask;
  }

  async createSubtask(taskId: string, createSubtaskDto: CreateSubtaskDto): Promise<Subtask> {
    const createdSubtask = new this.subtaskModel({
      ...createSubtaskDto,
      taskId: new Types.ObjectId(taskId),
    });
    return createdSubtask.save();
  }

  async findSubtasks(taskId: string): Promise<Subtask[]> {
    return this.subtaskModel
      .find({ taskId: new Types.ObjectId(taskId) })
      .populate('members')
      .exec();
  }

  async updateSubtask(id: string, updateSubtaskDto: UpdateSubtaskDto): Promise<Subtask> {
    const updatedSubtask = await this.subtaskModel
      .findByIdAndUpdate(id, updateSubtaskDto, { new: true })
      .populate('members')
      .exec();

    if (!updatedSubtask) {
      throw new NotFoundException('Subtask not found');
    }
    return updatedSubtask;
  }

  async deleteSubtask(id: string): Promise<Subtask> {
    const deletedSubtask = await this.subtaskModel.findByIdAndDelete(id).exec();
    if (!deletedSubtask) {
      throw new NotFoundException('Subtask not found');
    }
    return deletedSubtask;
  }

  async findActivity(taskId: string): Promise<Activity[]> {
    return this.activityModel
      .find({ taskId: new Types.ObjectId(taskId) })
      .populate('userId')
      .sort({ createdAt: -1 })
      .exec();
  }

  private async createActivity(taskId: string, userId: string, action: string, oldValue: any, newValue: any): Promise<Activity> {
    const activity = new this.activityModel({
      taskId: new Types.ObjectId(taskId),
      userId: new Types.ObjectId(userId),
      action,
      oldValue: oldValue ? String(oldValue) : null,
      newValue: newValue ? String(newValue) : null,
    });
    return activity.save();
  }
}
