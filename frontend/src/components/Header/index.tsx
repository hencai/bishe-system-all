import React, { useEffect, useState } from 'react';
import { Avatar, Dropdown, Menu } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth';
import styles from './index.module.css';

interface UserInfo {
  username: string;
  avatar?: string;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    // 从localStorage获取用户信息
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUserInfo(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    logout(); // 调用 auth service 中的 logout
    navigate('/login');
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={styles.header}>
      <div className={styles.logo}>检测系统</div>
      {userInfo && (
        <div className={styles.userInfo}>
          <Dropdown overlay={menu} placement="bottomRight">
            <div className={styles.userProfile}>
              <Avatar 
                size="small" 
                icon={<UserOutlined />} 
                src={userInfo.avatar}
                className={styles.avatar}
              />
              <span className={styles.username}>{userInfo.username}</span>
            </div>
          </Dropdown>
        </div>
      )}
    </div>
  );
};

export default Header; 