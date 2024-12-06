import { Layout, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, CameraOutlined, HistoryOutlined } from '@ant-design/icons';
import styles from './MainLayout.module.css';

const { Header, Content } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  console.log('Current location:', location.pathname);

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
  ];

  const handleMenuClick = (key: string) => {
    console.log('Navigating to:', key);
    navigate(key);
  };

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logo}>目标检测系统</div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content className={styles.content}>
        <Outlet />
      </Content>
    </Layout>
  );
};

export default MainLayout;
