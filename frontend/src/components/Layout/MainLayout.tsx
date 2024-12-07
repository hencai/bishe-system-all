import { Layout, Menu, Avatar, Dropdown, message } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, CameraOutlined, HistoryOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { logout } from '../../services/auth';
import styles from './MainLayout.module.css';

const { Header, Content } = Layout;

interface UserInfo {
  username: string;
  avatar?: string;
}

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUserInfo(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      message.success('退出成功');
      navigate('/auth/login');
    } catch (error) {
      message.error('退出失败，请重试');
    }
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/detection',
      icon: <CameraOutlined />,
      label: '目标检测',
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: '检测历史',
    },
    {
      key: '/users',
      icon: <HistoryOutlined />,
      label: '用户管理',
    },
  ];

  const handleMenuClick = (key: string) => {
    console.log('Navigating to:', key);
    navigate(key);
  };

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logo}>遥感图像目标检测系统</div>
        <div className={styles.headerRight}>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => handleMenuClick(key)}
            style={{ flex: 1, minWidth: 0 }}
          />
          {userInfo && (
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div className={styles.userInfo}>
                <Avatar size="small" icon={<UserOutlined />} src={userInfo.avatar} />
                <span className={styles.username}>{userInfo.username}</span>
              </div>
            </Dropdown>
          )}
        </div>
      </Header>
      <Content className={styles.content}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default MainLayout;
