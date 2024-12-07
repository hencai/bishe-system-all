import axios from 'axios';

const API_URL = 'http://localhost:3001';

interface LoginResponse {
  token: string;
  user: {
    username: string;
    avatar?: string;
  };
}

interface RegisterForm {
  username: string;
  password: string;
  email: string;
}

export const login = async (values: { username: string; password: string }): Promise<LoginResponse | null> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/api/auth/login`, {
      username: values.username,
      password: values.password
    });
    
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  } catch (error) {
    console.error('登录失败:', error);
    return null;
  }
};

export const register = async (data: RegisterForm): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, data);
    return response.status === 201;
  } catch (error) {
    console.error('注册失败:', error);
    return false;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    // 调用后端退出登录 API
    await axios.post(`${API_URL}/api/auth/logout`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('退出失败:', error);
  } finally {
    // 无论后端请求是否成功，都清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}; 