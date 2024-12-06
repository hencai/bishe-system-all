import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Detection from '../pages/Detection';
import History from '../pages/history';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/detection',
        element: <Detection />,
      },
      {
        path: '/history',
        element: <History />,
      },
    ],
  },
]);

export default router; 