import { api } from '../lib/api';
import { User } from '../types';

export const userService = {
  async getCurrentUser(): Promise<User> {
    return api.get<User>('/users/me');
  },

  async updateCurrentUser(data: Partial<User>): Promise<User> {
    return api.patch<User>('/users/me', data);
  },

  async updateAvatar(avatar: string): Promise<User> {
    return api.post<User>('/users/me/avatar', { avatar });
  },
};
