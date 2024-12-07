import { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Space, Avatar, Tooltip, message, Modal, Form, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { UserOutlined, MailOutlined, CalendarOutlined, LockOutlined } from '@ant-design/icons';
import { getUsers, resetUserPassword, toggleUserStatus } from '../../services/user';
import type { User } from '../../types/user';
import styles from './index.module.css';

const Users: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [form] = Form.useForm();
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

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
    fetchUsers();
  }, []);

  const handleModifyPassword = (id: number) => {
    setCurrentUserId(id);
    setIsPasswordModalVisible(true);
    form.resetFields();
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

  const handlePasswordModalCancel = () => {
    setIsPasswordModalVisible(false);
    form.resetFields();
  };

  const handleToggleStatus = async (id: number, currentStatus: number) => {
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
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            size="small"
            onClick={() => handleModifyPassword(record.id)}
          >
            修改密码
          </Button>
          <Button 
            danger={record.status === 1} 
            type={record.status === 1 ? 'primary' : 'default'} 
            size="small"
            onClick={() => handleToggleStatus(record.id, record.status)}
          >
            {record.status === 1 ? '禁用' : '启用'}
          </Button>
        </Space>
      ),
    },
  ];

  const handleTableChange = (page: number, size: number) => {
    console.log('分页变化:', { page, size });
    setCurrentPage(page);
    setPageSize(size);
    fetchUsers(page, size);
  };

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
            onChange: handleTableChange,
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
    </div>
  );
};

export default Users;