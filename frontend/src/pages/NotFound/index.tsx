import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate('/welcome');
  };

  const handleBackLogin = () => {
    navigate('/auth/login');
  };

  return (
    <div className={styles.container}>
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在"
        extra={[
          <Button type="primary" key="home" onClick={handleBackHome}>
            返回首页
          </Button>,
          <Button key="login" onClick={handleBackLogin}>
            去登录
          </Button>,
        ]}
      />
    </div>
  );
};

export default NotFound; 