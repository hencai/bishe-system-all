import { Navigate, RouteObject } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Welcome from '../pages/Welcome';
import Detection from '../pages/Detection';
import MainLayout from '../components/Layout/MainLayout';

export const routes: RouteObject[] = [
  {
    path: '/auth',
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '', element: <Navigate to="/auth/login" /> },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'welcome', element: <Welcome /> },
      { path: 'detection', element: <Detection /> },
      { path: '', element: <Navigate to="/welcome" /> },
    ],
  },
];