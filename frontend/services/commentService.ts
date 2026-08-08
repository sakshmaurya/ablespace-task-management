import { api } from '../lib/api';
import { Comment } from '../types';

export const commentService = {
  async getComments(taskId: string): Promise<Comment[]> {
    return api.get<Comment[]>(`/comments/tasks/${taskId}`);
  },

  async createComment(taskId: string, message: string): Promise<Comment> {
    return api.post<Comment>(`/comments/tasks/${taskId}`, { message });
  },

  async deleteComment(id: string): Promise<Comment> {
    return api.delete<Comment>(`/comments/${id}`);
  },
};
