import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Detection from '../pages/Detection';
import History from '../pages/History';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'detection',
        element: <Detection />,
      },
      {
        path: 'history',
        element: <History />,
      },
    ],
  },
]);

export default router; 