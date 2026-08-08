import { api } from '../lib/api';
import { Settings } from '../types';

export const settingsService = {
  async getSettings(): Promise<Settings> {
    return api.get<Settings>('/settings');
  },

  async updateSettings(data: Partial<Settings>): Promise<Settings> {
    return api.patch<Settings>('/settings', data);
  },
};
