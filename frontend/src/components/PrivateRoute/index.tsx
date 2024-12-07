import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { message } from 'antd';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      message.warning('请先登录');
    }
  }, [token]);

  if (!token) {
    // 重定向到登录页面，并保存当前尝试访问的路径
    return (
      <Navigate 
        to="/auth/login" 
        state={{ from: location.pathname }}
        replace 
      />
    );
  }

  return children;
};

export default PrivateRoute; 