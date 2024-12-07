import { Navigate, RouteObject } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Welcome from '../pages/Welcome';
import Detection from '../pages/Detection';
import History from '../pages/History';
import Users from '../pages/Users';
import NotFound from '../pages/NotFound';
import MainLayout from '../components/Layout/MainLayout';
import PrivateRoute from '../components/PrivateRoute';

export const routes: RouteObject[] = [
  {
    path: '/auth',
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '', element: <Navigate to="/auth/login" replace /> },
    ],
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      { 
        path: 'welcome', 
        element: (
          <PrivateRoute>
            <Welcome />
          </PrivateRoute>
        ) 
      },
      { 
        path: 'detection', 
        element: (
          <PrivateRoute>
            <Detection />
          </PrivateRoute>
        ) 
      },
      { 
        path: 'history', 
        element: (
          <PrivateRoute>
            <History />
          </PrivateRoute>
        ) 
      },
      { 
        path: 'users', 
        element: (
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        ) 
      },
      { path: '', element: <Navigate to="/welcome" replace /> },
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
];
