import { api } from '../lib/api';
import { AuthResponse, User } from '../types';

export const authService = {
  async guestLogin(name?: string): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/guest', { name });
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/login', { email, password });
  },

  async getCurrentUser(): Promise<User> {
    return api.get<User>('/auth/me');
  },

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  },
};
