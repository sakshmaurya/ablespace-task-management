import { api } from '../lib/api';
import { Task, Subtask, Activity, TaskStatus, Priority } from '../types';

export interface TaskFilters {
  search?: string;
  status?: TaskStatus;
  priority?: Priority;
  projectId?: string;
  members?: string;
  labels?: string;
  dueDate?: string;
  reporter?: string;
}

export const taskService = {
  async getTasks(filters?: TaskFilters): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value);
        }
      });
    }
    const queryString = params.toString();
    return api.get<Task[]>(`/tasks${queryString ? `?${queryString}` : ''}`);
  },

  async getTask(id: string): Promise<Task> {
    return api.get<Task>(`/tasks/${id}`);
  },

  async createTask(data: Partial<Task>): Promise<Task> {
    return api.post<Task>('/tasks', data);
  },

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    return api.patch<Task>(`/tasks/${id}`, data);
  },

  async deleteTask(id: string): Promise<Task> {
    return api.delete<Task>(`/tasks/${id}`);
  },

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    return api.patch<Task>(`/tasks/${id}/status`, { status });
  },

  async updateTaskPriority(id: string, priority: Priority): Promise<Task> {
    return api.patch<Task>(`/tasks/${id}/priority`, { priority });
  },

  async getSubtasks(taskId: string): Promise<Subtask[]> {
    return api.get<Subtask[]>(`/tasks/${taskId}/subtasks`);
  },

  async createSubtask(taskId: string, data: Partial<Subtask>): Promise<Subtask> {
    return api.post<Subtask>(`/tasks/${taskId}/subtasks`, data);
  },

  async updateSubtask(id: string, data: Partial<Subtask>): Promise<Subtask> {
    return api.patch<Subtask>(`/tasks/subtasks/${id}`, data);
  },

  async deleteSubtask(id: string): Promise<Subtask> {
    return api.delete<Subtask>(`/tasks/subtasks/${id}`);
  },

  async getActivity(taskId: string): Promise<Activity[]> {
    return api.get<Activity[]>(`/tasks/${taskId}/activity`);
  },
};
