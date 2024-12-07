import request from '../utils/request';
import { API_BASE_URL } from '../config/config';
import type { getUsersResponse, User } from '../types/user';

const getToken = () => localStorage.getItem('token') || '';

interface ResetPasswordResponse {
  newPassword: string;
  message: string;
}

interface PasswordChangeData {
  newPassword: string;
  confirmPassword: string;
}

export const getUsers = async (params: { page: number; pageSize: number }): Promise<getUsersResponse> => {
  const response = await request.get<getUsersResponse>('/api/users', { params });
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

export const updateUserRole = async (userId: number, role: string) => {
  try {
    const response = await request.put(`/api/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error('修改权限失败:', error);
    throw new Error('修改权限失败');
  }
};