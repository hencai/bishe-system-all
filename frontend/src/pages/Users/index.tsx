import { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Space, Avatar, Tooltip, message, Modal, Form, Input, Select } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { UserOutlined, MailOutlined, CalendarOutlined, LockOutlined, CrownOutlined } from '@ant-design/icons';
import { getUsers, resetUserPassword, toggleUserStatus, updateUserRole } from '../../services/user';
import type { User } from '../../types/user';
import styles from './index.module.css';

const { Option } = Select;

const Users: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [form] = Form.useForm();
  const [roleForm] = Form.useForm();
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchUsers = async (page = currentPage, size = pageSize) => {
    try {
      setLoading(true);
      const response = await getUsers({ page, pageSize: size });
      
      if (response) {
        setUsers(response.records);
        setTotal(response.total);
        setCurrentPage(page);
        setPageSize(size);
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 从 localStorage 获取当前用户信息
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    fetchUsers();
  }, []);

  const handleModifyPassword = (id: number) => {
    setCurrentUserId(id);
    setIsPasswordModalVisible(true);
    form.resetFields();
  };

  const handleModifyRole = (targetUser: User) => {
    // 检查当前用户是否为管理员
    if (currentUser?.role !== 'admin') {
      message.error('只有管理员可以修改用户权限');
      return;
    }

    // 检查是否试图修改自己的权限
    if (targetUser.id === currentUser?.id) {
      message.error('不能修改自己的权限，请联系高级管理员');
      return;
    }

    // 检查是否试图修改其他管理员的权限
    if (targetUser.role === 'admin') {
      message.error('无权修改管理员权限，请联系高级管理员');
      return;
    }

    setCurrentUserId(targetUser.id);
    setIsRoleModalVisible(true);
    roleForm.setFieldsValue({ role: targetUser.role });
  };

  const handlePasswordModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (currentUserId) {
        await resetUserPassword(currentUserId, values);
        message.success('密码修改成功');
        setIsPasswordModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      console.error('修改密码失败:', error);
      message.error('修改密码失败，请重试');
    }
  };

  const handleRoleModalOk = async () => {
    try {
      const values = await roleForm.validateFields();
      if (currentUserId) {
        await updateUserRole(currentUserId, values.role);
        message.success('权限修改成功');
        setIsRoleModalVisible(false);
        roleForm.resetFields();
        fetchUsers();
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('修改权限失败，请重试');
      }
    }
  };

  const handlePasswordModalCancel = () => {
    setIsPasswordModalVisible(false);
    form.resetFields();
  };

  const handleRoleModalCancel = () => {
    setIsRoleModalVisible(false);
    roleForm.resetFields();
  };

  const handleToggleStatus = async (id: number, currentStatus: number, userRole: string) => {
    // 检查是否为管理员
    if (currentUser?.role !== 'admin') {
      message.error('只有管理员可以修改用户状态');
      return;
    }

    // 检查是否是自己
    if (id === currentUser?.id) {
      message.error('不能修改自己的状态');
      return;
    }

    // 检查是否是其他管理员
    if (userRole === 'admin') {
      message.error('无权修改管理员状态，请联系高级管理员');
      return;
    }

    try {
      const newStatus = currentStatus === 0;
      await toggleUserStatus(id, newStatus);
      message.success(newStatus ? '用户已启用' : '用户已禁用');
      fetchUsers();
    } catch (error) {
      console.error('操作失败:', error);
      message.error('操作失败，请重试');
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: '用户信息',
      key: 'userInfo',
      width: 300,
      render: (_, record) => (
        <Space>
          <Avatar
            size={40}
            icon={<UserOutlined />}
            className={styles.avatar}
            style={{ 
              backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}` 
            }}
          />
          <Space direction="vertical" size={0}>
            <span className={styles.username}>{record.username}</span>
            <span className={styles.email}>
              <MailOutlined /> {record.email}
            </span>
          </Space>
        </Space>
      ),
    },
    {
      title: '注册时间',
      key: 'createdAt',
      width: 200,
      render: (_, record) => (
        <Tooltip title={new Date(record.created_at).toLocaleString()}>
          <Space>
            <CalendarOutlined />
            {new Date(record.created_at).toLocaleDateString()}
          </Space>
        </Tooltip>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 120,
      render: (_, record) => (
        <Tag color={record.status === 1 ? 'green' : 'red'}>
          {record.status === 1 ? '正常' : '已禁用'}
        </Tag>
      ),
    },
    {
      title: '权限',
      key: 'role',
      width: 120,
      render: (_, record) => (
        <Tag color={record.role === 'admin' ? 'gold' : 'blue'} icon={record.role === 'admin' ? <CrownOutlined /> : <UserOutlined />}>
          {record.role === 'admin' ? '管理员' : '普通用户'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 300,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            size="small"
            onClick={() => handleModifyPassword(record.id)}
            disabled={currentUser?.role !== 'admin' && currentUser?.id !== record.id}
          >
            修改密码
          </Button>
          <Button 
            type="primary"
            size="small"
            onClick={() => handleModifyRole(record)}
            disabled={
              currentUser?.role !== 'admin' || 
              record.role === 'admin' || 
              record.id === currentUser?.id
            }
          >
            修改权限
          </Button>
          <Button 
            danger={record.status === 1} 
            type={record.status === 1 ? 'primary' : 'default'} 
            size="small"
            onClick={() => handleToggleStatus(record.id, record.status, record.role)}
            disabled={
              currentUser?.role !== 'admin' || 
              record.id === currentUser?.id || 
              record.role === 'admin'
            }
          >
            {record.status === 1 ? '禁用' : '启用'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <Card title="用户管理">
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['4', '5', '6'],
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, pageSize) => fetchUsers(page, pageSize),
          }}
        />
      </Card>

      <Modal
        title="修改密码"
        open={isPasswordModalVisible}
        onOk={handlePasswordModalOk}
        onCancel={handlePasswordModalCancel}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度不能小于6位' },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="修改用户权限"
        open={isRoleModalVisible}
        onOk={handleRoleModalOk}
        onCancel={handleRoleModalCancel}
        destroyOnClose
      >
        <Form
          form={roleForm}
          layout="vertical"
        >
          <Form.Item
            name="role"
            label="用户权限"
            rules={[{ required: true, message: '请选择用户权限' }]}
          >
            <Select placeholder="请选择用户权限">
              <Option value="user">普通用户</Option>
              <Option value="admin">管理员</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;