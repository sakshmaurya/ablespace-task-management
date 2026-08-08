import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskPriorityDto } from './dto/update-task-priority.dto';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all tasks with filters' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'projectId', required: false })
  @ApiQuery({ name: 'members', required: false })
  @ApiQuery({ name: 'labels', required: false })
  @ApiQuery({ name: 'dueDate', required: false })
  @ApiQuery({ name: 'reporter', required: false })
  async findAll(@Query() query: any) {
    return this.tasksService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by id' })
  async findById(@Param('id') id: string) {
    return this.tasksService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  async create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(createTaskDto, req.user._id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() req) {
    return this.tasksService.update(id, updateTaskDto, req.user._id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  async delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update task status' })
  async updateStatus(@Param('id') id: string, @Body() updateTaskStatusDto: UpdateTaskStatusDto, @Request() req) {
    return this.tasksService.updateStatus(id, updateTaskStatusDto, req.user._id);
  }

  @Patch(':id/priority')
  @ApiOperation({ summary: 'Update task priority' })
  async updatePriority(@Param('id') id: string, @Body() updateTaskPriorityDto: UpdateTaskPriorityDto, @Request() req) {
    return this.tasksService.updatePriority(id, updateTaskPriorityDto, req.user._id);
  }

  @Get(':taskId/subtasks')
  @ApiOperation({ summary: 'Get all subtasks for a task' })
  async findSubtasks(@Param('taskId') taskId: string) {
    return this.tasksService.findSubtasks(taskId);
  }

  @Post(':taskId/subtasks')
  @ApiOperation({ summary: 'Create a subtask' })
  async createSubtask(@Param('taskId') taskId: string, @Body() createSubtaskDto: CreateSubtaskDto) {
    return this.tasksService.createSubtask(taskId, createSubtaskDto);
  }

  @Patch('subtasks/:id')
  @ApiOperation({ summary: 'Update a subtask' })
  async updateSubtask(@Param('id') id: string, @Body() updateSubtaskDto: UpdateSubtaskDto) {
    return this.tasksService.updateSubtask(id, updateSubtaskDto);
  }

  @Delete('subtasks/:id')
  @ApiOperation({ summary: 'Delete a subtask' })
  async deleteSubtask(@Param('id') id: string) {
    return this.tasksService.deleteSubtask(id);
  }

  @Get(':taskId/activity')
  @ApiOperation({ summary: 'Get activity log for a task' })
  async findActivity(@Param('taskId') taskId: string) {
    return this.tasksService.findActivity(taskId);
  }
}
