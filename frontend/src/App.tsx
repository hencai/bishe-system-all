import { useRoutes } from 'react-router-dom';
import { routes } from './routes';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const element = useRoutes(routes);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthRoute = location.pathname.startsWith('/auth');
    
    if (!token && !isAuthRoute) {
      // 如果没有token且不是在auth路由下，重定向到登录页
      navigate('/auth/login', { 
        replace: true,
        state: { from: location.pathname }
      });
    }
  }, [location.pathname, navigate]);

  return element;
};

export default App;
