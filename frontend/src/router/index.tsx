import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/MainLayout';
import Welcome from '../pages/Welcome';
import Detection from '../pages/Detection';
import History from '../pages/History/index'; 
import Users from '../pages/Users';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Report from '../pages/Report';
import PrivateRoute from '../components/PrivateRoute';

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
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        path: 'welcome',
        element: (
          <PrivateRoute>
            <Welcome />
          </PrivateRoute>
        ),
      },
      {
        path: 'detection',
        element: (
          <PrivateRoute>
            <Detection />
          </PrivateRoute>
        ),
      },
      {
        path: 'history',
        element: (
          <PrivateRoute>
            <History />
          </PrivateRoute>
        ),
      },
      {
        path: 'users',
        element: (
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        ),
      },
      {
        path: 'report',
        element: (
          <PrivateRoute>
            <Report />
          </PrivateRoute>
        ),
      },
      {
        path: '',
        element: <Navigate to="/welcome" />,
      },
    ],
  },
]);

export default router;