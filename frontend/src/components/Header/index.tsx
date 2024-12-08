import React, { useEffect, useState } from 'react';
import { Avatar, Dropdown, Menu } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth';
import styles from './index.module.css';

interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    // 从localStorage获取当前登录用户信息
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserInfo(user);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    localStorage.removeItm('user'); // 确保清除用户信息
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