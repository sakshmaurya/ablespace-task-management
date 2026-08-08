import { api } from '../lib/api';
import { User } from '../types';

export const userService = {
  async getCurrentUser(): Promise<User> {
    return api.get<User>('/users/me');
  },

  async updateCurrentUser(data: Partial<User>): Promise<User> {
    return api.patch<User>('/users/me', data);
  },
};
