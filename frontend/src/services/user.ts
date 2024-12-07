import request from '../utils/request';
import type { User } from '../types/user';

interface ResetPasswordResponse {
  newPassword: string;
  message: string;
}

interface PasswordChangeData {
  newPassword: string;
  confirmPassword: string;
}

export const getUsers = async (params: { page: number; pageSize: number }): Promise<User[]> => {
  const response = await request.get<User[]>('/api/users', { params });
  return response.data;
};

export const updateUser = async (id: number, data: { username?: string; email?: string }) => {
  const response = await request.put(`/api/users/${id}`, data);
  return response.data;
};

export const resetUserPassword = async (id: number, data: PasswordChangeData) => {
  const response = await request.post<{ message: string }>(`/api/users/${id}/change-password`, data);
  return response.data;
};

export const toggleUserStatus = async (id: number, status: boolean) => {
  const response = await request.put(`/api/users/${id}/status`, { status });
  return response.data;
}; 