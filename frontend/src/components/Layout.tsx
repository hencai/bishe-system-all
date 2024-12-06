import React from 'react';
import { Layout as AntLayout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { HomeOutlined, SearchOutlined, HistoryOutlined } from '@ant-design/icons';

const { Header, Content } = AntLayout;

const Layout: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/detection',
      icon: <SearchOutlined />,
      label: <Link to="/detection">目标检测</Link>,
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: <Link to="/history">检测历史</Link>,
    },
  ];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: 0 }}>
        <div style={{ float: 'left', width: 120, height: 31, margin: '16px 24px' }}>
          <h2 style={{ margin: 0 }}>目标检测</h2>
        </div>
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ justifyContent: 'flex-end' }}
        />
      </Header>
      <Content>
        <Outlet />
      </Content>
    </AntLayout>
  );
};

export default Layout; 