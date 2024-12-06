import axios from 'axios';

const request = axios.create({
  baseURL: process.env.REACT_APP_LOCAL_API_URL, // 使用本地管理服务的 URL
  timeout: 5000,
});

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

export default request; 