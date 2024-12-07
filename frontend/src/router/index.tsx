import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/MainLayout';
import Welcome from '../pages/Welcome';
import Detection from '../pages/Detection';
import History from '../pages/History/history'; 
import Users from '../pages/Users';
import Login from '../pages/Login';
import Register from '../pages/Register';

const router = createBrowserRouter([
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: '',
        element: <Navigate to="/auth/login" />,
      },
    ],
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'welcome',
        element: <Welcome />,
      },
      {
        path: 'detection',
        element: <Detection />,
      },
      {
        path: 'history',
        element: <History />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: '',
        element: <Navigate to="/welcome" />,
      },
    ],
  },
]);

export default router; 