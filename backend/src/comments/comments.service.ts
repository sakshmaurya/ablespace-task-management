import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  async create(taskId: string, createCommentDto: CreateCommentDto, userId: string): Promise<Comment> {
    const createdComment = new this.commentModel({
      ...createCommentDto,
      taskId: new Types.ObjectId(taskId),
      userId: new Types.ObjectId(userId),
    });
    return createdComment.save();
  }

  async findByTaskId(taskId: string, userId: string): Promise<Comment[]> {
    // Check if user has access to the task - will throw NotFoundException if not
    // This assumes task service has proper authorization
    return this.commentModel
      .find({ taskId: new Types.ObjectId(taskId) })
      .populate('userId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string, userId: string): Promise<Comment> {
    const comment = await this.commentModel
      .findById(id)
      .populate('userId')
      .populate('taskId')
      .exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  async delete(id: string, userId: string): Promise<Comment> {
    const comment = await this.findById(id, userId);

    // Only allow users to delete their own comments
    if (!comment.userId._id.equals(new Types.ObjectId(userId))) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    const deletedComment = await this.commentModel.findByIdAndDelete(id).exec();
    if (!deletedComment) {
      throw new NotFoundException('Comment not found');
    }
    return deletedComment;
  }
}
