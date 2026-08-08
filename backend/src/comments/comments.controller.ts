import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('comments')
@Controller('comments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get('tasks/:taskId')
  @ApiOperation({ summary: 'Get all comments for a task' })
  async findByTaskId(@Param('taskId') taskId: string) {
    return this.commentsService.findByTaskId(taskId);
  }

  @Post('tasks/:taskId')
  @ApiOperation({ summary: 'Create a comment for a task' })
  async create(@Param('taskId') taskId: string, @Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.commentsService.create(taskId, createCommentDto, req.user._id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  async delete(@Param('id') id: string) {
    return this.commentsService.delete(id);
  }
}
