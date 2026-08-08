import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findByTaskId(taskId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ taskId: new Types.ObjectId(taskId) })
      .populate('userId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<Comment> {
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

  async delete(id: string): Promise<Comment> {
    const deletedComment = await this.commentModel.findByIdAndDelete(id).exec();
    if (!deletedComment) {
      throw new NotFoundException('Comment not found');
    }
    return deletedComment;
  }
}
