import React from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { FormInstance } from 'antd/es/form';
import './style.css';

interface LoginParams {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<LoginParams>();

  const handleLogin = async (values: LoginParams) => {
    try {
      if (values.username === 'admin' && values.password === 'admin123') {
        message.success('登录成功');
        localStorage.setItem('user', JSON.stringify({ username: values.username }));
        navigate('/dashboard');
      } else {
        message.error('用户名或密码错误');
      }
    } catch (error) {
      message.error('登录失败，请重试');
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" title="遥感图像目标检测系统">
        <Form<LoginParams>
          form={form}
          name="login"
          onFinish={handleLogin}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
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
        </Form>
      </Card>
    </div>
  );
};

export default Login;