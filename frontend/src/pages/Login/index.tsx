import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { login } from '../../services/auth';
import styles from './index.module.css';
import { LoginForm } from '../../types/auth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const response = await login(values);
      if (response) {
        message.success('登录成功');
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      if (error.message === '用户名或密码错误') {
        message.error('用户名或密码错误');
      } else if (error.message === '账号已被禁用，请联系管理员') {
        message.error('账号已被禁用，请联系管理员');
      } else {
        message.error(error.message || '登录失败，请重试');
      }
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card} title="遥感图像目标检测系统">
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="用户名" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              登录
            </Button>
          </Form.Item>
          
          <div className={styles.register}>
            还没有账号？ <Link to="/auth/register">立即注册</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 