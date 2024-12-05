import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Detect from './pages/Detect';
import MainLayout from './layouts/MainLayout';

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('user');

  const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
    return isAuthenticated ? (
      <MainLayout>{element}</MainLayout>
    ) : (
      <Navigate to="/login" replace />
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/detect" element={<PrivateRoute element={<Detect />} />} />
        <Route path="/dashboard" element={<PrivateRoute element={<div>仪表板页面</div>} />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
