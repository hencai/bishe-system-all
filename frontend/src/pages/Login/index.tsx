import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/auth';
import styles from './index.module.css';
import { LoginForm } from '../../types/auth';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    try {
      const response = await login(values);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        message.success('登录成功');
        navigate('/');
      }
    } catch (error: any) {
      // 处理不同的错误情况
      if (error.response) {
        switch (error.response.status) {
          case 403:
            message.error('账号已被禁用，请联系管理员');
            break;
          case 401:
            message.error('用户名或密码错误');
            break;
          default:
            message.error('登录失败，请重试');
        }
      } else {
        message.error('登录失败，请重试');
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