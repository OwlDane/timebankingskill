import { apiClient } from '../api';
import type { LoginRequest, RegisterRequest, AuthResponse, UserProfile } from '@/types';

export const authService = {
  // Register new user
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  // Login user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', data);
  },

  // Logout user
  logout: async (): Promise<void> => {
    return apiClient.post<void>('/auth/logout');
  },

  // Get current user profile
  getProfile: async (): Promise<UserProfile> => {
    return apiClient.get<UserProfile>('/auth/profile');
  },

  // Save token to localStorage
  saveToken: (token: string): void => {
    localStorage.setItem('token', token);
  },

  // Get token from localStorage
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Remove token from localStorage
  removeToken: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Save user to localStorage
  saveUser: (user: UserProfile): void => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Get user from localStorage
  getUser: (): UserProfile | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authService.getToken();
  },
};
