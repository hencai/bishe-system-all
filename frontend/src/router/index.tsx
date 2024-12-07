import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout/MainLayout';
import Welcome from '../pages/Welcome';
import Detection from '../pages/Detection';
import History from '../pages/History/history'; 
import Users from '../pages/Users';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Welcome />,
      },
      {
        path: '/detection',
        element: <Detection />,
      },
      {
        path: '/history',
        element: <History />,
      },
      {
        path: '/users',
        element: <Users />,
      },
    ],
  },
]);

export default router; 