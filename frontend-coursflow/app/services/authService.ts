import { api } from './api';
import { LoginRequest, LoginResponse } from '../types';

interface RegisterData {
  nom: string;
  prenom: string;
  email: string;
  password: string;
  telephone?: string;
  role: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return api.post<LoginResponse>('/Auth/login', credentials);
  },

  async register(data: RegisterData): Promise<{ message: string; userId: number }> {
    return api.post<{ message: string; userId: number }>('/Auth/register', data);
  },

  async logout(): Promise<{ message: string }> {
    return api.post<{ message: string }>('/Auth/logout');
  },
};