import { Layout, Menu, Avatar, Dropdown, message } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, CameraOutlined, HistoryOutlined, UserOutlined, LogoutOutlined, TeamOutlined, FileTextOutlined } from '@ant-design/icons';
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
      key: '/welcome',
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
      key: '/report',
      icon: <FileTextOutlined />,
      label: '报告管理',
    },
    {
      key: '/users',
      icon: <TeamOutlined />,
      label: '用户管理',
    },
  ];

  const handleMenuClick = (key: string) => {
    console.log('Navigating to:', key);
    navigate(key);
  };

  const getSelectedKey = () => {
    const pathname = location.pathname;
    return pathname === '/' ? '/welcome' : pathname;
  };

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logo}>遥感图像目标检测系统</div>
        <div className={styles.headerRight}>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[getSelectedKey()]}
            items={menuItems}
            onClick={({ key }) => handleMenuClick(key)}
            style={{ flex: 1, minWidth: 0 }}
          />
          {userInfo && (
            <Dropdown overlay={userMenu} placement="bottomRight">
              <div className={styles.userInfo}>
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />} 
                  src={userInfo.avatar}
                  style={{ 
                    backgroundColor: '#1890ff',  // 使用 antd 的主题蓝色
                    color: '#fff',               // 图标颜色设为白色
                    border: '2px solid #fff'     // 添加白色边框增加边界清晰度
                  }}
                />
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
