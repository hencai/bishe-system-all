import request from '../utils/request';
import { LoginForm, RegisterForm, LoginResponse } from '../types/auth';

export const login = (data: LoginForm): Promise<LoginResponse> => {
  return request.post('/api/auth/login', data);
};

export const register = (data: RegisterForm): Promise<void> => {
  return request.post('/api/auth/register', data);
};

export const logout = (): void => {
  localStorage.removeItem('token');
}; 