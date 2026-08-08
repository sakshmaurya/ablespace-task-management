import { api } from '../lib/api';
import { Project, Priority } from '../types';

export interface ProjectFilters {
  search?: string;
  priority?: Priority;
}

export const projectService = {
  async getProjects(filters?: ProjectFilters): Promise<Project[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value);
        }
      });
    }
    const queryString = params.toString();
    return api.get<Project[]>(`/projects${queryString ? `?${queryString}` : ''}`);
  },

  async getProject(id: string): Promise<Project> {
    return api.get<Project>(`/projects/${id}`);
  },

  async createProject(data: Partial<Project>): Promise<Project> {
    return api.post<Project>('/projects', data);
  },

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    return api.patch<Project>(`/projects/${id}`, data);
  },

  async deleteProject(id: string): Promise<Project> {
    return api.delete<Project>(`/projects/${id}`);
  },
};
